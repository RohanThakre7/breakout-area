import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    user: null,
    token: localStorage.getItem('token'),
    loading: false,
    error: null,
};

export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post('/api/auth/register', userData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const login = createAsyncThunk('auth/login', async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post('/api/auth/login', userData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('token');
        },
        setUser: (state, action) => {
            state.user = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => { state.loading = true; })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                localStorage.setItem('token', action.payload.token);
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error || 'Login failed';
            })
            .addCase(register.pending, (state) => { state.loading = true; })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                localStorage.setItem('token', action.payload.token);
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error || 'Registration failed';
            });
    },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;
