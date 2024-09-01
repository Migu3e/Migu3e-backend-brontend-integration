const sampleRate: number = 44100;
let socket: WebSocket | null = null;

export function sendAudioChunk(audioChunk: ArrayBuffer): void {
    if (socket && socket.readyState === WebSocket.OPEN) {
        const float32Data: Float32Array = new Float32Array(audioChunk);
        const int16Data: Int16Array = new Int16Array(float32Data.length);

        for (let i: number = 0; i < float32Data.length; i++) {
            const sample: number = Math.max(-1, Math.min(1, float32Data[i]));
            int16Data[i] = Math.floor(sample * 32767);
        }

        const header: Uint8Array = new Uint8Array([0xAA, 0xAA, 0xAA, 0xAA]);
        const sampleRateBytes: Uint8Array = new Uint8Array(new Uint32Array([sampleRate]).buffer);
        const message: Uint8Array = new Uint8Array(header.length + sampleRateBytes.length + int16Data.buffer.byteLength);

        message.set(header);
        message.set(sampleRateBytes, header.length);
        message.set(new Uint8Array(int16Data.buffer), header.length + sampleRateBytes.length);

        socket.send(message.buffer);
    }
}
export function sendFullAudio(fullAudio: ArrayBuffer): void {
    if (socket && socket.readyState === WebSocket.OPEN) {
        console.log(`sending full audio of length: ${fullAudio.byteLength} bytes`);
        socket.send(fullAudio);
    }
}

export function setSocket(newSocket: WebSocket | null): void {
    socket = newSocket;
}