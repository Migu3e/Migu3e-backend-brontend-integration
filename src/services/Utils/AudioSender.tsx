class AudioSender {
    private audioContext: AudioContext | null = null;
    private mediaRecorder: MediaRecorder | null = null;
    private audioChunks: Blob[] = [];
    private onDataAvailable: (data: ArrayBuffer) => void;
    private onStop: () => void;

    constructor(onDataAvailable: (data: ArrayBuffer) => void, onStop: () => void) {
        this.onDataAvailable = onDataAvailable;
        this.onStop = onStop;
    }

    public async start(): Promise<void> {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.audioContext = new (window.AudioContext);

            this.mediaRecorder = new MediaRecorder(stream);

            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.audioChunks.push(event.data);
                }
            };

            this.mediaRecorder.onstop = async () => {
                const fullAudioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
                const arrayBuffer = await fullAudioBlob.arrayBuffer();
                this.onStop();
                this.onDataAvailable(arrayBuffer);
            };

            const source = this.audioContext.createMediaStreamSource(stream);
            const processor = this.audioContext.createScriptProcessor(2048, 1, 1);

            source.connect(processor);
            processor.connect(this.audioContext.destination);

            processor.onaudioprocess = (e) => {
                const inputData = e.inputBuffer.getChannelData(0);
                const audioData = new Float32Array(inputData);
                this.onDataAvailable(audioData.buffer);
            };

            this.mediaRecorder.start(10); // Start recording and emit data every 100ms

        } catch (error) {
            console.error('Error starting audio capture:', error);
            throw error;
        }
    }

    public stop(): void {
        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            this.mediaRecorder.stop();
        }
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
    }

    public async getFullAudioArrayBuffer(): Promise<ArrayBuffer> {
        if (this.audioChunks.length === 0) {
            console.log('No audio chunks available');
            return new ArrayBuffer(0);
        }
        const fullAudioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        return await fullAudioBlob.arrayBuffer();
    }

    public clearAudioChunks(): void {
        this.audioChunks = [];
    }
}

export default AudioSender;