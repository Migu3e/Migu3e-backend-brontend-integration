import { useState } from 'react';

function App() {
    const [isConnected, setIsConnected] = useState(false);
    const [socket, setSocket] = useState<WebSocket | null>(null);

    const connectToServer = () => {
        const newSocket = new WebSocket('ws://localhost:8081');

        newSocket.onopen = () => {
            console.log('Connected to server');
            setIsConnected(true);

            // Send a test message to the server
            newSocket.send('Hello, server!');
        };

        newSocket.onmessage = (message) => {
            console.log('Received message:', message.data);
        };

        setSocket(newSocket);
    };

    const disconnectFromServer = () => {
        if (socket) {
            socket.close();
            console.log('disconnected from server');
            setIsConnected(false);
            setSocket(null);
        }
    };

    return (
        <div className="App">
            <h1>Server Connection Status</h1>
            <p>{isConnected ? 'Connected to server' : 'Not connected to server'}</p>
            <button onClick={isConnected ? disconnectFromServer : connectToServer}>
                {isConnected ? 'Disconnect' : 'Connect'}
            </button>
        </div>
    );
}

export default App;
