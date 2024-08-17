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
    console.log(`binary message of length: ${data.length} bytes`);

    if (data.length < 8) {
        console.error('too short to work');
        return;
    }

    if (data[0] === 0xAA && data[1] === 0xAA && data[2] === 0xAA) {
        const receivedChannel: number = data[3];
        const sampleRate: number = new Uint32Array(data.buffer, 4, 1)[0];
        const audioData: Uint8Array = data.slice(8);
        console.log(`received audio chunk: channel ${receivedChannel}, sample Rate ${sampleRate}, length ${audioData.length}`);
        playAudioData(audioData.buffer);
    }
    else {
        console.error('message with unknown header');
    }
}

async function playAudioData(audioData: ArrayBuffer): Promise<void> {
    if (!audioContext) {
        audioContext = new (window.AudioContext);
    }

    try {
        const sampleRate: number = 44100;
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

        source.onended = () => console.log('audio playback ended');

    } catch (error: unknown) {
        console.error('error:', error instanceof Error ? error.message : String(error));
    }
}

export function cleanupAudioContext(): void {
    if (audioContext) {
        audioContext.close();
        audioContext = null;
    }
}