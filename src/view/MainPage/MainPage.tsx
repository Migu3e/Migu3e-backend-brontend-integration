import React, { useState, useEffect, useMemo } from 'react';
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
import './MainPage.css';

const MainPage: React.FC = () => {
    const navigate = useNavigate();
    const [isTransmitting, setIsTransmitting] = useState(false);
    const [channel, setChannel] = useState(1);
    const [volume, setVolume] = useState(50);
    const [isOn, setIsOn] = useState(false);
    const [frequencyKnob, setFrequencyKnob] = useState(1);
    const [minFreq, setMinFreq] = useState(30);
    const [maxFreq, setMaxFreq] = useState(500);

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

    const FrequencyCalculator = useMemo(() => {
        const channelStep = (maxFreq - minFreq) / 9;
        const channels = Array.from({ length: 10 }, (_, i) => minFreq + channelStep * i);
        const frequencies = channels.flatMap((channelFreq, index) => {
            if (index === channels.length - 1) return [];
            const nextChannelFreq = channels[index + 1];
            const freqStep = (nextChannelFreq - channelFreq) / 10;
            return Array.from({ length: 10 }, (_, i) => channelFreq + freqStep * i);
        });
        return { channels, frequencies };
    }, [minFreq, maxFreq]);

    const calculateFrequency = (channel: number, knob: number): number => {
        const index = (channel - 1) * 10 + (knob - 1);
        return FrequencyCalculator.frequencies[index];
    };

    useEffect(() => {
        const loadSettings = async () => {
            const settings = await getSettings();
            if (settings) {
                setChannel(settings.channel);
                setVolume(settings.volume);
                setMinFreq(settings.minFrequency);
                setMaxFreq(settings.maxFrequency);
                // Reverse calculate the frequency knob position
                const freq = settings.frequency;
                const channelIndex = FrequencyCalculator.channels.findIndex(c => c > freq) - 1;
                const knobPosition = Math.round((freq - FrequencyCalculator.channels[channelIndex]) /
                    ((FrequencyCalculator.channels[channelIndex + 1] - FrequencyCalculator.channels[channelIndex]) / 10)) + 1;
                setFrequencyKnob(knobPosition);
            }
        };
        loadSettings();
    }, [getSettings, FrequencyCalculator]);

    const handleChannelChange = async (newChannel: number) => {
        setChannel(newChannel);
        const frequency = calculateFrequency(newChannel, frequencyKnob);
        await sendChannelFrequency(newChannel, frequency);
    };

    const handleFrequencyKnobChange = async (newKnob: number) => {
        setFrequencyKnob(newKnob);
        const frequency = calculateFrequency(channel, newKnob);
        await sendChannelFrequency(channel, frequency);
    };

    const handleVolumeChange = async (newVolume: number) => {
        setVolume(newVolume);
        await sendVolumeLevel(newVolume);
    };

    const handleOnOffToggle = async () => {
        const newState = !isOn;
        setIsOn(newState);
        await sendOnOffState(newState);
    };

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

    const currentFrequency = calculateFrequency(channel, frequencyKnob);

    return (
        <div className="main">
            <div className="main-page">
                <div className="main-box">
                    <div className="absolute top-4 right-4">
                        <ChannelKnob channel={channel} setChannel={handleChannelChange}/>
                    </div>
                    <div>
                        <FrequencyKnob Frequency={frequencyKnob} setFrequency={handleFrequencyKnobChange}/>
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