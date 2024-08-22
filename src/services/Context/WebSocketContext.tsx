import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as AudioService from '../Utils/AudioReletedUtils/AudioServiceUtils.tsx';
import * as FullAudioService from '../Utils/AudioReletedUtils/FullAudioMakerUtils.tsx';
import { handleIncomingMessage, cleanupAudioContext } from '../Utils/AudioReletedUtils/AudioReceiverUtils.tsx';
import { sendAudioChunk, sendFullAudio, setSocket } from '../Utils/AudioReletedUtils/AudioSenderUtils.tsx';

interface WebSocketContextType {
    socket: WebSocket | null;
    clientId: string | null;
    isConnected: boolean;
    connect: (serverAddress: string) => Promise<void>;
    disconnect: () => void;
    startTransmission: (channel: number) => Promise<void>;
    stopTransmission: () => void;
    sendChannelFrequency: (channel: number) => void;
    sendVolumeLevel: (volume: number) => void;
    sendOnOffState: (state: string) => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketControllerContext: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [socket, setWebSocket] = useState<WebSocket | null>(null);
    const [clientId, setClientId] = useState<string | null>(null);

    useEffect(() => {
        return () => {
            if (socket) {
                socket.close();
            }
        };
    }, []);

    const connect = async (serverAddress: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            const newSocket = new WebSocket(`ws://${serverAddress}:8081`);
            newSocket.onopen = () => {
                console.log('Connected to server');
                setWebSocket(newSocket);
                setSocket(newSocket);
            };
            newSocket.onmessage = (event) => {
                if (typeof event.data === 'string') {
                    setClientId(event.data);
                    console.log('Received client ID:', event.data);
                    resolve();
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
    const sendChannelFrequency = (channel: number): void => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            const message : string = `FRE|${channel.toFixed(4)}`; // Combine ID string with formatted frequency
            console.log(`Sending channel frequency: ${message}`);
            socket.send(message);
        } else {
            console.warn('Failed to send channel frequency: Socket not connected or ready');
        }
    };
    const sendVolumeLevel = (volume: number): void => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            const message : string = `VUL|${volume}`;
            console.log(`Sending volume level: ${message}`);
            socket.send(message);
        } else {
            console.warn('Failed to send volume level: Socket not connected or ready');
        }
    };
    const sendOnOffState = (state: string): void => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            const message: string = `ONF|${state}`;
            console.log(`Sending on/off state: ${message}`);
            socket.send(message);
        } else {
            console.warn('Failed to send on/off state: Socket not connected or ready');
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
            }}
        >
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocketContext = (): WebSocketContextType => {
    const context = useContext(WebSocketContext);
    if (!context)
    {
        throw new Error('useWebSocket must be used within a WebSocketProvider');
    }
    return context;

};