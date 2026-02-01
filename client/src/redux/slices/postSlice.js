import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    posts: [],
    loading: false,
    error: null,
};

export const fetchFeed = createAsyncThunk('posts/fetchFeed', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get('/api/posts/feed');
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const createPost = createAsyncThunk('posts/createPost', async (postData, { rejectWithValue }) => {
    try {
        const response = await axios.post('/api/posts', postData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

const postSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        addPost: (state, action) => {
            state.posts.unshift(action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFeed.pending, (state) => { state.loading = true; })
            .addCase(fetchFeed.fulfilled, (state, action) => {
                state.loading = false;
                state.posts = action.payload;
            })
            .addCase(fetchFeed.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createPost.fulfilled, (state, action) => {
                state.posts.unshift(action.payload);
            });
    },
});

export const { addPost } = postSlice.actions;
export default postSlice.reducer;
