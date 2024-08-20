import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { WebSocketProvider } from './controller/WebSocketContext';
import ConnectionPage from './view/ConnectionPage/ConnectionPage';
import MainPage from './view/MainPage/MainPage';

const router = createBrowserRouter([
    {
        path: '/',
        element: <ConnectionPage />,
    },
    {
        path: '/main',
        element: <MainPage />,
    },
]);

const App: React.FC = () => {
    return (
        <WebSocketProvider>
            <RouterProvider router={router} />
        </WebSocketProvider>
    );
};

export default App;