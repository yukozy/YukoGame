import { createRouter, createWebHistory } from 'vue-router';
import IndexPage from '../views/IndexPage.vue';
import LoginPage from '../views/LoginPage.vue';
import RegisterPage from '../views/RegisterPage.vue';
import WeeklyPlanPage from '../views/WeeklyPlanPage.vue';

const routes = [
  {
    path: '/',
    redirect: '/index',
  },
  {
    path: '/login',
    name: 'LoginPage',
    component: LoginPage,
  },
  {
    path: '/register',
    name: 'RegisterPage',
    component: RegisterPage,
  },
  {
    path: '/index',
    name: 'IndexPage',
    component: IndexPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/weekly',
    name: 'WeeklyPlanPage',
    component: WeeklyPlanPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/index',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
