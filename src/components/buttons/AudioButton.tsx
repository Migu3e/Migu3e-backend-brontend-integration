import React from 'react';

interface AudioButtonProps {
    onMouseDown?: () => void;
    onMouseUp?: () => void;
    className?: string;
}

const AudioButton: React.FC<AudioButtonProps> = (props:AudioButtonProps) => {
    return (
        <button
            onMouseDown={props.onMouseDown}
            onMouseUp={props.onMouseUp}
            className={props.className}
        >
            Transmit
        </button>
    );
};

export default AudioButton;
