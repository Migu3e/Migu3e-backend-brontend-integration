import { useWebSocketContext } from '../services/Context/WebSocketContext.tsx';

export const useWebSocketController = () => {
    const {
        connect,
        disconnect,
        isConnected,
        clientId,
        startTransmission,
        stopTransmission,
        sendChannelFrequency,
        sendVolumeLevel,
        sendOnOffState
    } = useWebSocketContext();

    return {
        connect,
        disconnect,
        isConnected,
        getClientId: () => clientId,
        startTransmission,
        stopTransmission,
        sendChannelFrequency,
        sendVolumeLevel,
        sendOnOffState
    };
};