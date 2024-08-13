import React from 'react';

interface AudioButtonProps {
    onClick: () => void;
    className?: string;
}

const AudioButton: React.FC<AudioButtonProps> = ({ onClick, className = '' }) => {
    return (
        <button onClick={onClick} className={className}>
            Transmit
        </button>
    );
};

export default AudioButton;