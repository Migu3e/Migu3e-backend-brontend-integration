import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AudioButton from '../../components/buttons/AudioButton';
import DisconnectButton from '../../components/buttons/DisconnectButton';
import ButtonGrid from '../../components/buttons/8buttons/ButtonGrid';
import ChannelKnob from '../../components/buttons/Knob/ChannelKnob';
import VolumeKnob from '../../components/buttons/Knob/VolumeKnob';
import OnOffSwitch from '../../components/buttons/onoff/OnOffSwitch';
import StatusDisplay from '../../components/Display/StatusDisplay.tsx';
import FrequencyKnob from '../../components/buttons/Knob/frequencyKnob.tsx';
import { useWebSocketContext } from '../../services/Context/WebSocketContext.tsx';
import './MainPage.css';
import {calculateFrequency, calculateChannelAndKnob} from "../../services/Utils/KnobUtils.tsx";

const MainPage = () => {
    const navigate = useNavigate();
    const [isTransmitting, setIsTransmitting] = useState(false);
    const [channel, setChannel] = useState(1);
    const [volume, setVolume] = useState(50);
    const [isOn, setIsOn] = useState(false);
    const [frequencyKnob, setFrequencyKnob] = useState(1);
    const [minFreq, setMinFreq] = useState(30);
    const [maxFreq, setMaxFreq] = useState(500);
    const {clientId,isConnected,startTransmission,stopTransmission,disconnect,sendChannelFrequency,sendVolumeLevel,sendOnOffState,getSettings} = useWebSocketContext();
    useEffect(() => {
        const loadSettings = async () => {
            const settings = await getSettings();
            if (settings) {
                setChannel(settings.channel);
                setVolume(settings.volume);
                setMinFreq(settings.minFrequency);
                setMaxFreq(settings.maxFrequency);
                // Reverse calculate the frequency knob position
                const { channel, knob } = calculateChannelAndKnob(settings.frequency, settings.minFrequency, settings.maxFrequency);
                setChannel(channel);
                setFrequencyKnob(knob);
            }
        };
        loadSettings();
    }, [getSettings]);

    const handleChannelChange = async (newChannel: number) => {
        setChannel(newChannel);
        const frequency = calculateFrequency(newChannel, frequencyKnob, minFreq, maxFreq);
        await sendChannelFrequency(newChannel, frequency);
    };

    const handleFrequencyKnobChange = async (newKnob: number) => {
        setFrequencyKnob(newKnob);
        const frequency = calculateFrequency(channel, newKnob, minFreq, maxFreq);
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

    const currentFrequency = calculateFrequency(channel, frequencyKnob, minFreq, maxFreq);

    return (
        <div className="mt-[2.5rem] pb-[2.5rem]">
            <div className="flex justify-center items-center mt-[1.25rem]">
                <div className="bg-[#282828] rounded-lg p-[2.5rem] w-[22.775rem] h-[52.0rem] shadow-[0_4px_60px_rgba(0,0,0,0.5)] text-center flex flex-col items-center relative">
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

                    <h1 className="text-white text-[1.75rem] mb-[1.25rem] mt-2">AudioPTTCLIENT</h1>
                    <StatusDisplay clientId={clientId || 'Error'} volume={volume} channel={channel} frequency={currentFrequency} isOn={isOn}/>
                    <AudioButton onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} className={isOn ? `bg-[#c1bb00] text-white border-none rounded-[31.25rem] py-[0.8125rem] text-base font-bold cursor-pointer w-full transition-colors duration-300 hover:bg-[#1ed760] ${isTransmitting ? 'bg-[#E91429] text-white border-none rounded-[31.25rem] py-[0.8125rem] text-base font-bold cursor-pointer w-full transition-colors duration-300 hover:bg-[#ff1e3c] hover:text-[#6a0000]' : ''}` : 'bg-[#949494] text-white border-none rounded-[31.25rem] py-[0.8125rem] text-base font-bold cursor-pointer w-full transition-colors duration-300 hover:bg-[#404040] hover:text-[#b2b2b2]'} isOn={isOn}/>
                    <ButtonGrid/>
                    <DisconnectButton
                        onClick={() => {
                            disconnect();
                            navigate('/');
                        }}
                        className="bg-[#535353] text-white border-none rounded-[31.25rem] py-[0.8125rem] text-base font-bold cursor-pointer w-full transition-colors duration-300 hover:bg-[#6a0000] hover:text-black"
                    />
            </div>
            </div>
        </div>
    );
};

export default MainPage;