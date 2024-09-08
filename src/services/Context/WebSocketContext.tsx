import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as AudioService from '../Utils/AudioReletedUtils/AudioServiceUtils';
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

    const sendChannelFrequency = async (channel: number, frequency: number): Promise<void> => {
        if (!clientId) throw new Error('Client ID not set');
        const response = await fetch(`http://${serverAddress}:5000/api/client/${clientId}/settings`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `channel=${channel}&frequency=${frequency.toFixed(4)}`,
        });
        if (!response.ok) throw new Error('Failed to update channel and frequency');
    };


    const sendVolumeLevel = async (volume: number): Promise<void> => {
        if (!clientId) throw new Error('Client ID not set');
        try {
            const response = await fetch(`http://${serverAddress}:5000/api/client/${clientId}/settings`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `volume=${volume}`,
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to update volume: ${response.status} ${errorText}`);
            }
        } catch (error) {
            console.error('Error updating volume:', error);
            throw error;
        }
    };

    const sendOnOffState = async (state: boolean): Promise<void> => {
        if (!clientId) throw new Error('Client ID not set');
        try {
            const response = await fetch(`http://${serverAddress}:5000/api/client/${clientId}/settings`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `onoff=${state}`,
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to update on/off state: ${response.status} ${errorText}`);
            }
        } catch (error) {
            console.error('Error updating on/off state:', error);
            throw error;
        }
    };

    const getSettings = async (): Promise<ClientSettings | null> => {
        if (!clientId) return null;

        try {
            const response = await fetch(`http://${serverAddress}:5000/api/client/${clientId}/settings`);
            if (!response.ok) {
                console.error('Failed to fetch settings:', response.status, response.statusText);
                return null;
            }

            const responseBody = await response.json();
            return responseBody as ClientSettings;
        } catch (error) {
            console.error('Error fetching settings:', error);
            return null;
        }
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