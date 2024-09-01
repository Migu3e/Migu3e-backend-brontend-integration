let audioContext: AudioContext | null = null;

export function handleIncomingMessage(event: MessageEvent<ArrayBuffer | Blob>): Promise<void> {
    if (event.data instanceof ArrayBuffer) {
        return Promise.resolve(handleBinaryMessage(event.data));
    } else if (event.data instanceof Blob) {
        return event.data.arrayBuffer().then(handleBinaryMessage);
    }
    return Promise.resolve();
}

function handleBinaryMessage(buffer: ArrayBuffer): void {
    const data = new Uint8Array(buffer);
    console.log(`Received binary message of length: ${data.length} bytes`);

    if (data.length < 8) {
        console.error('Message too short to process');
        return;
    }

    if (data[0] === 0xAA && data[1] === 0xAA && data[2] === 0xAA && data[3] === 0xAA) {
        const sampleRate: number = new Uint32Array(data.buffer, 4, 1)[0];
        const audioData: Uint8Array = data.slice(8);
        console.log(`Received audio chunk: sample rate ${sampleRate}, length ${audioData.length}`);
        playAudioData(audioData.buffer, sampleRate);
    } else {
        console.error('Message with unknown header');
    }
}

async function playAudioData(audioData: ArrayBuffer, sampleRate: number): Promise<void> {
    if (!audioContext) {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    try {
        const numberOfChannels: number = 1;
        const audioBuffer: AudioBuffer = audioContext.createBuffer(numberOfChannels, audioData.byteLength / 2, sampleRate);
        const channelData: Float32Array = audioBuffer.getChannelData(0);
        const int16Array: Int16Array = new Int16Array(audioData);

        for (let i: number = 0; i < int16Array.length; i++) {
            channelData[i] = int16Array[i] / 32768.0;
        }

        const source: AudioBufferSourceNode = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.start();

        console.log('Started playing audio chunk');

        source.onended = () => console.log('Finished playing audio chunk');

    } catch (error: unknown) {
        console.error('Error playing audio:', error instanceof Error ? error.message : String(error));
    }
}

export function cleanupAudioContext(): void {
    if (audioContext) {
        audioContext.close();
        audioContext = null;
    }
}