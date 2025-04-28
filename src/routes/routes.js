import Home from "../views/Home.vue"
import {createRouter, createWebHashHistory} from "vue-router"
  
  const routes = [
    { path: '/', component: Home },
  ]
  
  export const router = createRouter({
    history: createWebHashHistory(),
    routes
  })