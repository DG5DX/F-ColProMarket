import { defineStore } from "pinia";
import { ref } from "vue";
import { jwtDecode } from "jwt-decode";
import { showNotification, showNotification2 } from "../utils/utils";
import { getData } from "../service/service";

export const useStore = defineStore ("store",()=>{
let userId = ref("");
let userInformation = ref(false)
const showLoginDialog = ref(false)
const showRegisterDialog = ref(false)
const token = ref("");
const showRegister = ref(true)
const cart = ref({
    items:[],
    total:0
});
const favorites =ref([])

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
        const existingProduct = cart.value.items.some(element => element._id === product._id)
        if(existingProduct){
            return showNotification2(
                'Confirmacion producto',
                'Ya has agregado este producto , Desead agregarlo nuevamente?',
                'warning',
                ()=>{
                    const index = cart.value.items.findIndex((element,index)=> element._id === product._id)
                    return cart.value.items[index].quantity += 1
                }
            )
        }
        product.quantity = 1
        cart.value.items.push(product)
        return showNotification('positive','Producto agregado')
    }


    async function dataFavorites(userId) {
        try {
            const response = await getData(`/favorites/list/${userId}`)
            favorites.value = response.data
            console.log("favoritos", favorites.value)
        } catch (error) {
            showNotification("negative","Error al traer favoritos")
            console.log("error cargando favoritos", error)
        }
        
    }


    return{
        token,
        userId,
        userInformation,
        showLoginDialog,
        showRegisterDialog,
        showRegister,
        dataFavorites,
        save_Token,
        addToCart,
        cart

    }

},{
    persist:{
        paths: ["token", "cart"]
    }
})

