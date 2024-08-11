import TransmissionManager from "./TransmissionManager.tsx";

class WebSocketService {
    private socket: WebSocket | null = null;
    private clientId: string | null = null;
    private transmissionManager: TransmissionManager;
    private audioContext: AudioContext | null = null;
    private sampleRate: number = 44100; // defaltas sample rate

    constructor() {
        this.transmissionManager = new TransmissionManager(
            this.sendAudioChunk.bind(this),
            this.sendFullAudio.bind(this)
        );
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

    public setChannel(channel: number): void {
        this.transmissionManager.setChannel(channel);
    }

    public async startTransmission(): Promise<void> {
        if (!this.isConnected()) {
            throw new Error('WebSocket is not connected');
        }
        await this.transmissionManager.startTransmission();
    }

    public stopTransmission(): void {
        this.transmissionManager.stopTransmission();
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
            const audioLength = new Uint32Array(data.buffer, 4, 1)[0];
            console.log(`Received audio chunk: Channel ${receivedChannel}, Length ${audioLength}`);

            if (data.length < 8 + audioLength) {
                console.error(`Message length (${data.length}) is less than expected (${8 + audioLength})`);
                return;
            }

            if (receivedChannel === this.transmissionManager.getChannel()) {
                const audioData = data.slice(8, 8 + audioLength);
                console.log(`Playing audio chunk of length ${audioData.length}`);
                this.playAudioData(audioData.buffer);
            }
        } else {
            console.error('Received message with unknown header');
        }
    }

    private async playAudioData(audioData: ArrayBuffer): Promise<void> {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        }

        const int16Data = new Int16Array(audioData);

        const floatData = new Float32Array(int16Data.length);
        for (let i = 0; i < int16Data.length; i++) {
            floatData[i] = int16Data[i] / 32768.0;
        }

        const buffer = this.audioContext.createBuffer(1, floatData.length, this.sampleRate);
        buffer.getChannelData(0).set(floatData);

        const source = this.audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(this.audioContext.destination);
        source.start();
    }

    private sendAudioChunk(audioChunk: ArrayBuffer): void {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(audioChunk);
        }
    }

    private sendFullAudio(fullAudio: ArrayBuffer): void {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            console.log(`Sending full audio of length: ${fullAudio.byteLength} bytes`);
            this.socket.send(fullAudio);
        }
    }
}

export default new WebSocketService();
