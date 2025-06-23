import Home from "../views/Home.vue"
import Cart from "../views/CART.vue"
import Seeproduct from "../views/SEEPRODUCT.vue"
import Admin from "../views/Admin.vue"
import AdminCategory from "../views/AdminCategory.vue"
import AdminUsers from "../views/AdminUsers.vue"
import AdminInventory from "../views/AdminInventory.vue"
import userProfile from "../views/userProfile.vue"
import Contact from "../views/Contact.vue"
import changePassword from "../components/changePassword.vue"
import AdminSales from "../views/AdminSales.vue"
import PaymentGateway from "../views/paymentGateway.vue"
import Search from "../views/Search.vue"
import Favorite from "../views/FAVORITE.vue"
import sales from "../views/sales.vue"
import morecategories from "../views/morecategories.vue"
import {createRouter, createWebHashHistory} from "vue-router"

const routes = [
  { path: '/', component: Home },
  { path: '/cart', component: Cart },
  { path: '/seeproduct', component: Seeproduct }, 
  { path: '/admin', component: Admin },
  { path: '/admincategories', component: AdminCategory},
  { path: '/adminusers', component: AdminUsers},
  { path: '/adminsales', component: AdminSales},
  { path: '/admininventory', component: AdminInventory},
  { path: '/gateway', component: PaymentGateway },
  { path: '/search', component: Search },
  { path: '/sales', component: sales },
  { path:'/contact', component: Contact},
  { path:'/favorite',component: Favorite},
  { path:'/morecategories', component: morecategories},
  {path:'/userProfile', component:userProfile},
  {path:'/contact', component: Contact},
  {path:'/password', component: changePassword},
]
  
export const router = createRouter({
  history: createWebHashHistory(),
  routes
})