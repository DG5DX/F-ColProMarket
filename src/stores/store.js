import { defineStore } from "pinia";
import { ref } from "vue";
import { jwtDecode } from "jwt-decode";

export const useStore = defineStore ("store",()=>{
let userId = ref("");
const token = ref("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2ODE2NjJkZTVkNWM4ZTk2ZWU5YTcxZDEiLCJpYXQiOjE3NDY3MDU4MjUsImV4cCI6MTc0NjczNDYyNX0.8kLQ9yY_tzIFSRPA0zRbvqUBxbcGMpdS1bpqIP4TpX8");
const cart = ref([]);

    function save_Token (Token){
        if(token){
           /*  token.value= Token */
            const decoded = jwtDecode(token.value); //cambiar luego esto por token de parametro
            userId.value = decoded.userID
            console.log("user id" , userId.value);
        }
        else{
            console.log("no-token");
        }
    }

    save_Token()


    function addToCart (product){
        cart.value.push(product)
        console.log("carrito en tienda" , cart.value);
    }


    return{
        token,
        userId,
        save_Token,
        addToCart,
        cart

    }

},{
    persist:{
        paths: ["token", "cart"]
    }
})

