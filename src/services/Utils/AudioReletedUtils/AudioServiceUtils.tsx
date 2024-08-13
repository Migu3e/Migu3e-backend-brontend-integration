let audioContext: AudioContext | null = null;
let mediaRecorder: MediaRecorder | null = null;
let audioChunks: Blob[] = [];
let onDataAvailable: (data: ArrayBuffer, channel: number) => void;
let onStop: () => void;
const sampleRate = 44100;

export const initAudioService = (
    dataCallback: (data: ArrayBuffer, channel: number) => void,
    stopCallback: () => void
) => {
    onDataAvailable = dataCallback;
    onStop = stopCallback;
};

export const start = async (channel: number): Promise<void> => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContext = new (window.AudioContext);

        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                audioChunks.push(event.data);
            }
        };

        mediaRecorder.onstop = async () => {
            const fullAudioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            const arrayBuffer = await fullAudioBlob.arrayBuffer();
            onStop();
            onDataAvailable(arrayBuffer, channel);
        };

        const source = audioContext.createMediaStreamSource(stream);
        const processor = audioContext.createScriptProcessor(2048, 1, 1);

        source.connect(processor);
        processor.connect(audioContext.destination);

        processor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const audioData = new Float32Array(inputData);
            onDataAvailable(audioData.buffer, channel);
        };

        mediaRecorder.start(10); // Start recording and emit data every 10ms

    } catch (error) {
        console.error('Error starting audio capture:', error);
        throw error;
    }
};

export const stop = (): void => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
    }
    if (audioContext) {
        audioContext.close();
        audioContext = null;
    }
    onStop();
};

export const getFullAudioArrayBuffer = async (): Promise<ArrayBuffer> => {
    if (audioChunks.length === 0) {
        console.log('No audio chunks available');
        return new ArrayBuffer(0);
    }
    const fullAudioBlob = new Blob(audioChunks, { type: 'audio/webm' });
    return await fullAudioBlob.arrayBuffer();
};

export const clearAudioChunks = (): void => {
    audioChunks = [];
};

export const getSampleRate = (): number => sampleRate;