class WebSocketService {
    private socket: WebSocket | null = null;
    private clientId: string | null = null;

    connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.socket = new WebSocket('ws://localhost:8081');

            this.socket.onopen = () => {
                console.log('Connected to server');
                resolve();
            };

            this.socket.onmessage = (event) => {
                const message = JSON.parse(event.data);
                if (message.type === 'clientId') {
                    this.clientId = message.data;
                    console.log('Received client ID:', this.clientId);
                }
            };

            this.socket.onerror = (error) => {
                console.error('WebSocket error:', error);
                reject(error);
            };

            this.socket.onclose = () => {
                console.log('Disconnected from server');
                this.clientId = null;
            };
        });
    }

    disconnect(): void {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    }

    isConnected(): boolean {
        return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
    }

    getClientId(): string | null {
        return this.clientId;
    }
}

export default new WebSocketService();