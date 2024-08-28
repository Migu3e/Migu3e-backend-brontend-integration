import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { WebSocketControllerContext } from './services/Context/WebSocketContext.tsx';
import ConnectionPage from './view/ConnectionPage/ConnectionPage';
import MainPage from './view/MainPage/MainPage';
import RegisterPage from './view/RegisterPage/RegisterPage';
const router = createBrowserRouter([
    {path: '/', element: <ConnectionPage />,},
    {path: '/main', element: <MainPage />,},
    {path: '/register', element: <RegisterPage />,},
    
]);

const App: React.FC = () => {
    return (
        <WebSocketControllerContext>
            <RouterProvider router={router} />
        </WebSocketControllerContext>
    );
};

export default App;