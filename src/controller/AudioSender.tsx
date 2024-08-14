const sampleRate: number = 44100;
let socket: WebSocket | null = null;

export function sendAudioChunk(audioChunk: ArrayBuffer, channel: number): void {
    if (socket && socket.readyState === WebSocket.OPEN) {
        const paddedLength = Math.ceil(audioChunk.byteLength / 4) * 4;
        const paddedBuffer = new ArrayBuffer(paddedLength);
        new Uint8Array(paddedBuffer).set(new Uint8Array(audioChunk));
        const float32Data = new Float32Array(paddedBuffer);
        const int16Data = new Int16Array(float32Data.length);
        for (let i = 0; i < float32Data.length; i++) {
            const sample = Math.max(-1, Math.min(1, float32Data[i] * 1.2));
            int16Data[i] = Math.floor(sample * 32767);
        }
        const header = new Uint8Array([0xAA, 0xAA, 0xAA, channel]);
        const sampleRateBytes = new Uint8Array(new Uint32Array([sampleRate]).buffer);
        const message = new Uint8Array(header.length + sampleRateBytes.length + int16Data.buffer.byteLength);
        message.set(header);
        message.set(sampleRateBytes, header.length);
        message.set(new Uint8Array(int16Data.buffer), header.length + sampleRateBytes.length);
        socket.send(message.buffer);
    }
}

export function sendFullAudio(fullAudio: ArrayBuffer): void {
    if (socket && socket.readyState === WebSocket.OPEN) {
        console.log(`Sending full audio of length: ${fullAudio.byteLength} bytes`);
        socket.send(fullAudio);
    }
}

export function setSocket(newSocket: WebSocket | null): void {
    socket = newSocket;
}