import * as AudioService from './AudioServiceUtils.tsx';

interface SendFullAudioCallback {
    (fullAudio: ArrayBuffer): void;
}

let sendFullAudio: SendFullAudioCallback;

export const initializeFullAudioService = (
    sendFullAudioCallback: SendFullAudioCallback
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

    const header: Uint8Array = new Uint8Array([0xFF, 0xFF, 0xFF, 0xFF]);
    const lengthBytes: Uint8Array = new Uint8Array(new Uint32Array([fullAudioBuffer.byteLength]).buffer);
    const message: Uint8Array = new Uint8Array(header.length + lengthBytes.length + fullAudioBuffer.byteLength);
    message.set(header);
    message.set(lengthBytes, header.length);
    message.set(new Uint8Array(fullAudioBuffer), header.length + lengthBytes.length);

    sendFullAudio(message.buffer);

    AudioService.clearAudioChunks();
};