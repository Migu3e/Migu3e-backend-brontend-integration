import AudioService from './AudioService';

class FullAudioService {
    private audioService: AudioService;
    private sendFullAudio: (fullAudio: ArrayBuffer) => void;

    constructor(
        audioService: AudioService,
        sendFullAudio: (fullAudio: ArrayBuffer) => void
    ) {
        this.audioService = audioService;
        this.sendFullAudio = sendFullAudio;
    }

    public async handleTransmissionStop(): Promise<void> {
        console.log('Audio transmission stopped');

        const fullAudioBuffer = await this.audioService.getFullAudioArrayBuffer();
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

        this.audioService.clearAudioChunks();
    }
}

export default FullAudioService;