const sampleRate: number = 44100;
let socket: WebSocket | null = null;

export function sendAudioChunk(audioChunk: ArrayBuffer): void {
    if (socket && socket.readyState === WebSocket.OPEN) {
        const byteLength = audioChunk.byteLength;

        // Ensure the buffer length is divisible by 4 for Float32Array processing
        if (byteLength % 4 !== 0) {
            console.error(`ArrayBuffer length (${byteLength}) is not a multiple of 4. Adjusting size...`);

            // Adjust the size by padding the buffer if necessary
            const adjustedLength = byteLength + (4 - (byteLength % 4));
            const tempBuffer = new Uint8Array(adjustedLength);
            tempBuffer.set(new Uint8Array(audioChunk)); // Copy original data
            audioChunk = tempBuffer.buffer;
        }

        // Convert the buffer to Float32Array and then to Int16Array
        const float32Data = new Float32Array(audioChunk);
        const int16Data = new Int16Array(float32Data.length);

        for (let i = 0; i < float32Data.length; i++) {
            const sample = Math.max(-1, Math.min(1, float32Data[i])); // Clamp values between -1 and 1
            int16Data[i] = Math.floor(sample * 32767); // Convert to Int16 range
        }

        // Create header for the message
        const header = new Uint8Array([0xAA, 0xAA, 0xAA, 0xAA]);
        const sampleRateBytes = new Uint8Array(new Uint32Array([sampleRate]).buffer);

        // Construct the final message by combining the header, sample rate, and audio data
        const message = new Uint8Array(header.length + sampleRateBytes.length + int16Data.buffer.byteLength);

        message.set(header); // Add header
        message.set(sampleRateBytes, header.length); // Add sample rate bytes
        message.set(new Uint8Array(int16Data.buffer), header.length + sampleRateBytes.length); // Add audio data

        socket.send(message.buffer); // Send the message
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