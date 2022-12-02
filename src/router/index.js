import { createRouter, createWebHistory } from 'vue-router'
import IndexView from '../views/indexView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: IndexView
    },
    {
      path: '/sectoroverview',
      name: 'SectorOverview',
      component: () => import('../views/SectorOverview.vue')
    },
    {
      path: '/globalmarket',
      name: 'GlobalMarket',
      component: () => import('../views/GlobalMarket.vue')
    },
    {
      path: '/about',
      name: 'About',
      component: () => import('../views/About.vue')
    },
    {
      path: '/predict',
      name: 'Predict',
      component: () => import('../views/Prediction.vue')
    }


  ]
})

export default router
