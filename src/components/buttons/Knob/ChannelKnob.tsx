import React, { useState, useEffect, useRef } from 'react';
import { CHANNEL_FREQUENCIES } from '../../../models/ChannelFrequencies.tsx';
import './Knob.css';

interface RotatingKnobProps {
    channel: number;
    setChannel: (channel: number) => void;
    sendChannelFrequency: (frequency: number) => void;
}

const RotatingKnob: React.FC<RotatingKnobProps> = ({ channel, setChannel, sendChannelFrequency }) => {
    const [rotation, setRotation] = useState(0);
    const knobRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const newRotation = (channel - 1) * (360 / CHANNEL_FREQUENCIES.length);
        setRotation(newRotation);
    }, [channel]);

    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        const knob = knobRef.current;
        if (!knob) return;

        const knobRect = knob.getBoundingClientRect();
        const knobCenterX = knobRect.left + knobRect.width / 2;
        const knobCenterY = knobRect.top + knobRect.height / 2;

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const angle = Math.atan2(moveEvent.clientY - knobCenterY, moveEvent.clientX - knobCenterX);
            let newRotation = angle * (180 / Math.PI) + 90;
            if (newRotation < 0) newRotation += 360;

            const channelIndex = Math.round((newRotation / 360) * CHANNEL_FREQUENCIES.length);
            const newChannel = (channelIndex % CHANNEL_FREQUENCIES.length) + 1;

            setChannel(newChannel);
            const selectedFrequency = CHANNEL_FREQUENCIES.find((ch) => ch.channel === newChannel)?.frequency;
            if (selectedFrequency) {
                sendChannelFrequency(selectedFrequency);
            }
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    return (
        <div className="rotating-knob-container">
            <div
                ref={knobRef}
                className="rotating-knob"
                style={{transform: `rotate(${rotation}deg)`}}
                onMouseDown={handleMouseDown}
            >
                <div className="knob-indicator"/>
                <div className="knob-indicator-1"/>

            </div>
            <div className="channel-display">Channel {channel}</div>
        </div>
    );
};

export default RotatingKnob;