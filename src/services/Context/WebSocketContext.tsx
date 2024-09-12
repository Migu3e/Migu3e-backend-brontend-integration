import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as AudioService from '../Utils/AudioReletedUtils/AudioServiceUtils';
import axios from 'axios';
import * as FullAudioService from '../Utils/AudioReletedUtils/FullAudioMakerUtils';
import { handleIncomingMessage, cleanupAudioContext } from '../Utils/AudioReletedUtils/AudioReceiverUtils';
import { sendAudioChunk, sendFullAudio, setSocket } from '../Utils/AudioReletedUtils/AudioSenderUtils';

interface WebSocketContextType {
    socket: WebSocket | null;
    clientId: string | null;
    isConnected: boolean;
    connect: (serverAddress: string, clientId: string) => Promise<void>;
    disconnect: () => void;
    startTransmission: () => Promise<void>;
    stopTransmission: () => void;
    sendChannelFrequency: (channel: number, frequency: number) => Promise<void>;
    sendVolumeLevel: (volume: number) => Promise<void>;
    sendOnOffState: (state: boolean) => Promise<void>;
    getSettings: () => Promise<ClientSettings | null>;
}
interface ClientSettings {
    channel: number;
    volume: number;
    frequency: number;
    minFrequency: number;
    maxFrequency: number;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [socket, setWebSocket] = useState<WebSocket | null>(null);
    const [clientId, setClientId] = useState<string | null>(null);
    const [serverAddress, setServerAddress] = useState<string>('');

    const connect = async (address: string, clientId: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            const newSocket = new WebSocket(`ws://${address}:8081`);
            newSocket.onopen = () => {
                console.log('WebSocket connected, sending client ID');
                newSocket.send(clientId);
                setWebSocket(newSocket);
                setSocket(newSocket);
                setServerAddress(address);
                setClientId(clientId);
            };
            newSocket.onmessage = (event) => {
                console.log('WebSocket message received:', event.data);
                if (typeof event.data === 'string') {
                    if (event.data === 'Connected') {
                        console.log('Connection confirmed by server');
                        resolve();
                    }

                    else {
                        handleIncomingMessage(event);
                    }
                } else {
                    handleIncomingMessage(event);
                }
            };
            newSocket.onerror = (error) => {
                console.error('WebSocket error:', error);
                reject(error);
            };
            newSocket.onclose = () => {
                console.log('Disconnected from server');
                setClientId(null);
                setWebSocket(null);
                setSocket(null);
            };
        });
    };

    const disconnect = (): void => {
        stopTransmission();
        cleanupAudioContext();
        if (socket) {
            socket.close();
            setWebSocket(null);
            setSocket(null);
        }
    };

    const startTransmission = async (): Promise<void> => {
        if (!socket) throw new Error('WebSocket is not connected');
        await AudioService.start();
    };

    const stopTransmission = (): void => {
        AudioService.stop();
        AudioService.clearAudioChunks();
    };

    const sendChannelFrequency = async (channel: number, frequency: number)=>
    {
        if (!clientId) throw new Error('Client ID not set');
        await axios.put(`http://${serverAddress}:5000/api/client/${clientId}/settings`,
            `channel=${channel}&frequency=${frequency.toFixed(4)}`
        );

    };

    const sendVolumeLevel = async (volume: number)=>
    {
        if (!clientId) throw new Error('Client ID not set');
        await axios.put(`http://${serverAddress}:5000/api/client/${clientId}/settings`,
            `volume=${volume}`
        );
    };

    const sendOnOffState = async (state: boolean)=>
    {
        if (!clientId) throw new Error('Client ID not set');
        await axios.put(`http://${serverAddress}:5000/api/client/${clientId}/settings`,
            `onoff=${state}`
        );
    };

    const getSettings = async () => {
        if (!clientId) return null;
        const response = await axios.get(`http://${serverAddress}:5000/api/client/${clientId}/settings`);
        return response.data as ClientSettings;
        //get the client channel,volume, freuqsny, minFreq, maxFreq.
    };

    useEffect(() => {
        AudioService.startAudioService(sendAudioChunk, FullAudioService.handleTransmissionStop);
        FullAudioService.startFullAudioService(sendFullAudio);
    }, []);

    return (
        <WebSocketContext.Provider
            value={{
                socket,
                clientId,
                isConnected: socket !== null && socket.readyState === WebSocket.OPEN,
                connect,
                disconnect,
                startTransmission,
                stopTransmission,
                sendChannelFrequency,
                sendVolumeLevel,
                sendOnOffState,
                getSettings,
            }}
        >
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocketContext = (): WebSocketContextType => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useWebSocket must be used within a WebSocketProvider');
    }
    return context;
};