import { io } from 'socket.io-client';
import { addNotification } from '../redux/slices/notificationSlice';

let socket;

export const initiateSocket = (token, dispatch) => {
    const SERVER_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    socket = io(SERVER_URL, {
        auth: { token }
    });

    console.log('Connecting to socket...');

    socket.on('notification:new', (data) => {
        dispatch(addNotification(data));
    });

    return socket;
};

export const disconnectSocket = () => {
    console.log('Disconnecting socket...');
    if (socket) socket.disconnect();
};

export default socket;
