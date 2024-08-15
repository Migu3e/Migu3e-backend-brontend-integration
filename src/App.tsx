import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ConnectionPage from './view/ConnectionPage/ConnectionPage.tsx';
import MainPage from './view/MainPage/MainPage.tsx';

const App: React.FC = () => {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<ConnectionPage />} />
                    <Route path="/main" element={<MainPage />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;