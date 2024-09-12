import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ConnectButton from '../../components/buttons/ConnectButton';
import LoginButton from "../../components/buttons/LoginButton.tsx";
import TypeSelector from "../../components/Select/TypeSelect.tsx";
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
        if (!serverAddress || !personalNumber || !password || !passwordAgain) {
            setError('All fields are needed');
            return;
        }
        if (password !== passwordAgain) {
            setError('Passwords do not match');
            return;
        }

        const response = await axios.post(`http://${serverAddress}:5000/api/register`, {
            ClientID: personalNumber,
            Password: password,
            Type: selectedOption
        });

        if (response.status === 200) {
            navigate('/');
        }
        else {
            setError(response.data.message || 'register error');
        }
    };

    const handleLogin = () => {
        navigate('/');
    };

    const handleSelectChange = (e) => {
        setSelectedOption(Number(e.target.value));
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="bg-[#282828] rounded-lg p-[2.5rem] w-[27.125rem] shadow-[0_4px_60px_rgba(0,0,0,0.5)] text-center flex flex-col items-center">
                <div>
                    <img src="/vite.svg" alt="Logo" className="w-[3.125rem] h-[3.125rem] mb-[1.25rem]"/>
                </div>
                <h1 className="text-white mb-[2rem] text-[2rem]">AudioPTTCLIENT</h1>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <input type="text" value={serverAddress} onChange={(e) => setServerAddress(e.target.value)} placeholder="Enter server IP" className="bg-[#3E3E3E] text-white border-2 border-[#535353] rounded-full py-[0.75rem] px-[1.5rem] text-base w-full mb-[1.5rem] focus:outline-none focus:border-[#1DB954] transition-colors duration-300"/>
                <input type="text" value={personalNumber} onChange={(e) => setPersonalNumber(e.target.value)} placeholder="Enter personal number" className="bg-[#3E3E3E] text-white border-2 border-[#535353] rounded-full py-[0.75rem] px-[1.5rem] text-base w-full mb-[1.5rem] focus:outline-none focus:border-[#1DB954] transition-colors duration-300"/>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" className="bg-[#3E3E3E] text-white border-2 border-[#535353] rounded-full py-[0.75rem] px-[1.5rem] text-base w-full mb-[1.5rem] focus:outline-none focus:border-[#1DB954] transition-colors duration-300"/>
                <input type="password" value={passwordAgain} onChange={(e) => setPasswordAgain(e.target.value)} placeholder="Enter password again" className="bg-[#3E3E3E] text-white border-2 border-[#535353] rounded-full py-[0.75rem] px-[1.5rem] text-base w-full mb-[1.5rem] focus:outline-none focus:border-[#1DB954] transition-colors duration-300"/>
                <TypeSelector value={selectedOption} onChange={handleSelectChange}/>
                <ConnectButton onClick={handleRegister} className="bg-[#1DB954] text-white border border-[#1DB954] rounded-full py-[0.875rem] px-[2rem] text-base font-bold w-full transition-colors duration-300 hover:bg-[#282828] hover:text-[#1DB954]"></ConnectButton>
                <LoginButton onClick={handleLogin} className="bg-[#a2ad00] mt-4 text-white border border-[#a2ad00] rounded-full py-[0.875rem] px-[2rem] text-base font-bold w-full transition-colors duration-300 hover:bg-[#282828] hover:text-[#CDFD02]"/>
            </div>
        </div>
    );
};

export default RegisterPage;