import { useWebSocket } from './WebSocketContext';

export const useWebSocketController = () => {
    const {
        connect,
        disconnect,
        isConnected,
        clientId,
        startTransmission,
        stopTransmission,
        sendChannelFrequency
    } = useWebSocket();

    return {
        connect,
        disconnect,
        isConnected,
        getClientId: () => clientId,
        startTransmission,
        stopTransmission,
        sendChannelFrequency
    };
};