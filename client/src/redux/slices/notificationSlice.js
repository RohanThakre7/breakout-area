import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    notifications: [],
    unreadCount: 0,
    loading: false,
};

export const fetchNotifications = createAsyncThunk('notifications/fetch', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get('/api/notifications');
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        addNotification: (state, action) => {
            state.notifications.unshift(action.payload);
            state.unreadCount += 1;
        },
        markRead: (state) => {
            state.unreadCount = 0;
            state.notifications = state.notifications.map(n => ({ ...n, read: true }));
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.notifications = action.payload;
                state.unreadCount = action.payload.filter(n => !n.read).length;
            });
    },
});

export const { addNotification, markRead } = notificationSlice.actions;
export default notificationSlice.reducer;
