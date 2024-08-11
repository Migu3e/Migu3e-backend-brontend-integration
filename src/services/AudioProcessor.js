class AudioProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this.buffer = new Float32Array(4096);
        this.bufferIndex = 0;
        this.port.onmessage = (event) => {
            if (event.data === 'stop') {
                this.buffer.fill(0);
                this.bufferIndex = 0;
            } else {
                this.appendToBuffer(event.data);
            }
        };
    }

    appendToBuffer(newData) {
        const spaceLeft = this.buffer.length - this.bufferIndex;
        if (newData.length <= spaceLeft) {
            this.buffer.set(newData, this.bufferIndex);
            this.bufferIndex += newData.length;
        } else {
            const firstPart = newData.subarray(0, spaceLeft);
            const secondPart = newData.subarray(spaceLeft);
            this.buffer.set(firstPart, this.bufferIndex);
            this.buffer.set(secondPart, 0);
            this.bufferIndex = secondPart.length;
        }
    }

    process(inputs, outputs) {
        const output = outputs[0];
        const channelData = output[0];

        for (let i = 0; i < channelData.length; i++) {
            if (this.bufferIndex > 0) {
                channelData[i] = this.buffer[0];
                this.buffer.copyWithin(0, 1);
                this.bufferIndex--;
            } else {
                channelData[i] = 0;
            }
        }

        return true;
    }
}

registerProcessor('audio-processor', AudioProcessor);