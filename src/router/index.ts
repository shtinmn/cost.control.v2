import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'main',
    component: () => import(/* webpackChunkName: "TheMain" */ '@/views/TheMain.vue'),
    meta: { template: 'AppTemplate' },
  },
  { path: '*', redirect: { name: 'main' } },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
