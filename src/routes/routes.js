import Home from "../views/Home.vue"
import Cart from "../views/CART.vue"
import Seeproduct from "../views/SEEPRODUCT.vue"
import Admin from "../views/Admin.vue"
import DRAWER_ADMIN from "../views/DRAWER_ADMIN.vue"
import {createRouter, createWebHashHistory} from "vue-router"
import PaymentGateway from "../views/paymentGateway.vue"
  
const routes = [
  { path: '/', component: Home },
  { path: '/cart', component: Cart },
  { path: '/seeproduct', component: Seeproduct }, 
  { path: '/admin', component: Admin },
  { path: '/gateway', component: PaymentGateway },
  { path: '/draweradmin', component: DRAWER_ADMIN }
]
  
export const router = createRouter({
  history: createWebHashHistory(),
  routes
})