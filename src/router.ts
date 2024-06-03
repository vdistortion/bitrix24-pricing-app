import { createRouter, createWebHashHistory } from 'vue-router';
import HomePage from './views/HomePage.vue';

export default createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home-page',
      component: HomePage,
    },
    {
      path: '/offer-page',
      name: 'offer-page',
      component: () => import('./views/OfferPage.vue'),
    },
    {
      path: '/tasks-page',
      name: 'tasks-page',
      component: () => import('./views/TasksPage.vue'),
    },
    {
      path: '/placement-page',
      name: 'placement-page',
      component: () => import('./views/PlacementPage.vue'),
    },
  ],
});
