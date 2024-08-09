import AudioReceiver from '../Utils/AudioReciver.tsx';

class WebSocketService {
    private socket: WebSocket | null = null;
    private clientId: string | null = null;
    private channel: number = 1;
    private isTransmitting: boolean = false;
    private mediaRecorder: MediaRecorder | null = null;
    private audioChunks: Blob[] = [];
    private audioReceiver: AudioReceiver;

    constructor() {
        this.audioReceiver = new AudioReceiver();
    }

    connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.socket = new WebSocket('ws://localhost:8081');

            this.socket.onopen = () => {
                console.log('Connected to server');
                resolve();
            };

            this.socket.onmessage = (event) => {
                if (typeof event.data === 'string') {
                    this.clientId = event.data;
                    console.log('Received client ID:', this.clientId);
                } else if (event.data instanceof ArrayBuffer) {
                    this.handleIncomingAudio(event.data);
                }
            };

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

    disconnect(): void {
        this.stopTransmission();
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    }

    isConnected(): boolean {
        return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
    }

    getClientId(): string | null {
        return this.clientId;
    }

    getSocket(): WebSocket{
        return this.socket as WebSocket;
    }

    setChannel(channel: number): void {
        this.channel = channel;
    }

    getChannel(): number {
        return this.channel;
    }

    async startTransmission(): Promise<void> {
        if (!this.isTransmitting) {
            this.isTransmitting = true;
            this.audioChunks = [];
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                this.mediaRecorder = new MediaRecorder(stream);

                this.mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        this.audioChunks.push(event.data);
                        this.sendAudioChunk(event.data);
                    }
                };

                this.mediaRecorder.onstop = () => {
                    this.sendFullAudioTransmission();
                };

                this.mediaRecorder.start(100); // Capture in 100ms chunks
            } catch (error) {
                console.error('microphone:', error);
                this.isTransmitting = false;
            }
        }
    }

    stopTransmission(): void {
        if (this.isTransmitting) {
            this.isTransmitting = false;
            if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
                this.mediaRecorder.stop();
            }
        }
    }

    private sendAudioChunk(chunk: Blob): void {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result instanceof ArrayBuffer) {
                    console.log(chunk);
                    const header = new Uint8Array([0xAA, 0xAA, 0xAA, this.channel]);
                    const message = new Uint8Array(header.length + reader.result.byteLength);
                    message.set(header);
                    message.set(new Uint8Array(reader.result), header.length);
                    this.socket!.send(message);
                    this.audioReceiver.playAudio(reader.result, 0, reader.result.byteLength);
                }
            };
            reader.readAsArrayBuffer(chunk);
        }
    }


    private handleIncomingAudio(data: ArrayBuffer) {
        const audioData = new Uint8Array(data);

        if (audioData[0] === 0xAA && audioData[1] === 0xAA && audioData[2] === 0xAA) {
            const channelReceived = audioData[3];
            if (channelReceived === this.channel) {
                this.audioReceiver.playAudio(data.slice(4), 0, data.byteLength - 4);
            }
        }
    }

    private sendFullAudioTransmission(): void {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            const fullAudio = new Blob(this.audioChunks, { type: 'audio/webm' });
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result instanceof ArrayBuffer) {
                    const header = new Uint8Array([0xFF, 0xFF, 0xFF, 0xFF]);
                    const message = new Uint8Array(header.length + reader.result.byteLength);
                    message.set(header);
                    message.set(new Uint8Array(reader.result), header.length);
                    this.socket!.send(message);
                }
            };
            reader.readAsArrayBuffer(fullAudio);
        }
    }
}

export default new WebSocketService();
