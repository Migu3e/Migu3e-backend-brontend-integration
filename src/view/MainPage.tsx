import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientIdDisplay from '../components/ClientIdDisplay.tsx';
import WebSocketService from '../services/Utils/WebSocketUtils.tsx';

const MainPage: React.FC = () => {
    const navigate = useNavigate();
    const [clientId, setClientId] = useState<string | null>(null);

    useEffect(() => {
        if (!WebSocketService.isConnected()) {
            navigate('/');
        } else {
            setClientId(WebSocketService.getClientId());
        }
    }, [navigate]);

    const handleDisconnect = () => {
        WebSocketService.disconnect();
        navigate('/');
    };

    const handleTransmit = () => {
        console.log('Transmitting audio...');
    };

    const DisconnectButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
        <button onClick={onClick}>Disconnect</button>
    );

    const TransmitButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
        <button onClick={onClick}>Transmit Audio</button>
    );

    return (
        <div>
            <DisconnectButton onClick={handleDisconnect} />
            {clientId && <ClientIdDisplay clientId={clientId} />}
            <h1>Audio Chat</h1>
            <TransmitButton onClick={handleTransmit} />
        </div>
    );
};

export default MainPage;
