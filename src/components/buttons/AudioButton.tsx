import React from 'react';

interface AudioButtonProps {
    onClick: () => void;
}

const AudioButton: React.FC<AudioButtonProps> = ({ onClick }) => {
    return <button onClick={onClick}>Transmmit</button>;
};

export default AudioButton;