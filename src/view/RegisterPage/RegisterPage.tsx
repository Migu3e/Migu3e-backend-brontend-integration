import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConnectButton from '../../components/buttons/ConnectButton';
import LoginButton from "../../components/buttons/LoginButton.tsx";
import './RegisterPage.css';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [serverAddress, setServerAddress] = useState<string>('');
    const [personalNumber, setPersonalNumber] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordAgain, setPasswordAgain] = useState<string>('');
    const [selectedOption, setSelectedOption] = useState<number>(1);
    const [error, setError] = useState<string>('');

    const handleRegister = async () => {
        // Basic validation
        if (!serverAddress || !personalNumber || !password || !passwordAgain) {
            setError('All fields are required');
            return;
        }
        if (password !== passwordAgain) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await fetch(`http://${serverAddress}:5000/api/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ClientID: personalNumber,
                    Password: password,
                    Type: selectedOption
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Registration successful:', data);
                navigate('/'); // Redirect to login page after successful registration
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            setError('An error occurred during registration');
        }
    };

    const handleLogin = () => {
        navigate('/');
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedOption(Number(e.target.value));
    };

    return (
        <div className="connection-page">
            <div className="connection-box">
                <div className="connection-page__logo_container">
                    <img src="/vite.svg" alt="Logo" className="connection-page__logo"/>
                </div>
                <h1 className="connection-page__title">AudioPTTCLIENT</h1>
                {error && <p className="error-message">{error}</p>}
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
                <input
                    type="password"
                    value={passwordAgain}
                    onChange={(e) => setPasswordAgain(e.target.value)}
                    placeholder="Enter password again"
                    className="connection-page__input"
                />
                <select
                    value={selectedOption}
                    onChange={handleSelectChange}
                    className="connection-page__input_select">
                    <option value={1}>חייל היבשה</option>
                    <option value={2}>חייל הים</option>
                    <option value={3}>חייל האוויר</option>
                    <option value={4}>מג"ב</option>
                </select>
                <ConnectButton onClick={handleRegister} className="connection-page__button"></ConnectButton>
                <LoginButton onClick={handleLogin} className="connection-page__button_Login"/>
            </div>
        </div>
    );
};

export default RegisterPage;