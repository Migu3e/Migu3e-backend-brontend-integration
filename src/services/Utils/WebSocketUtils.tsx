import AudioService from './AudioService';
import FullAudioService from './FullAudioMaker.tsx';

class WebSocketService {
    private socket: WebSocket | null = null;
    private clientId: string | null = null;
    private audioService: AudioService;
    private fullAudioService: FullAudioService;
    private sampleRate: number = 44100;

    constructor() {
        this.audioService = new AudioService(
            this.sendAudioChunk.bind(this),
            this.handleTransmissionStop.bind(this)
        );
        this.fullAudioService = new FullAudioService(this.audioService, this.sendFullAudio.bind(this));
    }

    public async connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.socket = new WebSocket('ws://localhost:8081');

            this.socket.onopen = () => {
                console.log('Connected to server');
                resolve();
            };

            this.socket.onmessage = this.handleIncomingMessage.bind(this);

            this.socket.onerror = (error) => {
                console.error('WebSocket error:', error);
                reject(error);
            };

            this.socket.onclose = () => {
                console.log('Disconnected from server');
                this.clientId = null;
            };
        });
    }

    public disconnect(): void {
        this.stopTransmission();
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    }

    public isConnected(): boolean {
        return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
    }

    public getClientId(): string | null {
        return this.clientId;
    }



    public async startTransmission(): Promise<void> {
        if (!this.isConnected()) {
            throw new Error('WebSocket is not connected');
        }
        await this.audioService.start();
    }

    public stopTransmission(): void {
        this.audioService.stop();
    }

    private async handleIncomingMessage(event: MessageEvent): Promise<void> {
        if (typeof event.data === 'string') {
            this.clientId = event.data;
            console.log('Received client ID:', this.clientId);
        } else if (event.data instanceof ArrayBuffer) {
            this.handleBinaryMessage(event.data);
        } else if (event.data instanceof Blob) {
            const buffer = await event.data.arrayBuffer();
            this.handleBinaryMessage(buffer);
        }
    }

    private handleBinaryMessage(buffer: ArrayBuffer): void {
        const data = new Uint8Array(buffer);
        console.log(`Received binary message of length: ${data.length} bytes`);

        if (data.length < 8) {
            console.error('Received message is too short to be valid');
            return;
        }

        if (data[0] === 0xAA && data[1] === 0xAA && data[2] === 0xAA) {
            const receivedChannel = data[3];
            const sampleRate = new Uint32Array(data.buffer, 4, 1)[0];  // Changed from 8 to 4
            const audioData = data.slice(8);
            console.log(`Received audio chunk: Channel ${receivedChannel}, Sample Rate ${sampleRate}, Length ${audioData.length}`);
            this.playAudioData(audioData.buffer);
        } else {
            console.error('Received message with unknown header');
        }
    }
    private audioContext: AudioContext | null = null;

    private async playAudioData(audioData: ArrayBuffer): Promise<void> {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        }

        try {
            const audioContext = this.audioContext;
            const sampleRate = 44100;
            const numberOfChannels = 1;

            const audioBuffer = audioContext.createBuffer(numberOfChannels, audioData.byteLength / 2, sampleRate);
            const channelData = audioBuffer.getChannelData(1);
            const int16Array = new Int16Array(audioData);

            for (let i = 0; i < int16Array.length; i++) {
                channelData[i] = int16Array[i] / 32768.0;
            }

            const source = audioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContext.destination);
            source.start();

            source.onended = () => console.log('Audio playback ended');

        } catch (error) {
            console.error('Error playing raw PCM audio data:', error);
        }
    }




    private sendAudioChunk(audioChunk: ArrayBuffer): void {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            // Ensure the audioChunk length is a multiple of 4
            const paddedLength = Math.ceil(audioChunk.byteLength / 4) * 4;
            const paddedBuffer = new ArrayBuffer(paddedLength);
            new Uint8Array(paddedBuffer).set(new Uint8Array(audioChunk));

            const float32Data = new Float32Array(paddedBuffer);
            const int16Data = new Int16Array(float32Data.length);

            for (let i = 0; i < float32Data.length; i++) {
                const sample = Math.max(-1, Math.min(1, float32Data[i] * 1.2));
                int16Data[i] = Math.floor(sample * 32767);
            }

            const header = new Uint8Array([0xAA, 0xAA, 0xAA, 1]);
            const sampleRateBytes = new Uint8Array(new Uint32Array([this.sampleRate]).buffer);
            const message = new Uint8Array(header.length + sampleRateBytes.length + int16Data.buffer.byteLength);

            message.set(header);
            message.set(sampleRateBytes, header.length);
            message.set(new Uint8Array(int16Data.buffer), header.length + sampleRateBytes.length);

            this.socket.send(message.buffer);
        }
    }

    private sendFullAudio(fullAudio: ArrayBuffer): void {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            console.log(`Sending full audio of length: ${fullAudio.byteLength} bytes`);
            this.socket.send(fullAudio);
        }
    }

    private async handleTransmissionStop(): Promise<void> {
        await this.fullAudioService.handleTransmissionStop();
    }
}

export default new WebSocketService();