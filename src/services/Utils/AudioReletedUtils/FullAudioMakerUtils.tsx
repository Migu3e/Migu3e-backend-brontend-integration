import * as AudioService from './AudioServiceUtils.tsx';

interface SendFullAudioInterface {
    (fullAudio: ArrayBuffer): void;
}

let sendFullAudio: SendFullAudioInterface;

export const startFullAudioService = (
    sendFullAudioCallback: SendFullAudioInterface
): void => {
    sendFullAudio = sendFullAudioCallback;
};

export const handleTransmissionStop = async (): Promise<void> => {
    console.log('Audio transmission stopped');

    const fullAudioBuffer: ArrayBuffer = await AudioService.getFullAudioArrayBuffer();
    if (fullAudioBuffer.byteLength === 0) {
        console.log('No full audio data to send');
        return;
    }

    console.log(`Full audio buffer size: ${fullAudioBuffer.byteLength} bytes`);

    if (fullAudioBuffer.byteLength > 100 * 1024 * 1024) { // 100 MB limit
        console.error('Audio file too large, not sending');
        return;
    }

    const header: Uint8Array = new Uint8Array([0xFF, 0xFF, 0xFF, 0xFF]);
    const lengthBytes: Uint8Array = new Uint8Array(new Uint32Array([fullAudioBuffer.byteLength]).buffer);
    const message: Uint8Array = new Uint8Array(header.length + lengthBytes.length + fullAudioBuffer.byteLength);
    message.set(header);
    message.set(lengthBytes, header.length);
    message.set(new Uint8Array(fullAudioBuffer), header.length + lengthBytes.length);

    console.log(`Sending full audio message of size: ${message.length} bytes`);
    sendFullAudio(message.buffer);

    AudioService.clearAudioChunks();
};