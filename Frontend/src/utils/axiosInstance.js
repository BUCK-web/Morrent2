import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: 'https://morrent2.onrender.com/api',
    withCredentials: true
});

