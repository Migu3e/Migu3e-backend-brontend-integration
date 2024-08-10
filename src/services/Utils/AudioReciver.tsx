class AudioReceiver {
    private audioContext: AudioContext;
    private sourceNode: AudioBufferSourceNode | null = null;
    private audioBuffer: AudioBuffer;
    private playbackPosition: number = 0;
    private isPlaying: boolean = false;

    constructor(sampleRate: number = 44100, channels: number = 1) {
        this.audioContext = new (window.AudioContext);
        this.audioBuffer = this.audioContext.createBuffer(channels, sampleRate, sampleRate);
    }

    public receiveAudio(audioData: ArrayBuffer): void {
        const floatArray = new Float32Array(audioData);
        this.processAudioData(floatArray);
    }

    private processAudioData(audioData: Float32Array): void {
        this.addSamplesToBuffer(audioData);
        this.startPlayback();
    }

    private addSamplesToBuffer(newSamples: Float32Array): void {
        const currentBuffer = this.audioBuffer.getChannelData(0);
        const remainingSpace = currentBuffer.length - this.playbackPosition;

        if (newSamples.length <= remainingSpace) {
            currentBuffer.set(newSamples, this.playbackPosition);
            this.playbackPosition += newSamples.length;
        } else {
            const firstPart = newSamples.subarray(0, remainingSpace);
            const secondPart = newSamples.subarray(remainingSpace);
            currentBuffer.set(firstPart, this.playbackPosition);
            currentBuffer.set(secondPart, 0);
            this.playbackPosition = secondPart.length;
        }
    }

    private startPlayback(): void {
        this.isPlaying = true;
        this.schedulePlayback();
    }

    private schedulePlayback(): void {
        const bufferToPlay = this.audioContext.createBuffer(
            this.audioBuffer.numberOfChannels,
            this.audioBuffer.length,
            this.audioBuffer.sampleRate
        );
        bufferToPlay.copyToChannel(this.audioBuffer.getChannelData(0), 0, 0);

        this.sourceNode = this.audioContext.createBufferSource();
        this.sourceNode.buffer = bufferToPlay;
        this.sourceNode.connect(this.audioContext.destination);
        this.sourceNode.onended = () => {
            this.playbackPosition = 0;
            if (this.isPlaying) {
                this.schedulePlayback();
            }
        };
        this.sourceNode.start();
    }

    public stop(): void {
        this.isPlaying = false;
        if (this.sourceNode) {
            this.sourceNode.stop();
            this.sourceNode.disconnect();
        }
    }
}

export default AudioReceiver;