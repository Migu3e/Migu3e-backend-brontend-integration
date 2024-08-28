import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AudioButton from '../../components/buttons/AudioButton';
import DisconnectButton from '../../components/buttons/DisconnectButton';
import ButtonGrid from '../../components/buttons/8buttons/ButtonGrid';
import ChannelKnob from '../../components/buttons/Knob/ChannelKnob';
import VolumeKnob from '../../components/buttons/Knob/VolumeKnob';
import OnOffSwitch from '../../components/buttons/onoff/OnOffSwitch';
import StatusDisplay from '../../components/Display/StatusDisplay.tsx';
import FrequencyKnob from '../../components/buttons/Knob/frequencyKnob.tsx';
import { useWebSocketController } from '../../controller/useWebSocketController.tsx';
import { CHANNEL_FREQUENCIES } from "../../models/ChannelFrequencies";
import './MainPage.css';

const MainPage: React.FC = () => {
    const navigate = useNavigate();
    const [isTransmitting, setIsTransmitting] = useState(false);
    const [channel, setChannel] = useState(1);
    const [volume, setVolume] = useState(50);
    const [isOn, setIsOn] = useState(false);
    const [Freqeunsy, setFreqeunsy] = useState(1);
    const {
        clientId,
        isConnected,
        startTransmission,
        stopTransmission,
        disconnect,
        sendChannelFrequency,
        sendVolumeLevel,
        sendOnOffState,
        getSettings
    } = useWebSocketController();

    useEffect(() => {
        const loadSettings = async () => {
            const settings = await getSettings();
            if (settings) {
                setChannel(settings.channel);
                setVolume(settings.volume);
            }
        };
        loadSettings();
    }, [getSettings]);

    const handleMouseDown = async () => {
        if (isConnected) {
            await startTransmission();
            setIsTransmitting(true);
        } else {
            console.error('WebSocket is not connected');
        }
    };

    const handleMouseUp = () => {
        stopTransmission();
        setIsTransmitting(false);
    };

    const handleOnOffToggle = async () => {
        const newState = !isOn;
        setIsOn(newState);
        await sendOnOffState(newState);
    };

    const handleChannelChange = async (newChannel: number) => {
        setChannel(newChannel);
        await sendChannelFrequency(newChannel);
    };

    const handleVolumeChange = async (newVolume: number) => {
        setVolume(newVolume);
        await sendVolumeLevel(newVolume);
    };

    const currentFrequency = CHANNEL_FREQUENCIES.find(c => c.channel === channel)?.frequency;

    return (
        <div className="main">
            <div className="main-page">
                <div className="main-box">
                    <div className="absolute top-4 right-4">
                        <ChannelKnob channel={channel} setChannel={handleChannelChange}/>
                    </div>
                    <div>
                        <FrequencyKnob Frequency={Freqeunsy} setFrequency={setFreqeunsy}
                                       sendChannelFrequency={sendChannelFrequency}/>
                    </div>
                    <div className="mt-5">
                        <OnOffSwitch isOn={isOn} onToggle={handleOnOffToggle}/>
                    </div>
                    <div className="absolute top-4 left-4">
                        <VolumeKnob volume={volume} setVolume={handleVolumeChange}/>
                    </div>

                    <h1 className="main-page__title mt-2">AudioPTTCLIENT</h1>
                    <StatusDisplay clientId={clientId || 'Error'} volume={volume} channel={channel}
                                   frequency={currentFrequency} isOn={isOn}/>
                    <AudioButton
                        onMouseDown={handleMouseDown}
                        onMouseUp={handleMouseUp}
                        className={isOn ? `main-page__button ${isTransmitting ? 'main-page__button--transmitting' : ''}` : 'main-page-button-off'}
                        isOn={isOn}
                    />
                    <ButtonGrid/>
                    <DisconnectButton
                        onClick={() => {
                            disconnect();
                            navigate('/');
                        }}
                        className="main-page-button-disconnect"
                    />
                </div>
            </div>
        </div>
    );
};


export default MainPage;
