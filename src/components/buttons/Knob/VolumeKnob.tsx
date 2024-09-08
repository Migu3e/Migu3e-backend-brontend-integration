import React, { useState, useEffect, useRef } from 'react';

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
        <div className="flex flex-col items-center">
            <div
                ref={knobRef}
                className="w-[3.75rem] h-[3.75rem] rounded-full bg-[#454545] border-2 border-[#afafaf] relative cursor-pointer"
                style={{transform: `rotate(${rotation}deg)`}}
                onMouseDown={handleMouseDown}
            >
                <div
                    className="absolute top-[-0.1875rem] left-1/2 w-[0.125rem] h-[0.9375rem] bg-white -translate-x-1/2 border-r-[0.3125rem] border-transparent"/>
            </div>
            <div className="mt-1 text-sm text-white flex flex-col items-center">
                <span className="text-xs text-gray-400">Volume</span>
            </div>
        </div>
    );
};

export default VolumeKnob;