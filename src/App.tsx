import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { WebSocketProvider } from './controller/WebSocketContext';
import ConnectionPage from './view/ConnectionPage/ConnectionPage';
import MainPage from './view/MainPage/MainPage';

const App: React.FC = () => {
    return (
        <WebSocketProvider>
            <Router>
                <div className="App">
                    <Routes>
                        <Route path="/" element={<ConnectionPage />} />
                        <Route path="/main" element={<MainPage />} />
                    </Routes>
                </div>
            </Router>
        </WebSocketProvider>
    );
};

export default App;