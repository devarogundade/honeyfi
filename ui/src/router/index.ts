import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'swap',
      component: HomeView
    },
    {
      path: '/pools',
      name: 'pools',
      component: () => import('@/views/PoolsView.vue')
    },
    {
      path: '/hive',
      name: 'hive',
      component: () => import('@/views/HiveView.vue')
    }
  ]
});

export default router;
