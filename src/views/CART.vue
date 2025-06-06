<template>
    <q-layout view="hHh lpR fFf" class="bg-global">
        <mainBar @open-register-dialog="registerDialog = true" @open-logIn-dialog="loginDialog = true" />

        <q-page-container class="no-padding">
            <q-page class="full-width full-height">
                <!-- Hero Section del Carrito -->
                <div class="cart-hero q-pa-xl text-center" :style="{ background: 'var(--five-color--)' }">
                    <div class="hero-content">
                        <q-avatar size="100px" class="hero-logo">
                            <img src="../assets/MiniLogo.jpeg" alt="Logo" />
                        </q-avatar>
                        <h1 class="hero-title">TU CARRITO DE COMPRAS</h1>
                        <p class="hero-subtitle">
                            Revisa y gestiona los productos que estás por adquirir.
                            <span class="highlight-text" style="">¡No pierdas tus artículos favoritos!</span>
                        </p>
                        <q-badge class="hero-badge" color="var(--cambio--)">
                            {{ cart.length }} {{ cart.length === 1 ? 'artículo' : 'artículos' }}
                        </q-badge>
                    </div>
                </div>

                <!-- Contenido Principal -->
                <div class="cart-main-container">
                    <!-- Sección de Productos -->
                    <div class="cart-products-section">
                        <!-- Breadcrumbs -->
                        <q-breadcrumbs class="q-px-lg q-pt-lg" active-color="var(--seven-color--)">
                            <q-breadcrumbs-el label="Inicio" icon="home" to="/" />
                            <q-breadcrumbs-el label="Carrito" icon="shopping_cart" />
                        </q-breadcrumbs>

                        <!-- Encabezado de Productos -->
                        <div class="products-header q-px-lg q-pt-md">
                            <h2 class="section-title">Tus Productos Seleccionados</h2>
                            <q-btn v-if="cart.length > 0" flat color="negative" icon="delete" label="Vaciar carrito"
                                @click="confirmClearCart" class="clear-cart-btn" />
                        </div>

                        <!-- Lista de Productos -->
                        <div class="products-list-container">
                            <transition-group name="list" tag="div">
                                <q-card v-for="(product, index) in cart" :key="product.id + index"
                                    class="product-card animated-card"
                                    :style="{ borderLeft: `4px solid ${index % 2 === 0 ? 'var(--four-color--)' : 'var(--six-color--)'}` }">
                                    <div class="product-card-content">
                                        <!-- Columna de Imagen -->
                                        <div  class="product-image-col">
                                            <q-img @click="sendProduct(product)"  :src="product.images[0].urlImage || '/api/placeholder/300/200'"
                                                :ratio="1" class="product-image" spinner-color="var(--seven-color--)">
                                                <q-badge v-if="product.discount" floating color="negative"
                                                    class="discount-badge">
                                                    -{{ product.discount }}%
                                                </q-badge>
                                            </q-img>
                                        </div>

                                        <!-- Columna de Información -->
                                        <div class="product-info-col">
                                            <div class="product-info">
                                                <h3 class="product-name">{{ product.name }}</h3>
                                                <div class="product-meta">
                                                    <q-chip v-if="product.color" square
                                                        :color="product.color.toLowerCase()" text-color="white"
                                                        class="color-chip">
                                                        {{ product.color }}
                                                    </q-chip>
                                                    <q-chip v-if="product.size" square color="var(--two-color--)"
                                                        text-color="var(--text-primary)">
                                                        Talla: {{ product.size }}
                                                    </q-chip>
                                                </div>

                                                <div class="product-description" v-if="product.description">
                                                    {{ truncateDescription(product.description) }}
                                                </div>

                                                <div class="product-price">
                                                    <span class="current-price">
                                                        {{ formatPrice(calculateTotalProduct(product.price,
                                                            product.quantity, index)) }}
                                                    </span>
                                                    <span v-if="product.originalPrice" class="original-price">
                                                        {{ formatPrice(product.originalPrice * product.quantity) }}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Columna de Controles -->
                                        <div class="product-controls-col">
                                            <div class="product-controls">
                                                <q-input v-model="product.quantity" label="Cantidad" dense outlined
                                                    class="quantity-select"
                                                    @update:model-value="calculateTotalProduct(product.price, product.quantity, index)"
                                                    :style="{ borderColor: 'var(--four-color--)' }" />

                                                <div class="product-actions">
                                                    <q-btn round flat color="var(--seven-color--)"
                                                        icon="favorite_border" @click="addToWishlist(product)"
                                                        class="action-btn" />
                                                    <q-btn round color="negative" icon="delete"
                                                        @click="removeFromCart(index)" class="action-btn" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </q-card>
                            </transition-group>

                            <!-- Carrito Vacío -->
                            <div v-if="cart.length === 0" class="empty-cart-container">
                                <q-card class="empty-cart-card">
                                    <q-icon name="shopping_cart" size="4rem" color="var(--text-secondary)" />
                                    <h3 class="empty-cart-title">Tu carrito está vacío</h3>
                                    <p class="empty-cart-message">
                                        Parece que no has añadido ningún producto aún.
                                        <span class="highlight-text">¡Descubre nuestras ofertas especiales!</span>
                                    </p>
                                    <q-btn color="var(--fiv-color--)" label="Explorar productos" to="/" no-caps
                                        class="explore-btn" icon-right="arrow_forward" />
                                </q-card>
                            </div>
                        </div>
                    </div>

                    <!-- Sección de Resumen -->
                    <div class="cart-summary-section">
                        <q-card class="summary-card" :style="{ background: 'var(--one-color--)' }">
                            <q-card-section>
                                <h2 class="summary-title">Resumen de tu Compra</h2>



                                <q-separator class="summary-separator" />

                                <!-- Resumen de Productos -->
                                <div class="products-summary">
                                    <div v-for="(product, index) in cart.slice(0, 3)" :key="'summary-' + index"
                                        class="product-summary-item">
                                        <div class="product-summary-image">
                                            <q-img :src="product.images[0].urlImage || '/api/placeholder/300/200'"
                                                :ratio="1" width="60px" spinner-color="var(--seven-color--)" />
                                        </div>
                                        <div class="product-summary-info">
                                            <div class="product-summary-name">{{ product.name }}</div>
                                            <div class="product-summary-meta">
                                                <span>{{ product.quantity }} x {{ formatPrice(product.price) }}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div v-if="cart.length > 3" class="more-items-text">
                                        +{{ cart.length - 3 }} más artículos...
                                    </div>
                                </div>

                                <q-separator class="summary-separator" />

                                <!-- Totales -->
                                <div class="totals-container">
                                    <div class="total-row">
                                        <span>Subtotal ({{ getTotalItems() }} artículos)</span>
                                        <span>{{ calculateTotalCart() }}</span>
                                    </div>
                                    <div class="total-row">
                                        <span>Envío</span>
                                        <span>Gratis</span>
                                    </div>
                                    <div class="total-row">
                                        <span>Descuentos</span>
                                        <span>{{ formatPrice(calculateDiscounts()) }}</span>
                                    </div>
                                    <q-separator class="summary-separator" />
                                    <div class="total-row grand-total">
                                        <span>Total</span>
                                        <span>{{ formatPrice(calculateGrandTotal()) }}</span>
                                    </div>
                                </div>


                                <!-- Botón de Pago -->
                                <div class="payment-actions">
                                    <q-btn label="Proceder al pago" style="color: var(--seven-color--);"
                                        class="payment-btn" :disable="cart.length === 0" @click="pago" no-caps>
                                        <q-icon name="arrow_forward" class="q-ml-sm" />
                                    </q-btn>

                                    <div class="payment-methods">
                                        <q-icon name="credit_card" size="sm" color="var(--text-secondary)" />
                                        <q-icon name="paypal" size="sm" color="var(--text-secondary)" />
                                        <q-icon name="account_balance" size="sm" color="var(--text-secondary)" />
                                    </div>

                                    <div class="security-badge">
                                        <q-icon name="lock" size="sm" color="positive" />
                                        <span>Compra segura - Protección de datos</span>
                                    </div>
                                </div>
                            </q-card-section>
                        </q-card>

  
                    </div>
                </div>
            </q-page>
        </q-page-container>
    </q-layout>
</template>

<script setup>
import mainBar from '../components/mainBar.vue';
import { ref, toRaw } from 'vue'
import { useStore } from '../stores/store'
import { Notify, Dialog } from 'quasar';
import { router } from '../routes/routes.js';
import { reloadPage } from '../utils/utils.js';

const store = useStore()
const cart = ref(store.cart.items)
const cantidades = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const couponCode = ref('')
const appliedCoupon = ref(null)

// Función para formatear precio
const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(price)
}

// Función para obtener el total de items
const getTotalItems = () => {
    const countProducts = cart.value.reduce((sum, item) => {
        return sum + Number(item.quantity);
    }, 0);

    console.log("count", countProducts);
    return countProducts;
};

// Función para calcular el total del carrito
const calculateTotalCart = () => {
    const subtotal = cart.value.reduce((sum, item) => sum + item.total, 0)
    store.cart.total = subtotal
    return formatPrice(subtotal)
}

// Calcular total por producto
const calculateTotalProduct = (price, quantity, index) => {
    const validQuantity = quantity > 0 ? quantity : 1
    const total = price * validQuantity
    cart.value[index].total = total
    return total
}

// Calcular descuentos
const calculateDiscounts = () => {
    return cart.value.reduce((sum, item) => {
        if (item.originalPrice) {
            return sum + ((item.originalPrice - item.price) * item.quantity)
        }
        return sum
    }, 0)
}

// Calcular total con descuentos
const calculateGrandTotal = () => {
    const subtotal = cart.value.reduce((sum, item) => sum + item.total, 0)
    const discount = appliedCoupon.value ? subtotal * (appliedCoupon.value.discount / 100) : 0
    return subtotal - discount
}

// Aplicar cupón
const applyCoupon = () => {
    if (couponCode.value === 'PRIMERACOMPRA') {
        appliedCoupon.value = { code: couponCode.value, discount: 10 }
        Notify.create({
            type: "positive",
            message: "¡Cupón aplicado correctamente!",
            position: 'top-right'
        })
    } else {
        Notify.create({
            type: "negative",
            message: "Cupón no válido",
            position: 'top-right'
        })
    }
}

// Eliminar producto del carrito
const removeFromCart = (index) => {
    cart.value.splice(index, 1)
    Notify.create({
        type: "negative",
        message: "Producto eliminado del carrito",
        position: 'top-right'
    })
}

// Vaciar carrito
const confirmClearCart = () => {
    Dialog.create({
        title: 'Vaciar carrito',
        message: '¿Estás seguro de que quieres eliminar todos los productos de tu carrito?',
        cancel: true,
        persistent: true,
        color: 'negative'
    }).onOk(() => {
        store.cart.items = []
        reloadPage()
        Notify.create({
            type: "negative",
            message: "Carrito vaciado",
            position: 'top-right'
        })
    })
}

// Añadir a lista de deseos
const addToWishlist = (product) => {
    Notify.create({
        type: "info",
        message: `${product.name} añadido a tu lista de deseos`,
        position: 'top-right'
    })
}

function sendProduct (product){
      router.push({
    path:"/seeproduct", query:{data:JSON.stringify(product)}
  });
}


// Acortar descripción
const truncateDescription = (text) => {
    return text.length > 100 ? text.substring(0, 100) + '...' : text
}

// Proceder al pago
async function pago() {
    if (cart.value.length === 0) {
        Notify.create({
            type: "warning",
            message: "Tu carrito está vacío",
            position: 'top-right'
        })
        return;
    }
    window.location.href = 'http://localhost:5173/#/gateway';
}
</script>

<style scoped>
/* Estilos Globales Personalizados */
.bg-global {
    background-color: var(--three-color--);
}

.highlight-text {
    color: var(--seven-color--);
    font-weight: bold;
}

/* Hero Section */
.cart-hero {
    color: white;
    padding: 4rem 1rem;
    position: relative;
    overflow: hidden;
}

.hero-content {
    max-width: 800px;
    margin: 0 auto;
    position: relative;
    z-index: 2;
}

.hero-title {
    font-size: 2.5rem;
    margin: 1rem 0 0.5rem;
    font-weight: 700;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.hero-subtitle {
    font-size: 1.2rem;
    opacity: 0.9;
    margin-bottom: 1.5rem;
}

.hero-badge {
    font-size: 1rem;
    padding: 0.5rem 1rem;
    border-radius: 20px;
}

.hero-logo {
    border: 3px solid white;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

/* Contenedor Principal */
.cart-main-container {
    display: grid;
    grid-template-columns: 1.5fr 1fr;
    gap: 2rem;
    max-width: 1400px;
    margin: -3rem auto 2rem;
    padding: 0 1rem;
    position: relative;
    z-index: 3;
}

/* Sección de Productos */
.cart-products-section {
    background: transparent;
}

.products-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.section-title {
    color: var(--text-primary);
    font-size: 1.5rem;
    margin: 0;
}

.clear-cart-btn {
    font-weight: 500;
}

.products-list-container {
    padding: 0 1rem;
}

.product-card {
    margin-bottom: 1.5rem;
    border-radius: 8px;
    overflow: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.product-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.product-card-content {
    display: grid;
    grid-template-columns: 120px 1fr 180px;
    gap: 1rem;
    padding: 1rem;
}

.product-image-col {
    display: flex;
    align-items: center;
}

.product-image {
    border-radius: 6px;
}

.discount-badge {
    font-size: 0.8rem;
    top: 8px;
    right: 8px;
}

.product-info-col {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.product-name {
    font-size: 1.1rem;
    margin: 0 0 0.5rem;
    color: var(--text-primary);
}

.product-meta {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
}

.color-chip {
    height: 24px;
}

.product-description {
    font-size: 0.9rem;
    color: var(--text-secondary);
    margin-bottom: 0.5rem;
}

.product-price {
    display: flex;
    align-items: center;
    gap: 0.8rem;
}

.current-price {
    font-size: 1.2rem;
    font-weight: bold;
    color: var(--seven-color--);
}

.original-price {
    font-size: 0.9rem;
    text-decoration: line-through;
    color: var(--text-secondary);
}

.product-controls-col {
    display: flex;
    justify-content: flex-end;
}

.product-controls {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
}

.quantity-select {
    width: 100px;
}

.product-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
}

.action-btn {
    transition: transform 0.2s ease;
}

.action-btn:hover {
    transform: scale(1.1);
}

/* Carrito Vacío */
.empty-cart-container {
    padding: 3rem 1rem;
    text-align: center;
}

.empty-cart-card {
    padding: 2rem;
    max-width: 500px;
    margin: 0 auto;
    background: var(--one-color--);
}

.empty-cart-title {
    color: var(--text-primary);
    margin: 1rem 0 0.5rem;
}

.empty-cart-message {
    color: var(--text-secondary);
    margin-bottom: 1.5rem;
}

.explore-btn {
    padding: 0.8rem 1.5rem;
    font-weight: 500;
}

/* Sección de Resumen */
.cart-summary-section {
    position: relative;
}

.summary-card {
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    position: sticky;
    top: 1rem;
}

.summary-title {
    font-size: 1.3rem;
    color: var(--text-primary);
    margin: 0 0 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid var(--four-color--);
}

.process-timeline {
    margin: 1rem 0;
}

.summary-separator {
    margin: 1.5rem 0;
    background: var(--border-color);
}

/* Resumen de Productos */
.products-summary {
    max-height: 200px;
    overflow-y: auto;
    padding-right: 0.5rem;
}

.product-summary-item {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--border-color);
}

.product-summary-item:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
}

.product-summary-image {
    flex-shrink: 0;
}

.product-summary-image .q-img {
    border-radius: 4px;
}

.product-summary-info {
    flex-grow: 1;
}

.product-summary-name {
    font-size: 0.9rem;
    color: var(--text-primary);
    margin-bottom: 0.3rem;
}

.product-summary-meta {
    font-size: 0.8rem;
    color: var(--text-secondary);
}

.more-items-text {
    font-size: 0.9rem;
    color: var(--text-secondary);
    text-align: center;
    margin-top: 0.5rem;
    font-style: italic;
}

/* Totales */
.totals-container {
    margin: 1.5rem 0;
}

.total-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.8rem;
    font-size: 0.95rem;
}

.total-row:last-child {
    margin-bottom: 0;
}

.grand-total {
    font-size: 1.1rem;
    font-weight: bold;
    color: var(--seven-color--);
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 2px solid var(--four-color--);
}

/* Cupón de Descuento */
.coupon-section {
    margin: 1.5rem 0;
}

.coupon-input {
    margin-bottom: 0.5rem;
}

.coupon-applied {
    margin-top: 0.5rem;
    text-align: center;
}

/* Botón de Pago */
.payment-actions {
    margin-top: 2rem;
}

.payment-btn {
    width: 100%;
    padding: 0.8rem;
    font-size: 1rem;
    font-weight: 500;
    transition: all 0.3s ease;
}

.payment-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.payment-methods {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin: 1rem 0;
    color: var(--text-secondary);
}

.security-badge {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    font-size: 0.8rem;
    color: var(--text-secondary);
}

/* Ofertas Especiales */
.offers-card {
    border-radius: 10px;
}

.offers-title {
    font-size: 1.1rem;
    color: var(--text-primary);
    margin: 0 0 1rem;
}

.offer-items {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
}

.offer-item {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    font-size: 0.9rem;
    color: var(--text-primary);
}

/* Animaciones */
.list-enter-active,
.list-leave-active {
    transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateX(30px);
}

.animated-card {
    transition: all 0.3s ease;
}

/* Responsividad */
@media (max-width: 1024px) {
    .cart-main-container {
        grid-template-columns: 1fr;
        margin-top: -2rem;
    }

    .summary-card {
        position: static;
        margin-top: 2rem;
    }

    .hero-title {
        font-size: 2rem;
    }

    .product-card-content {
        grid-template-columns: 100px 1fr;
    }

    .product-controls-col {
        grid-column: span 2;
        justify-content: space-between;
        flex-direction: row;
        align-items: center;
    }

    .product-actions {
        margin-left: auto;
    }
}

@media (max-width: 768px) {
    .hero-title {
        font-size: 1.8rem;
    }

    .hero-subtitle {
        font-size: 1rem;
    }

    .product-card-content {
        grid-template-columns: 1fr;
        gap: 1rem;
    }

    .product-image-col {
        justify-content: center;
    }

    .product-controls-col {
        grid-column: span 1;
    }

    .product-info {
        text-align: center;
    }

    .product-meta {
        justify-content: center;
    }

    .product-price {
        justify-content: center;
    }

    .product-controls {
        flex-direction: row;
        align-items: center;
        width: 100%;
    }
}

@media (max-width: 480px) {
    .cart-hero {
        padding: 3rem 1rem;
    }

    .hero-title {
        font-size: 1.5rem;
    }

    .section-title {
        font-size: 1.2rem;
    }

    .clear-cart-btn {
        font-size: 0.8rem;
    }
}
</style>