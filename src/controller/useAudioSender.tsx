import { useState, useEffect } from 'react';
import WebSocketService from '../services/Utils/WebSocketUtils';

export const useAudioSender = () => {
    const [isTransmitting, setIsTransmitting] = useState(false);
    const [channel, setChannel] = useState(1);

    const startTransmission = async () => {
        if (!WebSocketService.isConnected()) {
            throw new Error('WebSocket is not connected');
        }
        setIsTransmitting(true);
        await WebSocketService.startTransmission();
    };

    const stopTransmission = () => {
        setIsTransmitting(false);
        WebSocketService.stopTransmission();
    };

    useEffect(() => {
        return () => {
            if (isTransmitting) {
                WebSocketService.stopTransmission();
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