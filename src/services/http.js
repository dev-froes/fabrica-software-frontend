import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export const http = axios.create({
    baseURL: API_URL,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});