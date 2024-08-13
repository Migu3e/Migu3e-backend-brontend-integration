import React from 'react';

interface DisconnectButtonProps {
    onClick: () => void;
    className?: string;
}

const DisconnectButton: React.FC<DisconnectButtonProps> = ({ onClick, className = '' }) => {
    return (
        <button onClick={onClick} className={className}>
            Disconnect
        </button>
    );
};

export default DisconnectButton;