import { handleIncomingMessage, cleanupAudioContext } from '../services/Utils/AudioReletedUtils/useAudioReceiver.tsx';
import * as AudioService from '../services/Utils/AudioReletedUtils/AudioServiceUtils.tsx';
import * as FullAudioService from '../services/Utils/AudioReletedUtils/FullAudioMakerUtils.tsx';
import { sendAudioChunk, sendFullAudio, setSocket } from '../services/Utils/AudioReletedUtils/AudioSender.tsx';

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
                //the first and only text message is the client ID
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

initializeServices();

export { sendAudioChunk, sendFullAudio };