<template>
    <q-layout view="hHh lpR fFf">
        <!-- Contenedor de página -->
        <q-page-container class="theContainer">
            <div class="containerMedium">
                <div class="titleOne">
                    <label class="Title">TU CARRITO</label><br>
                    <label class="Text">Los artículos de tu carrito no están reservados. Completa tu compra para hacerte
                        con
                        ellos.</label>
                </div>
                <div class="viewProduct">
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
                                                index))}}</label>
                                            <br /><br />
                                            <q-btn color="negative" dense flat icon="delete" label="Eliminar"
                                                @click="removeFromCart(index)" />
                                        </div>
                                    </div>
                                </div>

                                <div v-if="cart.length === 0" class="empty-cart q-pa-md text-center">
                                    <q-icon name="shopping_cart" size="3rem" color="grey" />
                                    <p>Tu carrito está vacío</p>
                                    <q-btn color="primary" label="Ver productos" to="/productos" />
                                </div>
                            </div>
                        </q-infinite-scroll>
                    </div>
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
                            <q-btn color="yellow-8" text-color="black" class="full-width q-mt-lg"
                                label="Proceder al pago" :disable="cart.length === 0" @click=pago() />
                        </div>
                    </div>
                </div>
            </div>
        </q-page-container>

    </q-layout>
</template>

<script setup>
import { ref, toRaw } from 'vue'
import { useStore } from '../stores/store'
const store = useStore()

const cart = ref(store.cart)

// Array de productos (ejemplo)

const cantidades = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const search = ref('')
const rightDrawerOpen = ref(false)



async function pago() {
    window.location.href = 'http://localhost:5173/#/gateway';
}

// Función para formatear precio
const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(price)
}

// Función para obtener el total de items (considerando cantidades)
const getTotalItems = () => {
    console.log("datos del carrito", cart.value);
    return cart.value.reduce((sum, item) => sum + item.quantity, 0)
}


// Función para calcular el total
const calculateTotalCart = () => {
    const total = cart.value.reduce((sum, item) => sum + item.total, 0)
    cart.value.total = total
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