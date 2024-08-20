import React from 'react';

interface DisconnectButtonProps {
    onClick: () => void;
    className?: string;
}

const DisconnectButton: React.FC<DisconnectButtonProps> = (props:DisconnectButtonProps) => {
    return (
        <button onClick={props.onClick} className={props.className}>
            Disconnect
        </button>
    );
};

export default DisconnectButton;