<template>
    <q-layout view="hHh lpR fFf">
        <!-- Contenedor de página -->
        <q-page-container class="theContainer">

            <div class="titleOne">
                <img class="Imagen" src="../assets/MiniLogo.jpeg" alt="">
                <label class="Title">TU CARRITO</label><br>
                <label class="Text">Los artículos de tu carrito no están reservados. Completa tu compra para hacerte
                    con
                    ellos.</label>


            </div>
            <div class="containerMedium">

                <div class="viewProduct">
                    <div class="boxTwo">
                        <div class="cart-summary q-pa-md">
                            <h2>Resumen de compra</h2>
                            <q-separator class="q-my-md" />
                            <div class="flex justify-between">
                                <span>Subtotal ({{ getTotalItems() }} artículos):</span>
                                <span>{{ calculateTotalCart() }}</span>
                            </div>
                            <q-separator class="q-my-md" />
                            <div class="flex justify-between">
                                <span>Envío:</span>
                                <span>Gratis</span>
                            </div>
                            <q-separator class="q-my-md" />
                            <div class="flex justify-between text-weight-bold">
                                <span>Total:</span>
                                <span>{{ calculateTotalCart() }}</span>
                            </div>

                            <button label="Proceder al pago" class="pay-btn" :disable="cart.length === 0" @click=pago()>
                                <span class="btn-text">Proceder al pago</span>
                                <div class="icon-container">
                                    <svg viewBox="0 0 24 24" class="icon card-icon">
                                        <path
                                            d="M20,8H4V6H20M20,18H4V12H20M20,4H4C2.89,4 2,4.89 2,6V18C2,19.11 2.89,20 4,20H20C21.11,20 22,19.11 22,18V6C22,4.89 21.11,4 20,4Z"
                                            fill="currentColor"></path>
                                    </svg>
                                    <svg viewBox="0 0 24 24" class="icon payment-icon">
                                        <path
                                            d="M2,17H22V21H2V17M6.25,7H9V6H6V3H18V6H15V7H17.75L19,17H5L6.25,7M9,10H15V8H9V10M9,13H15V11H9V13Z"
                                            fill="currentColor"></path>
                                    </svg>
                                    <svg viewBox="0 0 24 24" class="icon dollar-icon">
                                        <path
                                            d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"
                                            fill="currentColor"></path>
                                    </svg>

                                    <svg viewBox="0 0 24 24" class="icon wallet-icon default-icon">
                                        <path
                                            d="M21,18V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5A2,2 0 0,1 5,3H19A2,2 0 0,1 21,5V6H12C10.89,6 10,6.9 10,8V16A2,2 0 0,0 12,18M12,16H22V8H12M16,13.5A1.5,1.5 0 0,1 14.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,12A1.5,1.5 0 0,1 16,13.5Z"
                                            fill="currentColor"></path>
                                    </svg>

                                    <svg viewBox="0 0 24 24" class="icon check-icon">
                                        <path d="M9,16.17L4.83,12L3.41,13.41L9,19L21,7L19.59,5.59L9,16.17Z"
                                            fill="currentColor"></path>
                                    </svg>
                                </div>
                            </button>

                        </div>
                    </div>
                    <div style="height: 500px; overflow-y: auto;">
                        <q-infinite-scroll @load="onLoad" :offset="250">
                            <div class="boxOne">
                                <div class="tarjeta" v-for="(product, index) in cart" :key="index">
                                    <div class="producto">
                                        <img class="imgproduct"
                                            :src="product.images[0].urlImage || '/api/placeholder/300/200'"
                                            alt="producto" />
                                        <div class="information">
                                            <label class="nameProduct">{{ product.name }}</label><br /><br />
                                            <q-select class="q-mb-md" v-model="product.quantity" :options="cantidades"
                                                label="Cantidad"
                                                @update:model-value="calculateTotalProduct(product.price, product.quantity, index)"></q-select>
                                            <label class="colorProduct"><b>Color:</b> {{ product.color || "ninguno"
                                            }}</label><br /><br />
                                            <label class="precioProduct"><b>Precio:</b> {{
                                                formatPrice(calculateTotalProduct(product.price, product.quantity,
                                                    index)) }}</label>
                                            <br /><br />
                                            <button class="remove-btn" @click="removeFromCart(index)">
                                                <span class="btn-label">Delete</span>
                                                <span class="btn-icon">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                        viewBox="0 0 24 24">
                                                        <path
                                                            d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z">
                                                        </path>
                                                    </svg>
                                                </span>
                                            </button>

                                        </div>
                                    </div>
                                </div>

                                <div v-if="cart.length === 0" class="empty-cart q-pa-md text-center">
                                    <q-icon name="shopping_cart" size="3rem" color="grey" />
                                    <p>Tu carrito está vacío</p>
                                    <q-btn color="primary" label="Ver productos" to="/" />
                                </div>
                            </div>
                        </q-infinite-scroll>
                    </div>

                </div>
            </div>
        </q-page-container>

    </q-layout>
</template>

<script setup>
import { ref, toRaw, } from 'vue'
import { useStore } from '../stores/store'
import { Notify } from 'quasar';
import { router } from '../routes/routes.js';
const store = useStore()

const cart = ref(store.cart.items)


// Array de productos (ejemplo)

const cantidades = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const search = ref('')
const rightDrawerOpen = ref(false)




// Función para formatear precio
const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(price)
}

// Función para obtener el total de items (considerando cantidades)
const getTotalItems = () => {
    console.log("datos del carrito", toRaw(cart.value));
    return cart.value.reduce((sum, item) => sum + item.quantity, 0)
}

async function pago() {
    router.push('/gateway')
}


// Función para calcular el total
const calculateTotalCart = () => {
    const total = cart.value.reduce((sum, item) => sum + item.total, 0)
    store.cart.total = total
    return formatPrice(total)
}

const calculateTotalProduct = (price, quantity, index) => {
    const validQuantity = quantity > 0 ? quantity : 1

    cart.value[index].quantity = validQuantity

    const total = price * validQuantity
    cart.value[index].total = total

    return total
}


// Función para eliminar del carrito
const removeFromCart = (index) => {
    cart.value.splice(index, 1)
    Notify.create({
        type: "negative",
        message: "Producto eliminado del carrito"
    })
}

// Función para el infinite-scroll (si la implementas)
const onLoad = (index, done) => {
    // Implementar si se necesita cargar más productos dinámicamente
    done()
}
</script>

<style scoped>
@import url('../style/CART.css');
</style>