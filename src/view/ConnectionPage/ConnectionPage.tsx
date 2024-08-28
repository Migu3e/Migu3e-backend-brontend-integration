import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConnectButton from '../../components/buttons/ConnectButton';
import { useWebSocketController } from '../../controller/useWebSocketController.tsx';
import './ConnectionPage.css';
import RegisterButton from "../../components/buttons/RegisterPage.tsx";

const ConnectionPage: React.FC = () => {
    const navigate = useNavigate();
    const { connect } = useWebSocketController();
    const [serverAddress, setServerAddress] = useState<string>('');
    const [personalNumber, setPersonalNumber] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleConnect = async () => {
        try {
            await connect(serverAddress);
            navigate('/main');
        } catch (error) {
            console.error('Connection error:', error);
        }
    };
    const handleRegister = async () => {
        try {
           
            navigate('/register');
        } catch (error) {
            console.error('Connection error:', error);
        }
    }

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
                    placeholder="Enter server IP"
                    className="connection-page__input"
                />
                <input
                    type="text"
                    value={personalNumber}
                    onChange={(e) => setPersonalNumber(e.target.value)}
                    placeholder="Enter personal number"
                    className="connection-page__input"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="connection-page__input"
                />
                <ConnectButton onClick={handleConnect} className="connection-page__button"/>
                <RegisterButton onClick={handleRegister} className="connection-page__button_Login"/>

            </div>
        </div>
    );
};

export default ConnectionPage;