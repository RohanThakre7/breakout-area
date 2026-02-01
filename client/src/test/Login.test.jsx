import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/slices/authSlice';
import Login from '../pages/Login';
import { expect, test } from 'vitest';

const store = configureStore({
    reducer: {
        auth: authReducer,
    },
});

test('renders login heading', () => {
    render(
        <Provider store={store}>
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        </Provider>
    );
    const headingElement = screen.getByText(/Login to Breakout Area/i);
    expect(headingElement).toBeInTheDocument();
});
