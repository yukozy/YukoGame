import { defineStore } from 'pinia';
import api, { setAuthToken } from '../api';

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    token: null,
    user: null,
    loading: false,
    error: '',
  }),
  getters: {
    isLoggedIn: (state) => !!state.token,
  },
  actions: {
    initialize() {
      const token = localStorage.getItem('timeline_token');
      const rawUser = localStorage.getItem('timeline_user');
      if (token) {
        this.token = token;
        setAuthToken(token);
      }
      if (rawUser) {
        try {
          this.user = JSON.parse(rawUser);
        } catch (err) {
          this.user = null;
        }
      }
    },
    setSession(token, user) {
      this.token = token;
      this.user = user;
      localStorage.setItem('timeline_token', token);
      localStorage.setItem('timeline_user', JSON.stringify(user));
      setAuthToken(token);
    },
    async login({ username, password }) {
      this.loading = true;
      this.error = '';
      try {
        const response = await api.post('/api/auth/login', { username, password });
        this.setSession(response.data.token, response.data.user);
      } catch (err) {
        this.error = err.response?.data?.error || '登录失败';
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async register({ username, password }) {
      this.loading = true;
      this.error = '';
      try {
        const response = await api.post('/api/auth/register', { username, password });
        this.setSession(response.data.token, response.data.user);
      } catch (err) {
        this.error = err.response?.data?.error || '注册失败';
        throw err;
      } finally {
        this.loading = false;
      }
    },
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('timeline_token');
      localStorage.removeItem('timeline_user');
      setAuthToken(null);
    },
  },
});
