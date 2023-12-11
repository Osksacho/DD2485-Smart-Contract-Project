import { createRouter, createWebHistory } from 'vue-router'
import Browser from '../components/BrowserPresenter.jsx'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name: 'Home',
      path: '/',
      component:  Browser
    },
  ]
})

export default router