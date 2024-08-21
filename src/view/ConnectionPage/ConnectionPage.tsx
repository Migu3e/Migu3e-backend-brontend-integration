import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConnectButton from '../../components/buttons/ConnectButton';
import { useWebSocketController } from '../../controller/WebSocketController';
import './ConnectionPage.css';

const ConnectionPage: React.FC = () => {
    const navigate = useNavigate();
    const { connect } = useWebSocketController();
    const [serverAddress, setServerAddress] = useState<string>('localhost');

    const handleConnect = async () => {
        try {
            await connect(serverAddress);
            navigate('/main');
        } catch (error) {
            console.error('Connection error:', error);
        }
    };

    return (
        <div className="connection-page">
            <div className="connection-box">
                <div className="connection-page__logo_container">
                    <img src="/vite.svg" alt="Logo" className="connection-page__logo"/>
                </div>
                <h1 className="connection-page__title">AudioPTTCLIENT</h1>
                <input
                    type="text"
                    value={serverAddress}
                    onChange={(e) => setServerAddress(e.target.value)}
                    placeholder="enter server IP"
                    className="connection-page__input"
                />
                <ConnectButton onClick={handleConnect} className="connection-page__button" />
            </div>
        </div>
    );
};

export default ConnectionPage;