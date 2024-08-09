import React from 'react';

interface DisconnectButtonProps {
    onClick: () => void;
}

const DisconnectButton: React.FC<DisconnectButtonProps> = ({ onClick }) => {
    return <button onClick={onClick}>Disconnect</button>;
};

export default DisconnectButton;