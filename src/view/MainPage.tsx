import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientIdDisplay from '../components/ClientIdDisplay.tsx';
import WebSocketService from '../services/Utils/WebSocketUtils.tsx';
import DisconnectButton from '../components/buttons/DisconnectButton.tsx';
import AudioButton from '../components/buttons/AudioButton.tsx';



const MainPage: React.FC = () => {
    const [clientId, setClientId] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkConnection = async () => {
            if (!WebSocketService.isConnected()) {
                navigate('/');
            } else
            {
                if(WebSocketService.getClientId() !== null)
                {
                    setClientId(WebSocketService.getClientId());
                }
                console.log(WebSocketService.getClientId());
            }
        };

        checkConnection();


    }, [navigate]);

    const handleDisconnect = () => {
        WebSocketService.disconnect();
        navigate('/');
    };

    const handleTransmit = () => {
        console.log('audio...');
    };


    return (
        <div>
            <DisconnectButton onClick={handleDisconnect} />
            {clientId && <ClientIdDisplay clientId={clientId} />}
            <h1>Radio device thingy</h1>
            <AudioButton onClick={handleTransmit}></AudioButton>
        </div>
    );
};

export default MainPage;
