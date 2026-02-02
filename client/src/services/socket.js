import { io } from 'socket.io-client';
import { addNotification } from '../redux/slices/notificationSlice';

let socket;

export const initiateSocket = (token, dispatch, userId) => {
    // Disable sockets on Vercel as it doesn't support them
    if (window.location.hostname.includes('vercel.app')) {
        console.warn('WebSockets are not supported on Vercel. Real-time features will be disabled.');
        return null;
    }

    const SERVER_URL = import.meta.env.VITE_API_URL ||
        (import.meta.env.PROD ? window.location.origin : 'http://localhost:5000');

    socket = io(SERVER_URL, {
        auth: { token },
        transports: ['websocket', 'polling'] // Standard fallback
    });

    console.log(`Connecting to socket at ${SERVER_URL}...`);

    socket.emit('join', userId);

    socket.on('notification:new', (data) => {
        dispatch(addNotification(data));
    });

    return socket;
};

export const disconnectSocket = () => {
    console.log('Disconnecting socket...');
    if (socket) socket.disconnect();
};

export const getSocket = () => socket;

export default socket;
