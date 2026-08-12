import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth: prefer httpOnly cookies issued by the backend, and set
// `withCredentials: true` above. Do not read tokens from localStorage —
// see .ai/global/rules/40-frontend-security.md.

export default api;
