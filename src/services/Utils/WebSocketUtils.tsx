import { handleIncomingMessage, cleanupAudioContext } from '../../controller/useAudioReceiver';
import * as AudioService from './AudioReletedUtils/AudioServiceUtils.tsx';
import * as FullAudioService from './AudioReletedUtils/FullAudioMakerUtils.tsx';
import { sendAudioChunk, sendFullAudio, setSocket } from './AudioReletedUtils/AudioPorcessingUtils.tsx';

let socket: WebSocket | null = null;
let clientId: string | null = null;

async function handleTransmissionStop(): Promise<void> {
    await FullAudioService.handleTransmissionStop();
}

function initializeServices(): void {
    AudioService.initAudioService(sendAudioChunk, handleTransmissionStop);
    FullAudioService.initializeFullAudioService(sendFullAudio);
}

export async function connect(): Promise<void> {
    return new Promise((resolve, reject) => {
        socket = new WebSocket('ws://localhost:8081');
        socket.onopen = () => {
            console.log('Connected to server');
            setSocket(socket);
        };
        socket.onmessage = (event) => {
            if (typeof event.data === 'string') {
                // Assuming the first text message is the client ID
                clientId = event.data;
                console.log('Received client ID:', clientId);
                resolve();
            } else {
                handleIncomingMessage(event);
            }
        };
        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
            reject(error);
        };
        socket.onclose = () => {
            console.log('Disconnected from server');
            clientId = null;
            setSocket(null);
        };
    });
}
export function disconnect(): void {
    stopTransmission();
    cleanupAudioContext();
    if (socket) { socket.close(); socket = null; setSocket(null); }
}

export const isConnected = (): boolean => socket !== null && socket.readyState === WebSocket.OPEN;
export const getClientId = (): string | null => clientId;

export async function startTransmission(channel: number): Promise<void> {
    if (!isConnected()) throw new Error('WebSocket is not connected');
    await AudioService.start(channel);
}

export function stopTransmission(): void {
    AudioService.stop();
    AudioService.clearAudioChunks();
}

// Initialize services
initializeServices();

export { sendAudioChunk, sendFullAudio };