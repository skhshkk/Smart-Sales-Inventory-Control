import axios from 'axios';
import { supabase } from '@/context/AuthContext';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Env var ideally
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add Supabase token
api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
