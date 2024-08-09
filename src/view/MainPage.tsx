import React, { useEffect, useState } from 'react';
import WebSocketService from '../services/Utils/WebSocketUtils';
import {useNavigate} from "react-router-dom";
import AudioReciver from "../services/Utils/AudioReciver.tsx";

const MainPage: React.FC = () => {
    const [clientId, setClientId] = useState<string | null>(null);
    const [channel, setChannel] = useState<number>(1);
    const [isTransmitting, setIsTransmitting] = useState<boolean>(false);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        const connectToServer = async () => {
            try {
                await WebSocketService.connect();
                setIsConnected(true);
                await new Promise(resolve => setTimeout(resolve, 1000));
                setClientId(WebSocketService.getClientId());
                console.log("sdsdsdds" + WebSocketService.getClientId())
                const audioReciver = new AudioReciver();
                const socket = WebSocketService.getSocket();
                if (WebSocketService.getSocket!== null)
                {
                    audioReciver.receiveAudioFromServer(socket);
                }
            } catch (error) {
                console.error('Connection error:', error);
                setIsConnected(false);
            }
        };

        connectToServer();

        return () => {
            WebSocketService.disconnect();
        };
    }, [navigate]);

    const handleConnect = async () => {
        try {
            await WebSocketService.connect();
            setIsConnected(true);
            setClientId(WebSocketService.getClientId());
        } catch (error) {
            console.error('Connection error:', error);
        }
    };

    const handleDisconnect = () => {
        WebSocketService.disconnect();
        setIsConnected(false);
        setClientId(null);
        setIsTransmitting(false);
        navigate('/')
    };

    const handleTransmit = async () => {
        if (isTransmitting) {
            WebSocketService.stopTransmission();
            setIsTransmitting(false);
        } else {
            await WebSocketService.startTransmission();
            setIsTransmitting(true);
        }
    };

    const handleChannelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newChannel = parseInt(event.target.value);
        setChannel(newChannel);
        WebSocketService.setChannel(newChannel);
    };

    return (
        <div>
            <h1>Radio Device</h1>
            {isConnected ? (
                <>
                    <button onClick={handleDisconnect}>Disconnect</button>
                    {clientId && <div>Client ID: {clientId}</div>}
                    <div>
                        <label htmlFor="channel-select">Channel: </label>
                        <select id="channel-select" value={channel} onChange={handleChannelChange}>
                            {[...Array(11)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                            ))}
                        </select>
                    </div>
                    <button onClick={handleTransmit}>
                        {isTransmitting ? 'Stop Transmitting' : 'Start Transmitting'}
                    </button>
                    <div>{isTransmitting ? 'Transmitting...' : 'Not transmitting'}</div>
                </>
            ) : (
                <button onClick={handleConnect}>Connect</button>
            )}
        </div>
    );
};

export default MainPage;