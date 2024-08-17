let audioContext: AudioContext | null = null;
let mediaRecorder: MediaRecorder | null = null;
let audioChunks: Blob[] = [];
let onDataAvailable: (data: ArrayBuffer, channel: number) => void;
let onStop: () => void;

export const startAudioService = (
    dataCallback: (data: ArrayBuffer, channel: number) => void,
    stopCallback: () => void
): void => {
    onDataAvailable = dataCallback;
    onStop = stopCallback;
};

export const start = async (channel: number): Promise<void> => {
    try {
        const stream: MediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContext = new (window.AudioContext);

        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = (event: BlobEvent) => {
            if (event.data.size > 0) {
                audioChunks.push(event.data);
            }
        };

        mediaRecorder.onstop = async () => {
            const fullAudioBlob: Blob = new Blob(audioChunks, { type: 'audio/webm' });
            const arrayBuffer: ArrayBuffer = await fullAudioBlob.arrayBuffer();
            onStop();
            onDataAvailable(arrayBuffer, channel);
        };

        const source: MediaStreamAudioSourceNode = audioContext.createMediaStreamSource(stream);
        const processor: ScriptProcessorNode = audioContext.createScriptProcessor(2048, 1, 1);

        source.connect(processor);
        processor.connect(audioContext.destination);

        processor.onaudioprocess = (e: AudioProcessingEvent) => {
            const inputData: Float32Array = e.inputBuffer.getChannelData(0);
            const audioData: Float32Array = new Float32Array(inputData);
            onDataAvailable(audioData.buffer, channel);
        };

        mediaRecorder.start(10); // recording the full audio data every 10ms

    } catch (error: unknown) {
        console.error('error starting audio capture:', error instanceof Error ? error.message : String(error));
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
        console.log('no audio chunks');
        return new ArrayBuffer(0);
    }
    const fullAudioBlob: Blob = new Blob(audioChunks, {type: 'audio/webm'});
    return await fullAudioBlob.arrayBuffer();
};

export const clearAudioChunks = (): void => {
    audioChunks = [];
};