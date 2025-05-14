import { defineStore } from "pinia";
import { ref } from "vue";
import { jwtDecode } from "jwt-decode";

export const useStore = defineStore ("store",()=>{
let userId = ref("");
const token = ref("");
const cart = ref([]);

    function save_Token (Token){
        if(token){
            const decoded = jwtDecode(Token); //cambiar luego esto por token de parametro
            userId.value = decoded.userID
            token.value = Token
            console.log("user id" , userId.value);
        }
        else{
            console.log("no-token");
        }
    }



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

