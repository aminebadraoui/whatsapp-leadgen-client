import { create } from 'zustand';

const useWebSocketStore = create((set, get) => ({
    socket: null,
    connect: (userId) => {
        const socket = new WebSocket(process.env.REACT_APP_WS_URL);
        socket.onopen = () => {
            console.log('WebSocket connected');
            socket.send(JSON.stringify({ action: 'initialize', userId }));
        };
        set({ socket });
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