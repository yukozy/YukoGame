import { defineStore } from 'pinia';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
});

const getToday = () => new Date().toISOString().slice(0, 10);

export const useEventStore = defineStore('eventStore', {
  state: () => ({
    currentDate: getToday(),
    events: [],
    loading: false,
    error: '',
  }),
  actions: {
    async fetchEvents() {
      this.loading = true;
      this.error = '';
      try {
        const response = await api.get('/api/events', {
          params: { date: this.currentDate },
        });
        this.events = response.data.sort((a, b) => a.time.localeCompare(b.time));
      } catch (err) {
        this.error = '读取事件失败';
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    async addEvent(event) {
      try {
        const response = await api.post('/api/events', event);
        this.events.push(response.data);
        this.events.sort((a, b) => a.time.localeCompare(b.time));
      } catch (err) {
        this.error = '添加事件失败';
        console.error(err);
        throw err;
      }
    },
    async updateEvent(id, event) {
      try {
        const response = await api.put(`/api/events/${id}`, event);
        const index = this.events.findIndex((item) => item.id === id);
        if (index !== -1) {
          this.events.splice(index, 1, response.data);
          this.events.sort((a, b) => a.time.localeCompare(b.time));
        }
      } catch (err) {
        this.error = '更新事件失败';
        console.error(err);
        throw err;
      }
    },
    async deleteEvent(id) {
      try {
        await api.delete(`/api/events/${id}`);
        this.events = this.events.filter((item) => item.id !== id);
      } catch (err) {
        this.error = '删除事件失败';
        console.error(err);
        throw err;
      }
    },
    setDate(date) {
      this.currentDate = date;
    },
  },
});
