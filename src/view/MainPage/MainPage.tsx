import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AudioButton from '../../components/buttons/AudioButton.tsx';
import DisconnectButton from '../../components/buttons/DisconnectButton.tsx';
import ClientIdDisplay from '../../components/ClientIdDisplay.tsx';
import {
    disconnect,
    getClientId,
    isConnected,
    startTransmission as startWsTransmission,
    stopTransmission as stopWsTransmission
} from '../../services/Utils/WebSocketUtils.tsx';
import './MainPage.css'

const MainPage: React.FC = () => {
    const navigate = useNavigate();
    const [clientId, setClientId] = useState<string | null>(null);
    const [isTransmitting, setIsTransmitting] = useState(false);
    const [channel, setChannel] = useState(1);

    useEffect(() => {
        setClientId(getClientId());
    }, []);

    useEffect(() => {
        return () => {
            if (isTransmitting) {
                stopWsTransmission();
            }
        };
    }, [isTransmitting]);

    const handleDisconnect = useCallback(() => {
        disconnect();
        navigate('/');
    }, [navigate]);

    const startTransmission = useCallback(async () => {
        if (!isConnected()) {
            console.error('WebSocket is not connected');
            return;
        }
        setIsTransmitting(true);
        try {
            await startWsTransmission(channel);
        } catch (error) {
            console.error('Failed to start transmission:', error);
            setIsTransmitting(false);
        }
    }, [channel]);

    const stopTransmission = useCallback(() => {
        setIsTransmitting(false);
        stopWsTransmission();
    }, []);

    const handleAudioButtonClick = useCallback(() => {
        if (isTransmitting) {
            stopTransmission();
        } else {
            startTransmission();
        }
    }, [isTransmitting, startTransmission, stopTransmission]);

    return (
        <div className="main">
            <div className="main-page-name">
                <div className="main-box">
                    <ClientIdDisplay className="main-page__client-id" clientId={clientId || 'Not connected'}/>
                </div>
            </div>
            <div className="main-page">
                <div className="main-box">
                    <img src="../../../public/vite.svg" alt="Logo" className="main-page__logo"/>
                    <h1 className="main-page__title">AudioPTTCLIENT</h1>
                    <AudioButton
                        onClick={handleAudioButtonClick}
                        className={`main-page__button ${isTransmitting ? 'main-page__button--transmitting' : ''}`}
                    />
                    <DisconnectButton
                        onClick={handleDisconnect}
                        className="main-page__button main-page__button--disconnect"
                    />
                    <div className="main-page__channel-select">
                        <label htmlFor="channelSelect" className="main-page__select-label">Select Channel:</label>
                        <select
                            id="channelSelect"
                            className="main-page__select"
                            value={channel}
                            onChange={(e) => setChannel(parseInt(e.target.value))}
                        >
                            {[1, 2, 3, 4, 5].map((ch) => (
                                <option key={ch} value={ch}>
                                    Channel {ch}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainPage;