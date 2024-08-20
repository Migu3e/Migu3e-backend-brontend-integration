import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AudioButton from '../../components/buttons/AudioButton';
import DisconnectButton from '../../components/buttons/DisconnectButton';
import ButtonGrid from '../../components/buttons/8buttons/ButtonGrid.tsx';
import ChannelKnob from '../../components/buttons/Knob/ChannelKnob.tsx';
import VolumeKnob from '../../components/buttons/Knob/VolumeKnob.tsx';
import StatusDisplay from '../../components/StatusDisplay.tsx';

import { useWebSocketController } from '../../controller/WebSocketController.tsx';
import './MainPage.css';
import {CHANNEL_FREQUENCIES} from "../../models/ChannelFrequencies.tsx";

const MainPage: React.FC = () => {
    const navigate = useNavigate();
    const [clientId, setClientId] = useState<string | null>(null);
    const [isTransmitting, setIsTransmitting] = useState(false);
    const [channel, setChannel] = useState(1);
    const { getClientId, isConnected, startTransmission, stopTransmission, disconnect, sendChannelFrequency,sendVolumeLevel } = useWebSocketController();
    const [volume, setVolume] = useState(50);

    useEffect(() => {
        setClientId(getClientId());
    }, []);

    const handleMouseDown = () => {
        if (isConnected) {
            startTransmission(channel);
            setIsTransmitting(true);
        } else {
            console.error('WebSocket is not connected');
        }
    };

    const handleMouseUp = () => {
        stopTransmission();
        setIsTransmitting(false);
    };
    const currentFrequency = CHANNEL_FREQUENCIES.find(c => c.channel === channel)?.frequency;

    return (
        <div className="main">

            <div className="main-page">
                <div className="main-box relative">
                    <div className="absolute top-4 right-4">
                        <ChannelKnob channel={channel} setChannel={setChannel}
                                     sendChannelFrequency={sendChannelFrequency}/>
                    </div>
                    <div className="absolute top-4 left-4">
                        <VolumeKnob volume={volume} setVolume={setVolume} sendVolumeLevel={sendVolumeLevel}
                        />
                    </div>
                    <img src="/vite.svg" alt="Logo" className="main-page__logo"/>
                    <h1 className="main-page__title">AudioPTTCLIENT</h1>

                    <StatusDisplay
                        clientId={clientId || 'Not connected'}
                        volume={volume}
                        channel={channel}
                        frequency={currentFrequency}
                    />
                    <AudioButton onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}
                                 className={`main-page__button ${isTransmitting ? 'main-page__button--transmitting' : ''}`}
                    />
                    <ButtonGrid/>

                    <DisconnectButton onClick={() => {
                        disconnect();
                        navigate('/');
                    }} className="main-page__button main-page__button--disconnect"
                    />
                </div>
            </div>
        </div>
    );
};

export default MainPage;