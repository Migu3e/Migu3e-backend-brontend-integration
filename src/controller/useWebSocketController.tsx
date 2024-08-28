import {useWebSocketContext} from "../services/Context/WebSocketContext.tsx";

export const useWebSocketController = () => {
    const {
        socket,
        clientId,
        isConnected,
        connect,
        disconnect,
        startTransmission,
        stopTransmission,
        sendChannelFrequency,
        sendVolumeLevel,
        sendOnOffState,
        getSettings
    } = useWebSocketContext();

    return {
        socket,
        clientId,
        isConnected,
        connect,
        disconnect,
        startTransmission,
        stopTransmission,
        sendChannelFrequency,
        sendVolumeLevel,
        sendOnOffState,
        getSettings
    };
};