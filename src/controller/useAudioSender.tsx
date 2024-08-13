import { useState, useEffect } from 'react';
import { isConnected, startTransmission as startWsTransmission, stopTransmission as stopWsTransmission } from '../services/Utils/WebSocketUtils';

export const useAudioSender = () => {
    const [isTransmitting, setIsTransmitting] = useState(false);
    const [channel, setChannel] = useState(1);

    const startTransmission = async () => {
        if (!isConnected()) {
            throw new Error('WebSocket is not connected');
        }
        setIsTransmitting(true);
        await startWsTransmission(channel);
    };

    const stopTransmission = () => {
        setIsTransmitting(false);
        stopWsTransmission();
    };

    useEffect(() => {
        return () => {
            if (isTransmitting) {
                stopWsTransmission();
            }
        };
    }, [isTransmitting]);

    return {
        isTransmitting,
        startTransmission,
        stopTransmission,
        channel,
        setChannel,
    };
};