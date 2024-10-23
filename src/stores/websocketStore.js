import { create } from 'zustand';

const useWebSocketStore = create((set, get) => ({
    socket: null,
    connect: (userId) => {
        const { socket } = get();
        if (socket && (socket.readyState === WebSocket.CONNECTING || socket.readyState === WebSocket.OPEN)) {
            console.log('WebSocket already connected or connecting');
            return;
        }
        const newSocket = new WebSocket(process.env.REACT_APP_WS_URL);
        newSocket.onopen = () => {
            console.log('WebSocket connected');
            newSocket.send(JSON.stringify({ action: 'initialize', userId }));
        };
        set({ socket: newSocket });
    },
    disconnect: () => {
        const { socket } = get();
        if (socket) {
            socket.close();
            set({ socket: null });
        }
    },
    sendMessage: (message) => {
        const { socket } = get();
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(message));
        } else {
            console.error('WebSocket is not connected');
        }
    },
}));

export default useWebSocketStore;