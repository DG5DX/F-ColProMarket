import Home from "../views/Home.vue"
import Cart from "../views/CART.vue"
import Seeproduct from "../views/SEEPRODUCT.vue"
import Admin from "../views/Admin.vue"
import AdminCategory from "../views/AdminCategory.vue"
import AdminUsers from "../views/AdminUsers.vue"
import userProfile from "../views/userProfile.vue"
import invoice from "../components/invoice.vue"
import Contact from "../views/Contact.vue"
import changePassword from "../components/changePassword.vue"
import AdminSales from "../views/AdminSales.vue"
import PaymentGateway from "../views/paymentGateway.vue"
import Search from "../views/Search.vue"
<<<<<<< HEAD
<<<<<<< HEAD
import Favorite from "../views/FAVORITE.vue"
=======
>>>>>>> c042dd3f9d7efe3c764363ade644f64570d5a6b2
=======
import Favorite from "../views/FAVORITE.vue"
>>>>>>> a2463129871a000cfd6ed93abdecb13753946d0f
import sales from "../views/sales.vue"
import movements from "../views/movements.vue"
import {createRouter, createWebHashHistory} from "vue-router"

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
  { path: '/sales', component: sales },
  { path:'/invoice' , component:invoice},
  { path:'/contact', component: Contact},
  { path:'/favorite',component: Favorite},
  {path:'/userProfile', component:userProfile},
<<<<<<< HEAD
<<<<<<< HEAD
=======
  {path:'/contact', component: Contact},
>>>>>>> c042dd3f9d7efe3c764363ade644f64570d5a6b2
  {path:'/password', component: changePassword},
  {path:'/movements', component: movements},

=======
  {path:'/password', component: changePassword},
  {path:'/movements', component: movements},
>>>>>>> a2463129871a000cfd6ed93abdecb13753946d0f
]
  
export const router = createRouter({
  history: createWebHashHistory(),
  routes
})