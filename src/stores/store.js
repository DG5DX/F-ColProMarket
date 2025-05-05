import { defineStore } from "pinia";
import { ref } from "vue";

export const useStore = defineStore ("store",()=>{

const token = ref("dsda");

    function set_Token (Token){
        if(token){
            token.value= Token
        }
        else{
            console.log("no-token");
        }
    }


    return{
        token,
        set_Token
    }

},{
    persist:true
})

