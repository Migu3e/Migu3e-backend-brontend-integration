import AudioSender from "./AudioSender";

class TransmissionManager {
    private audioSender: AudioSender;
    private isTransmitting: boolean = false;
    private channel: number = 1;
    private sendAudioChunk: (audioChunk: ArrayBuffer) => void;
    private sendFullAudio: (fullAudio: ArrayBuffer) => void;
    private sampleRate: number = 44100;

    constructor(
        sendAudioChunk: (audioChunk: ArrayBuffer) => void,
        sendFullAudio: (fullAudio: ArrayBuffer) => void
    ) {
        this.sendAudioChunk = sendAudioChunk;
        this.sendFullAudio = sendFullAudio;
        this.audioSender = new AudioSender(
            this.handleAudioChunk.bind(this),
            this.handleTransmissionStop.bind(this)
        );
    }


    public async startTransmission(): Promise<void> {
        if (!this.isTransmitting) {
            this.isTransmitting = true;
            await this.audioSender.start();
        }
    }

    public stopTransmission(): void {
        if (this.isTransmitting) {
            this.isTransmitting = false;
            this.audioSender.stop();
        }
    }

    public setChannel(channel: number): void {
        this.channel = channel;
    }

    public getChannel(): number {
        return this.channel;
    }

    private handleAudioChunk(audioData: ArrayBuffer): void {
        if (this.isTransmitting) {
            const float32Data = new Float32Array(audioData);
            const int16Data = new Int16Array(float32Data.length);

            for (let i = 0; i < float32Data.length; i++) {
                const sample = Math.max(-1, Math.min(1, float32Data[i] * 1.2));
                int16Data[i] = Math.floor(sample * 32767);
            }

            const header = new Uint8Array([0xAA, 0xAA, 0xAA, this.channel]);
            const sampleRateBytes = new Uint8Array(new Uint32Array([this.sampleRate]).buffer);
            const message = new Uint8Array(header.length + sampleRateBytes.length + int16Data.buffer.byteLength);

            message.set(header);
            message.set(sampleRateBytes, header.length);
            message.set(new Uint8Array(int16Data.buffer), header.length + sampleRateBytes.length);

            this.sendAudioChunk(message.buffer);
        }
    }

    private async handleTransmissionStop(): Promise<void> {
        console.log('Audio transmission stopped');

        const fullAudioBuffer = await this.audioSender.getFullAudioArrayBuffer();
        if (fullAudioBuffer.byteLength === 0) {
            console.log('No full audio data to send');
            return;
        }

        const header = new Uint8Array([0xFF, 0xFF, 0xFF, 0xFF]);
        const lengthBytes = new Uint8Array(new Uint32Array([fullAudioBuffer.byteLength]).buffer);
        const message = new Uint8Array(header.length + lengthBytes.length + fullAudioBuffer.byteLength);
        message.set(header);
        message.set(lengthBytes, header.length);
        message.set(new Uint8Array(fullAudioBuffer), header.length + lengthBytes.length);

        this.sendFullAudio(message.buffer);

        this.audioSender.clearAudioChunks();
    }
}

export default TransmissionManager;