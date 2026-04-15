import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { Button, Field, Popup, Dialog, NavBar, DatePicker } from 'vant';
import 'vant/lib/index.css';
import App from './App.vue';
import router from './router';
import { useAuthStore } from './stores/authStore';

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(router);
app.use(Button);
app.use(Field);
app.use(Popup);
app.use(Dialog);
app.use(NavBar);
app.use(DatePicker);

const authStore = useAuthStore();
authStore.initialize();

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return next('/login');
  }
  if ((to.path === '/login' || to.path === '/register') && authStore.isLoggedIn) {
    return next('/index');
  }
  next();
});

app.mount('#app');
