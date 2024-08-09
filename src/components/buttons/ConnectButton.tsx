import React from 'react';

interface ConnectButtonProps {
    onClick: () => void;
}

const ConnectButton: React.FC<ConnectButtonProps> = ({ onClick }) => {
    return <button onClick={onClick}>Connect</button>;
};

export default ConnectButton;