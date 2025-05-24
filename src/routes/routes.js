import Home from "../views/Home.vue"
import Cart from "../views/CART.vue"
import Seeproduct from "../views/SEEPRODUCT.vue"
import Admin from "../views/Admin.vue"
import {createRouter, createWebHashHistory} from "vue-router"
import PaymentGateway from "../views/paymentGateway.vue"
import Search from "../views/Search.vue"
  
const routes = [
  { path: '/', component: Home },
  { path: '/cart', component: Cart },
  { path: '/seeproduct', component: Seeproduct }, 
  { path: '/admin', component: Admin },
  { path: '/gateway', component: PaymentGateway },
  { path: '/search', component: Search },
]
  
export const router = createRouter({
  history: createWebHashHistory(),
  routes
})