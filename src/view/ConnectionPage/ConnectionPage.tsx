import React from 'react';
import { useNavigate } from 'react-router-dom';
import ConnectButton from '../../components/buttons/ConnectButton';
import { useWebSocketController } from '../../controller/WebSocketController.tsx';
import './ConnectionPage.css';

const ConnectionPage: React.FC = () => {
    const navigate = useNavigate();
    const { connect } = useWebSocketController();

    const handleConnect = async () => {
        try {
            await connect();
            navigate('/main');
        } catch (error) {
            console.error('Connection error:', error);
        }
    };

    return (
        <div className="connection-page">
            <div className="connection-box">
                <div className=".connection-page__logo_continer">
                    <img src="../../../public/vite.svg" alt="Logo" className="connection-page__logo"/>
                </div>
                <h1 className="connection-page__title">AudioPTTCLIENT</h1>
                <ConnectButton onClick={handleConnect} className="connection-page__button" />
            </div>
        </div>
    );
};

export default ConnectionPage;