import { defineStore } from "pinia";
import { ref } from "vue";

export const useStore = defineStore ("store",()=>{

const token = ref("dsda");
const cart = ref([]);

    function set_Token (Token){
        if(token){
            token.value= Token
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
        set_Token,
        addToCart,
        cart

    }

},{
    persist:true
})

