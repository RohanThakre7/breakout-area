import axios from 'axios';

const setupAxios = (store) => {
    axios.interceptors.request.use(
        (config) => {
            const { token } = store.getState().auth;
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    axios.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                // Option to logout user or refresh token
            }
            return Promise.reject(error);
        }
    );
};

export default setupAxios;
