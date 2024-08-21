import React from 'react';

interface AudioButtonProps {
    onMouseDown?: () => void;
    onMouseUp?: () => void;
    className?: string;
    isOn?: boolean
}

const AudioButton: React.FC<AudioButtonProps> = (props:AudioButtonProps) => {
    return (
        <>
            {props.isOn ? (
                <button
                    onMouseDown={props.onMouseDown}
                    onMouseUp={props.onMouseUp}
                    className={props.className}
                >
                    Transmit
                </button>
            ): (
                <button
                    className={props.className}
                >
                    Transmit
                </button>
            )

            }
        </>
    );
};

export default AudioButton;
