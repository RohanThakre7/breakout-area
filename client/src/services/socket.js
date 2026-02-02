import { io } from 'socket.io-client';
import { addNotification } from '../redux/slices/notificationSlice';

let socket;

export const initiateSocket = (token, dispatch, userId) => {
    const SERVER_URL = import.meta.env.VITE_API_URL ||
        (import.meta.env.PROD ? window.location.origin : 'http://localhost:5000');

    socket = io(SERVER_URL, {
        auth: { token },
        transports: ['websocket', 'polling']
    });

    console.log(`Connecting to socket at ${SERVER_URL}...`);

    socket.emit('join', userId);

    socket.on('notification:new', (data) => {
        dispatch(addNotification(data));
    });

    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        console.log('Disconnecting socket...');
        socket.disconnect();
    }
};
