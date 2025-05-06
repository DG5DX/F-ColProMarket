import Home from "../views/Home.vue"
import Cart from "../views/CART.vue"
import Seeproduct from "../views/SEEPRODUCT.vue"
import Admin from "../views/Admin.vue"
import DRAWER from "../views/DRAWER.vue"
import {createRouter, createWebHashHistory} from "vue-router"
import PaymentGateway from "../views/paymentGateway.vue"
  
const routes = [
  { path: '/', component: Home },
  { path: '/cart', component: Cart },
  { path: '/seeproduct', component: Seeproduct}, 
  { path: '/admin', component: Admin},
  { path: '/gateway', component: PaymentGateway},
  { path: '/drawer', component: DRAWER}
]
  
export const router = createRouter({
  history: createWebHashHistory(),
  routes
})