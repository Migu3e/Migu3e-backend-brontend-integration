import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AudioButton from '../../components/buttons/AudioButton';
import DisconnectButton from '../../components/buttons/DisconnectButton';
import ClientIdDisplay from '../../components/ClientIdDisplay';
import ChannelKnob from '../../components/buttons/Knob/ChannelKnob.tsx';


import { useWebSocketController } from '../../controller/WebSocketController.tsx';
import './MainPage.css';

const MainPage: React.FC = () => {
    const navigate = useNavigate();
    const [clientId, setClientId] = useState<string | null>(null);
    const [isTransmitting, setIsTransmitting] = useState(false); // Define the isTransmitting state
    const [channel, setChannel] = useState(1);
    const { getClientId, isConnected, startTransmission, stopTransmission, disconnect,sendChannelFrequency } = useWebSocketController();

    useEffect(() => {
        setClientId(getClientId());
    }, []);

    const handleMouseDown = () => {
        if (isConnected) {
            startTransmission(channel);
            setIsTransmitting(true); // isTransmitting true when transmission starts
        } else {
            console.error('WebSocket is not connected');
        }
    };

    const handleMouseUp = () => {
        stopTransmission();
        setIsTransmitting(false); // isTransmitting false when transmission stops
    };

    return (
        <div className="main">
            <div className="main-page-name">
                <div className="main-box">
                    <ClientIdDisplay className="main-page__client-id" clientId={clientId || 'Not connected'} />
                </div>
            </div>
            <div className="main-page">
                <div className="main-box">
                    <img src="/vite.svg" alt="Logo" className="main-page__logo" />
                    <h1 className="main-page__title">AudioPTTCLIENT</h1>
                    <AudioButton onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}
                        className={`main-page__button ${isTransmitting ? 'main-page__button--transmitting' : ''}`}
                    />
                    <DisconnectButton onClick={() => { disconnect(); navigate('/'); }}
                        className="main-page__button main-page__button--disconnect"
                    />
                    <ChannelKnob channel={channel} setChannel={setChannel}  sendChannelFrequency={sendChannelFrequency} />
                </div>
            </div>
        </div>
    );
};

export default MainPage;
