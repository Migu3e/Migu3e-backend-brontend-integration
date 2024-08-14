import React from 'react';

interface AudioButtonProps {
    onMouseDown?: () => void;
    onMouseUp?: () => void;
    className?: string;
}

const AudioButton: React.FC<AudioButtonProps> = ({onMouseDown, onMouseUp, className = '' }) => {
    return (
        <button
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            className={className}
        >
            Transmit
        </button>
    );
};

export default AudioButton;
