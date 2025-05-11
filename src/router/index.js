import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import Voting from '@/views/Voting.vue';
import Results from '@/views/Results.vue';
import ResultsCountry from '@/views/CountryResults.vue';
import Players from '@/views/Players.vue';
import { useUserStore } from '@/store/user';

const routes = [
  { path: '/', component: Home },
  { 
    path: '/vote', 
    component: Voting,
    beforeEnter: (to, from, next) => {
      const userStore = useUserStore();
      if (userStore.pseudo) {
        next();
      } else {
        next('/');
      }
    }
  },
  {
    path: '/results/:country',
    component: ResultsCountry,
    beforeEnter: (to, from, next) => {
      const userStore = useUserStore();
      if (userStore.pseudo) {
        next();
      } else {
        next('/');
      }
    }
  },
  { 
    path: '/results', 
    component: Results,
    beforeEnter: (to, from, next) => {
      const userStore = useUserStore();
      if (userStore.pseudo) {
        next();
      } else {
        next('/');
      }
    }
  },
  { 
    path: '/players', 
    component: Players,
    beforeEnter: (to, from, next) => {
      const userStore = useUserStore();
      if (userStore.pseudo) {
        next();
      } else {
        next('/');
      }
    }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
