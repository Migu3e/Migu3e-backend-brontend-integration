import React, { useState, useEffect, useRef } from 'react';
import './Knob.css';

interface RotatingKnobProps {
    channel: number;
    setChannel: (channel: number) => void;
}

const RotatingKnob = (prop:RotatingKnobProps) => {
    const [rotation, setRotation] = useState(0);
    const knobRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const newRotation = (prop.channel - 1) * (360 / 10);
        setRotation(newRotation);
    }, [prop.channel]);

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

            const channelIndex = Math.round((newRotation / 360) * 10);
            const newChannel = (channelIndex % 10) + 1;

            prop.setChannel(newChannel);

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
            </div>
            <div className="channel-display">
                <span className="channel-label">Channel</span>
            </div>
        </div>
    );
};

export default RotatingKnob;