<template>
    <div class="products-container">
        <mainBar />

        <div class="header-section">
            <div class="container">
                <div class="row items-center justify-between q-py-lg">
                    <div class="col-auto">
                        <h1 class="page-title" style="color: black;">
                            <q-icon name="local_offer" class="q-mr-sm" />
                            Productos en Rebaja
                        </h1>
                        <p class="page-subtitle" style="color: black;">Encuentra las mejores ofertas disponibles</p>
                    </div>
                    <div class="col-auto">
                        <q-chip color="red" text-color="white" icon="flash_on" class="offer-chip">
                            {{ products.length }} Ofertas Activas
                        </q-chip>
                    </div>
                </div>
            </div>
        </div>

        <div class="filters-section">
            <div class="container">
                <q-card class="filters-card">
                    <q-card-section class="q-pa-md">
                        <div class="row q-col-gutter-md items-center">
                            <div class="col-12 col-sm-6 col-md-3">
                                <q-select v-model="sortBy" :options="sortOptions" label="Ordenar por" outlined dense
                                    emit-value map-options @update:model-value="sortProducts">
                                    <template v-slot:prepend>
                                        <q-icon name="sort" />
                                    </template>
                                </q-select>
                            </div>
                            <div class="col-12 col-sm-6 col-md-3">
                                <q-range v-model="priceRange" :min="0" :max="5000000" :step="100000" label-always
                                    color="primary" @change="filterByPrice" />
                                <div class="text-caption text-center q-mt-xs">
                                    Rango de precio
                                </div>
                            </div>
                            <div class="col-12 col-sm-6 col-md-3">
                                <q-toggle v-model="onlyInStock" label="Solo productos en stock" color="green"
                                    @update:model-value="filterProducts" />
                            </div>
                            <div class="col-12 col-sm-6 col-md-3">
                                <q-btn color="secondary" outline icon="refresh" label="Limpiar filtros"
                                    @click="clearFilters" class="full-width" />
                            </div>
                        </div>
                    </q-card-section>
                </q-card>
            </div>
        </div>

        <div class="products-section">
            <div class="container">
                <q-infinite-scroll @load="onLoad" :offset="250">
                    <div class="row q-col-gutter-lg">
                        <div v-for="product in filteredProducts" :key="product._id"
                            class="col-12 col-sm-6 col-md-4 col-xl-3">
                            <q-card class="product-card" @click="viewProduct(product)">
                                <q-badge color="red" floating class="discount-badge">
                                    <q-icon name="local_offer" class="q-mr-xs" />
                                    {{ product.discountPercentage }}% OFF
                                </q-badge>

                                <q-btn round flat icon="favorite_border" class="wishlist-btn" color="pink"
                                    @click.stop="toggleWishlist(product)" />

                                <q-carousel v-model="product.currentSlide" swipeable animated arrows height="250px"
                                    class="product-carousel">
                                    <q-carousel-slide v-for="(image, index) in product.images" :key="index"
                                        :name="index + 1" :img-src="image.urlImage" class="product-slide" />

                                    <template v-slot:control v-if="product.images.length > 1">
                                        <q-carousel-control position="bottom-right" :offset="[18, 18]">
                                            <q-chip color="white" text-color="black" dense class="text-caption">
                                                {{ product.currentSlide }} / {{ product.images.length }}
                                            </q-chip>
                                        </q-carousel-control>
                                    </template>
                                </q-carousel>

                                <q-card-section class="product-info">
                                    <div class="product-title">{{ product.name }}</div>

                                    <div class="product-description">
                                        {{ product.description }}
                                    </div>

                                    <div class="rating-section q-mt-sm">
                                        <q-rating v-model="product.averageRating" readonly size="sm" color="yellow"
                                            icon="star" icon-half="star_half" icon-selected="star" />
                                        <span class="rating-text">
                                            ({{ product.averageRating }}/5)
                                        </span>
                                    </div>

                                    <div class="price-section q-mt-md">
                                        <div class="current-price">
                                            ${{ formatPrice(product.offerPrice) }}
                                        </div>
                                        <div class="original-price">
                                            ${{ formatPrice(product.price) }}
                                        </div>
                                        <div class="savings">
                                            Ahorras ${{ formatPrice(product.price - product.offerPrice) }}
                                        </div>
                                    </div>

                                    <div class="stock-section q-mt-sm">
                                        <q-chip :color="product.stock > 0 ? 'green' : 'red'" text-color="white" dense
                                            :icon="product.stock > 0 ? 'check_circle' : 'cancel'">
                                            {{ product.stock > 0 ? `${product.stock} en stock` : 'Agotado' }}
                                        </q-chip>
                                    </div>

                                    <div class="countdown-section q-mt-sm" v-if="product.offerDateRange">
                                        <q-linear-progress :value="getOfferProgress(product.offerDateRange)"
                                            color="orange" class="q-mb-xs" />
                                        <div class="countdown-text">
                                            <q-icon name="schedule" class="q-mr-xs" />
                                            Oferta termina: {{ formatDate(product.offerDateRange.to) }}
                                        </div>
                                    </div>
                                </q-card-section>

                                <q-separator />

                                <q-card-actions class="product-actions">
                                    <q-btn color="primary" :disable="product.stock <= 0" icon="shopping_cart"
                                        label="Agregar al carrito" class="full-width add-to-cart-btn"
                                        @click.stop="addToCart(product)" />
                                </q-card-actions>

                                <q-card-actions align="center" class="quick-actions">
                                    <q-btn flat dense color="grey-7" icon="visibility" label="Ver detalles"
                                        @click.stop="viewProduct(product)" />
                                    <q-btn flat dense color="grey-7" icon="share" label="Compartir"
                                        @click.stop="shareProduct(product)" />
                                </q-card-actions>
                            </q-card>
                        </div>
                    </div>

                    <template v-slot:loading>
                        <div class="row justify-center q-my-md">
                            <q-spinner-dots color="primary" size="40px" />
                        </div>
                    </template>
                </q-infinite-scroll>

                <div v-if="filteredProducts.length === 0" class="empty-state">
                    <q-card class="text-center q-pa-xl">
                        <q-icon name="search_off" size="4rem" color="grey-5" />
                        <div class="text-h6 q-mt-md">No se encontraron productos</div>
                        <div class="text-grey-7 q-mt-sm">
                            Intenta ajustar los filtros de búsqueda
                        </div>
                        <q-btn color="primary" outline label="Limpiar filtros" @click="clearFilters" class="q-mt-md" />
                    </q-card>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import mainBar from '../components/mainBar.vue'
import { getData } from '../service/service'
import { showNotification } from '../utils/utils'
import { useStore } from '../stores/store'
const store = useStore();

const $q = useQuasar()

// Reactive data
const products = ref([])

// Filter states
const sortBy = ref('name')
const priceRange = ref({ min: 0, max: 5000000 })
const onlyInStock = ref(false)

const sortOptions = [
    { label: 'Nombre A-Z', value: 'name' },
    { label: 'Precio menor a mayor', value: 'price-asc' },
    { label: 'Precio mayor a menor', value: 'price-desc' },
    { label: 'Mayor descuento', value: 'discount' },
    { label: 'Mejor calificación', value: 'rating' }
]

// Computed properties
const filteredProducts = computed(() => {
    let filtered = [...products.value]

    // Filter by stock
    if (onlyInStock.value) {
        filtered = filtered.filter(p => p.stock > 0)
    }

    // Filter by price range
    filtered = filtered.filter(p =>
        p.offerPrice >= priceRange.value.min && p.offerPrice <= priceRange.value.max
    )

    // Sort products
    switch (sortBy.value) {
        case 'price-asc':
            filtered.sort((a, b) => a.offerPrice - b.offerPrice)
            break
        case 'price-desc':
            filtered.sort((a, b) => b.offerPrice - a.offerPrice)
            break
        case 'discount':
            filtered.sort((a, b) => b.discountPercentage - a.discountPercentage)
            break
        case 'rating':
            filtered.sort((a, b) => b.averageRating - a.averageRating)
            break
        default:
            filtered.sort((a, b) => a.name.localeCompare(b.name))
    }

    return filtered
})

// Methods
const initializeProducts = () => {
    products.value.forEach(product => {
        // Asegúrate de que cada producto tenga un currentSlide para el carrusel
        if (!product.currentSlide) {
            product.currentSlide = 1
        }
    })
}

const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO').format(price)
}

const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString('es-ES', options)
}

const getOfferProgress = (offerDateRange) => {
    const now = new Date()
    const start = new Date(offerDateRange.from)
    const end = new Date(offerDateRange.to)
    const total = end - start
    const elapsed = now - start
    return Math.max(0, Math.min(1, elapsed / total))
}

const sortProducts = () => {
    // La propiedad computada `filteredProducts` se encargará de ordenar
}

const filterByPrice = () => {
    // La propiedad computada `filteredProducts` se encargará de filtrar por precio
}

const filterProducts = () => {
    // La propiedad computada `filteredProducts` se encargará de filtrar
}

const clearFilters = () => {
    sortBy.value = 'name'
    priceRange.value = { min: 0, max: 5000000 }
    onlyInStock.value = false
}

const addToCart = (product) => {
    
    store.addToCart(product)

    $q.notify({
        color: 'positive',
        message: `${product.name} agregado al carrito`,
        icon: 'shopping_cart',
        position: 'top'
    })
}

const viewProduct = (product) => {
    $q.notify({
        color: 'info',
        message: `Viendo detalles de ${product.name}`,
        icon: 'visibility'
    })
}

const shareProduct = (product) => {
    $q.notify({
        color: 'info',
        message: `Compartiendo ${product.name}`,
        icon: 'share'
    })
}

const toggleWishlist = (product) => {
    $q.notify({
        color: 'pink',
        message: `${product.name} agregado a favoritos`,
        icon: 'favorite'
    })
}

const onLoad = (index, done) => {
    // En un escenario real, aquí cargarías más productos de tu API
    // Por ahora, solo se llama a 'done()' para detener la carga infinita simulada
    setTimeout(() => {
        // Aquí podrías agregar lógica para cargar más productos si tu API lo permite
        // Por ejemplo, si tienes paginación, incrementarías la página y harías otra llamada a la API
        done()
    }, 1000)
}

async function getOffers() {
    try {
        // Asume que getData('/product/offers') devuelve un objeto con una propiedad 'data' que es el array de productos
        const response = await getData('/product/offers');
        products.value = response.data; // Asigna los datos obtenidos a la ref 'products'
        initializeProducts(); // Llama a initializeProducts después de cargar los datos
        showNotification('positive', 'Ofertas cargadas con éxito');
    } catch (error) {
        console.error('Error al buscar ofertas:', error); // Usa console.error para errores
        showNotification('negative', 'Error al cargar ofertas');
    }
}

onMounted(() => {
    // Llama a getOffers cuando el componente se monta para cargar los productos
    getOffers();
})
</script>

<style scoped>
.products-container {
    min-height: 100vh;
    background: linear-gradient(135deg, var(--two-color--) 0%, var(--three-color--) 100%);
    width: 100%;
    margin: 0;
    padding: 0;
}

.container {
    width: 100%;
    max-width: none;
    margin: 0;
    padding: 0 20px;
}

/* Header Section */
.header-section {
    background: url(../assets/Rebajas-BG.jpg) center/cover no-repeat;
    color: white;
    padding: 2rem 0;
    margin-bottom: 2rem;
    width: 100%;
}

.page-title {
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0;
    display: flex;
    align-items: center;
}

.page-subtitle {
    font-size: 1.1rem;
    opacity: 0.9;
    margin: 0.5rem 0 0 0;
}

.offer-chip {
    font-size: 1rem;
    padding: 8px 16px;
}

/* Filters Section */
.filters-section {
    margin-bottom: 2rem;
    width: 100%;
}

.filters-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    width: 100%;
}

/* Products Section */
.products-section {
    padding-bottom: 3rem;
    width: 100%;
}

.product-card {
    height: 100%;
    border-radius: 16px;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    background: white;
    position: relative;
    cursor: pointer;
}

.product-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.discount-badge {
    font-size: 0.9rem;
    padding: 8px 12px;
    top: 12px;
    right: 12px;
    border-radius: 20px;
    z-index: 2;
}

.wishlist-btn {
    position: absolute;
    top: 12px;
    left: 12px;
    z-index: 2;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
}

.product-carousel {
    border-radius: 0;
}

.product-slide {
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

.product-info {
    padding: 1.5rem;
}

.product-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
    line-height: 1.3;
}

.product-description {
    color: var(--text-secondary);
    font-size: 0.9rem;
    line-height: 1.4;
    margin-bottom: 1rem;
}

.rating-section {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.rating-text {
    font-size: 0.85rem;
    color: var(--text-secondary);
}

.price-section {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    padding: 1rem;
    border-radius: 12px;
    margin: 1rem 0;
}

.current-price {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--seven-color--);
}

.original-price {
    font-size: 1rem;
    color: var(--text-secondary);
    text-decoration: line-through;
    margin-top: 0.25rem;
}

.savings {
    font-size: 0.9rem;
    color: #28a745;
    font-weight: 600;
    margin-top: 0.25rem;
}

.stock-section {
    display: flex;
    justify-content: flex-start;
}

.countdown-section {
    background: #fff3cd;
    padding: 0.75rem;
    border-radius: 8px;
    border-left: 4px solid #ffc107;
}

.countdown-text {
    font-size: 0.85rem;
    color: #856404;
    display: flex;
    align-items: center;
}

.product-actions {
    padding: 1rem 1.5rem;
}

.add-to-cart-btn {
    border-radius: 25px;
    font-weight: 600;
    text-transform: none;
    padding: 12px 24px;
}

.quick-actions {
    padding: 0 1.5rem 1rem;
    gap: 1rem;
}

.empty-state {
    padding: 3rem 0;
}

/* Responsive Design */
@media (max-width: 1023px) {
    .page-title {
        font-size: 2rem;
    }

    .container {
        padding: 0 16px;
    }
}

@media (max-width: 767px) {
    .header-section {
        padding: 1.5rem 0;
    }

    .page-title {
        font-size: 1.75rem;
    }

    .product-info {
        padding: 1rem;
    }

    .price-section {
        margin: 0.75rem 0;
        padding: 0.75rem;
    }

    .current-price {
        font-size: 1.25rem;
    }

    .container {
        padding: 0 12px;
    }
}

@media (max-width: 599px) {
    .filters-card .row {
        flex-direction: column;
    }

    .filters-card .col-12 {
        margin-bottom: 1rem;
    }

    .container {
        padding: 0 8px;
    }
}
</style>