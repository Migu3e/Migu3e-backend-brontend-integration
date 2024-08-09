import WebSocketService from "./WebSocketUtils.tsx";

class AudioReceiver {
    private audioContext: AudioContext;
    private sourceNode: AudioBufferSourceNode | null = null;
    private bufferSize: number = 4096;
    private sampleRate: number = 44100;
    private channels: number = 1;
    private isPlaying: boolean = false;
    private audioBuffer: AudioBuffer;
    private playbackPosition: number = 0;

    constructor() {
        this.audioContext = new (window.AudioContext);
        this.audioBuffer = this.audioContext.createBuffer(this.channels, this.bufferSize, this.sampleRate);
    }

    public playAudio(buffer: ArrayBuffer, offset: number, count: number) {
        const data = new Float32Array(buffer, offset, count / Float32Array.BYTES_PER_ELEMENT);

        const audioBuffer = this.audioContext.createBuffer(this.channels, data.length, this.sampleRate);

        audioBuffer.copyToChannel(data, 0);

        if (!this.isPlaying) {
            this.startPlayback();
        }

        this.addSamplesToBuffer(data);
    }


    private startPlayback() {
        this.isPlaying = true;
        this.schedulePlayback();
    }

    private schedulePlayback() {
        const bufferToPlay = this.audioContext.createBuffer(this.channels, this.bufferSize, this.sampleRate);
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

    private addSamplesToBuffer(newSamples: Float32Array) {
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

    public stop() {
        this.isPlaying = false;
        if (this.sourceNode) {
            this.sourceNode.stop();
            this.sourceNode.disconnect();
        }
    }

    public async receiveAudioFromServer(webSocket: WebSocket) {
        while (true) {
            try {
                console.log("Client ID: " + WebSocketService.getClientId());

                await new Promise<void>((resolve, reject) => {
                    webSocket.onmessage = (event) => {
                        if (event.data instanceof ArrayBuffer) {
                            this.playAudio(event.data, 0, event.data.byteLength);
                            resolve();
                        } else if (typeof event.data === 'string') {
                            console.warn('Received text message: ', event.data);
                            resolve();  // Handle the text message if needed
                        } else {
                            reject(new Error('Received non-audio data'));
                        }
                    };
                    webSocket.onerror = (error) => reject(error);
                });
            } catch (ex) {
                console.error(`Error: ${ex instanceof Error ? ex.message : String(ex)}`);
                break;
            }
        }
    }

}

export default AudioReceiver;