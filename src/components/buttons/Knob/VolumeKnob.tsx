import React, { useState, useEffect, useRef } from 'react';
import './Knob.css';

interface VolumeKnobProps {
    volume: number;
    setVolume: (volume: number) => void;
}

const VolumeKnob: React.FC<VolumeKnobProps> = ({ volume, setVolume }) => {
    const [rotation, setRotation] = useState(0);
    const knobRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const newRotation = volume * (270 / 100) - 135;
        setRotation(newRotation);
    }, [volume]);

    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        const knob = knobRef.current;
        if (!knob) return;

        const knobRect = knob.getBoundingClientRect();
        const knobCenterX = knobRect.left + knobRect.width / 2;
        const knobCenterY = knobRect.top + knobRect.height / 2;

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const angle = Math.atan2(moveEvent.clientY - knobCenterY, moveEvent.clientX - knobCenterX);
            let newRotation = angle * (180 / Math.PI) + 135;
            newRotation = Math.max(0, Math.min(newRotation, 270));

            const newVolume = Math.round((newRotation / 270) * 10) * 10;
            setVolume(newVolume);

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
                <span className="channel-label">Volume</span>
            </div>
        </div>
    );
};

export default VolumeKnob;