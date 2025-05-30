import Home from "../views/Home.vue"
import Cart from "../views/CART.vue"
import Seeproduct from "../views/SEEPRODUCT.vue"
import Admin from "../views/Admin.vue"
import AdminCategory from "../views/AdminCategory.vue"
import AdminUsers from "../views/AdminUsers.vue"
import invoice from "../components/invoice.vue"
import AdminSales from "../views/AdminSales.vue"
import {createRouter, createWebHashHistory} from "vue-router"
import PaymentGateway from "../views/paymentGateway.vue"
import Search from "../views/Search.vue"
  
const routes = [
  { path: '/', component: Home },
  { path: '/cart', component: Cart },
  { path: '/seeproduct', component: Seeproduct }, 
  { path: '/admin', component: Admin },
  { path: '/admincategories', component: AdminCategory},
  { path: '/adminusers', component: AdminUsers},
  { path: '/adminsales', component: AdminSales},
  { path: '/gateway', component: PaymentGateway },
  { path: '/search', component: Search },
  { path:'/invoice' , component:invoice}
]
  
export const router = createRouter({
  history: createWebHashHistory(),
  routes
})