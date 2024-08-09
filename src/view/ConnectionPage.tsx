import React from 'react';
import { useNavigate } from 'react-router-dom';
import ConnectButton from '../components/buttons/ConnectButton';
import WebSocketService from '../services/Utils/WebSocketUtils.tsx';

const ConnectionPage: React.FC = () => {
    const navigate = useNavigate();

    const handleConnect = async () => {
        try {
            await WebSocketService.connect();
            await new Promise(resolve => setTimeout(resolve, 1000));
            navigate('/main');
        } catch (error) {
            console.error('Connection error:', error);
        }
    };

    return (
        <div>
            <h1>Welcome to the Audio Chat App</h1>
            <ConnectButton onClick={handleConnect} />
        </div>
    );
};

export default ConnectionPage;