let audioContext: AudioContext | null = null;

export function handleIncomingMessage(event: MessageEvent): Promise<void> {
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
        console.error('Received message is too short to be valid');
        return;
    }

    if (data[0] === 0xAA && data[1] === 0xAA && data[2] === 0xAA) {
        const receivedChannel = data[3];
        const sampleRate = new Uint32Array(data.buffer, 4, 1)[0];
        const audioData = data.slice(8);
        console.log(`Received audio chunk: Channel ${receivedChannel}, Sample Rate ${sampleRate}, Length ${audioData.length}`);
        playAudioData(audioData.buffer);
    } else {
        console.error('Received message with unknown header');
    }
}

async function playAudioData(audioData: ArrayBuffer): Promise<void> {
    if (!audioContext) {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    try {
        const sampleRate = 44100;
        const numberOfChannels = 1;

        const audioBuffer = audioContext.createBuffer(numberOfChannels, audioData.byteLength / 2, sampleRate);
        const channelData = audioBuffer.getChannelData(0);
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

export function cleanupAudioContext(): void {
    if (audioContext) {
        audioContext.close();
        audioContext = null;
    }
}