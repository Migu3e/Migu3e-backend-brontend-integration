export interface AudioConfig {
    sampleRate: number;
    channels: number;
}

export interface AudioChunk {
    data: ArrayBuffer;
    channel: number;
}

export interface FullAudio {
    data: ArrayBuffer;
}