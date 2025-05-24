<template>
  <q-layout style="min-height: 100vh;">
    <!-- Header mejorado -->
    <q-header elevated class="header-gradient">
      <q-toolbar class="q-py-sm">
        <!-- Logo y marca -->
        <div class="row items-center no-wrap">
          <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" class="q-mr-sm" />
          <q-avatar size="42px" class="q-mr-sm">
            <img src="../assets/MiniLogo.jpeg">
          </q-avatar>
          <q-toolbar-title class="brand-title text-weight-bold">
            ColProductMarket
          </q-toolbar-title>
        </div>

        <!-- Barra de búsqueda destacada -->
        <div class="search-container q-mx-lg">
          <q-input 
            v-model="searchQuery" 
            dense 
            standout="bg-white text-dark"
            bg-color="white"
            placeholder="Buscar productos electrónicos..." 
            class="search-input"
            @update:model-value="handleSearch"
          >
            <template v-slot:prepend>
              <q-icon name="search" color="primary" />
            </template>
            <template v-slot:append>
              <q-icon v-if="searchQuery" name="close" @click="searchQuery = ''" class="cursor-pointer" />
            </template>
          </q-input>
        </div>

        <!-- Acciones de usuario -->
        <div class="row items-center no-wrap q-gutter-x-sm">
          <q-btn flat round icon="favorite_border" class="text-white" />
          <q-btn flat round icon="person_outline" class="text-white" to="/login" />
          <q-btn flat round icon="shopping_cart" class="text-white" @click="cart">
            <q-badge color="orange" floating>{{ cartItemCount }}</q-badge>
          </q-btn>
        </div>
      </q-toolbar>

      <!-- Categorías con efecto hover -->
      <q-tabs 
        align="center" 
        class="categories-tabs text-white"
        active-color="white"
        indicator-color="transparent"
      >
        <q-route-tab 
          v-for="tab in tabs"
          :key="tab.name"
          :label="tab.label" 
          :to="tab.route"
          exact
          class="tab-item"
        />
      </q-tabs>
    </q-header>

    <!-- Drawer mejorado -->
    <q-drawer 
      v-model="leftDrawerOpen" 
      side="left" 
      bordered
      :width="280"
      class="drawer-menu"
    >
      <q-scroll-area style="height: 100%;">
        <q-list padding>
          <q-item-label header class="text-weight-bold text-primary">
            Menú Principal
          </q-item-label>
          
          <q-item 
            v-for="item in menuItems"
            :key="item.label"
            clickable 
            v-ripple
            :to="item.route"
            active-class="active-menu-item"
            class="menu-item"
          >
            <q-item-section avatar>
              <q-icon :name="item.icon" />
            </q-item-section>
            <q-item-section>{{ item.label }}</q-item-section>
          </q-item>
          
          <q-separator class="q-my-md" />
          
          <q-item-label header class="text-weight-bold text-primary">
            Mi Cuenta
          </q-item-label>
          
          <q-item clickable v-ripple to="/login" class="menu-item">
            <q-item-section avatar>
              <q-icon name="login" />
            </q-item-section>
            <q-item-section>Iniciar Sesión</q-item-section>
          </q-item>
          
          <q-item clickable v-ripple to="/register" class="menu-item">
            <q-item-section avatar>
              <q-icon name="person_add" />
            </q-item-section>
            <q-item-section>Registrarse</q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <!-- Contenido principal -->
    <q-page-container style="padding-top: 112px;">
      <q-page class="q-pa-md">
        <!-- Banner promocional -->
        <div class="promo-banner q-mb-lg" v-if="!loading">
          <q-carousel
            animated
            v-model="slide"
            arrows
            infinite
            height="200px"
            class="rounded-borders"
          >
            <q-carousel-slide 
              v-for="(banner, index) in banners" 
              :key="index"
              :name="index"
              :img-src="banner.image"
              class="banner-slide"
            >
              <div class="banner-content absolute-bottom text-white">
                <div class="text-h5 text-weight-bold">{{ banner.title }}</div>
                <div class="text-subtitle1">{{ banner.subtitle }}</div>
                <q-btn 
                  color="primary" 
                  label="Ver oferta" 
                  class="q-mt-sm"
                  @click="handleBannerClick(banner)"
                />
              </div>
            </q-carousel-slide>
          </q-carousel>
        </div>

        <div class="row q-col-gutter-lg">
          <!-- Filtros mejorados -->
          <div class="col-12 col-md-3">
            <q-card class="filter-card sticky" style="top: 140px;">
              <q-card-section class="bg-primary text-white">
                <div class="text-h6">Filtros</div>
                <div class="text-caption">Personaliza tu búsqueda</div>
              </q-card-section>
              
              <q-card-section>
                <q-expansion-item
                  v-model="categoryExpanded"
                  icon="category"
                  label="Categorías"
                  header-class="text-primary"
                >
                  <q-list dense>
                    <q-item 
                      v-for="cat in categories"
                      :key="cat.id"
                      clickable
                      v-ripple
                      @click="selectCategory(cat)"
                    >
                      <q-item-section>{{ cat.name }}</q-item-section>
                      <q-item-section side>
                        <q-badge color="grey-4" text-color="dark">{{ cat.count }}</q-badge>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-expansion-item>
                
                <q-separator class="q-my-sm" />
                
                <q-expansion-item
                  v-model="priceExpanded"
                  icon="attach_money"
                  label="Rango de precios"
                  header-class="text-primary"
                >
                  <div class="q-pa-sm">
                    <q-range
                      v-model="priceRange"
                      :min="0"
                      :max="10000"
                      :step="100"
                      label-always
                      color="primary"
                      class="q-mt-sm"
                    />
                    <div class="row justify-between q-mt-sm">
                      <q-input 
                        v-model.number="priceRange.min" 
                        type="number" 
                        dense 
                        outlined 
                        prefix="$"
                        style="width: 48%"
                      />
                      <q-input 
                        v-model.number="priceRange.max" 
                        type="number" 
                        dense 
                        outlined 
                        prefix="$"
                        style="width: 48%"
                      />
                    </div>
                  </div>
                </q-expansion-item>
                
                <q-separator class="q-my-sm" />
                
                <q-expansion-item
                  v-model="featuresExpanded"
                  icon="star"
                  label="Características"
                  header-class="text-primary"
                >
                  <div class="q-pa-sm">
                    <q-select
                      v-model="supplierType"
                      :options="supplierOptions"
                      label="Tipo de proveedor"
                      outlined
                      dense
                      class="q-mb-sm"
                    />
                    
                    <q-select
                      v-model="productType"
                      :options="productOptions"
                      label="Tipo de producto"
                      outlined
                      dense
                      class="q-mb-sm"
                    />
                    
                    <q-select
                      v-model="condition"
                      :options="conditionOptions"
                      label="Condición"
                      outlined
                      dense
                    />
                  </div>
                </q-expansion-item>
              </q-card-section>
              
              <q-card-actions align="center">
                <q-btn
                  label="Aplicar filtros"
                  color="primary"
                  class="full-width"
                  @click="applyFilters"
                />
                <q-btn
                  label="Limpiar"
                  flat
                  color="primary"
                  class="full-width q-mt-sm"
                  @click="clearFilters"
                />
              </q-card-actions>
            </q-card>
          </div>
          
          <!-- Lista de productos -->
          <div class="col-12 col-md-9">
            <!-- Encabezado con resultados y ordenamiento -->
            <div class="row items-center justify-between q-mb-md">
              <div class="text-subtitle1 text-grey-8">
                Mostrando <span class="text-weight-bold">{{ pagination.from }}-{{ pagination.to }}</span> de 
                <span class="text-weight-bold">{{ pagination.total }}</span> productos
              </div>
              
              <div class="row items-center q-gutter-x-md">
                <q-select
                  v-model="sortBy"
                  :options="sortOptions"
                  label="Ordenar por"
                  outlined
                  dense
                  style="min-width: 200px;"
                  emit-value
                  map-options
                />
                
                <q-toggle
                  v-model="showDiscountOnly"
                  label="Solo ofertas"
                  color="primary"
                  dense
                />
              </div>
            </div>
            
            <!-- Loading state -->
            <div v-if="loading" class="row q-col-gutter-md">
              <div v-for="n in 6" :key="n" class="col-12 col-sm-6 col-md-4">
                <q-card class="product-card-skeleton">
                  <q-skeleton height="180px" square animation="fade" />
                  <q-card-section>
                    <q-skeleton type="text" width="80%" />
                    <q-skeleton type="text" width="60%" />
                    <div class="row justify-between items-center q-mt-sm">
                      <q-skeleton type="text" width="40%" />
                      <q-skeleton type="circle" size="36px" />
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
            
            <!-- Productos -->
            <div v-else class="row q-col-gutter-md">
              <div 
                v-for="product in filteredProducts"
                :key="product.id"
                class="col-12 col-sm-6 col-md-4"
              >
                <q-card 
                  class="product-card cursor-pointer"
                  @click="viewProduct(product)"
                >
                  <div class="product-badge-container">
                    <q-img
                      :src="product.image || 'https://via.placeholder.com/300'"
                      ratio="1"
                      class="product-image"
                    >
                      <template v-slot:loading>
                        <q-spinner-gears color="primary" size="3em" />
                      </template>
                      
                      <div v-if="product.discount" class="absolute-top-right bg-red text-white q-pa-xs text-caption discount-badge">
                        -{{ product.discount }}%
                      </div>
                      
                      <div v-if="product.isNew" class="absolute-top-left bg-blue text-white q-pa-xs text-caption new-badge">
                        NUEVO
                      </div>
                    </q-img>
                  </div>
                  
                  <q-card-section class="q-pt-sm">
                    <div class="text-subtitle1 text-weight-bold ellipsis-2-lines">{{ product.name }}</div>
                    <div class="text-caption text-grey-7 q-mt-xs ellipsis-3-lines">{{ product.description }}</div>
                  </q-card-section>
                  
                  <q-card-section class="q-pt-none">
                    <div class="row items-center">
                      <div class="text-h6 text-primary text-weight-bold">${{ formatPrice(product.price) }}</div>
                      <div v-if="product.originalPrice" class="text-caption text-strike text-grey-7 q-ml-sm">
                        ${{ formatPrice(product.originalPrice) }}
                      </div>
                    </div>
                    
                    <div class="row items-center justify-between q-mt-sm">
                      <div>
                        <q-rating
                          v-model="product.rating"
                          size="1em"
                          color="orange"
                          readonly
                          class="q-mr-xs"
                        />
                        <span class="text-caption text-grey-7">({{ product.reviews }})</span>
                      </div>
                      
                      <div class="text-caption text-grey-7">
                        <q-icon name="inventory_2" size="1em" class="q-mr-xs" />
                        {{ product.stock }} disponibles
                      </div>
                    </div>
                  </q-card-section>
                  
                  <q-card-actions align="between" class="q-px-md q-pb-md">
                    <q-btn
                      flat
                      round
                      icon="favorite_border"
                      color="grey-7"
                      size="sm"
                      @click.stop="toggleFavorite(product)"
                    />
                    
                    <div class="row items-center q-gutter-x-sm">
                      <q-btn
                        round
                        icon="add_shopping_cart"
                        color="primary"
                        size="sm"
                        @click.stop="addToCart(product)"
                      />
                      
                      <q-btn
                        label="Ver"
                        color="primary"
                        size="sm"
                        outline
                        @click.stop="viewProduct(product)"
                      />
                    </div>
                  </q-card-actions>
                </q-card>
              </div>
            </div>
            
            <!-- Paginación -->
            <div class="row justify-center q-mt-lg">
              <q-pagination
                v-model="pagination.page"
                :max="Math.ceil(pagination.total / pagination.rowsPerPage)"
                :input="true"
                direction-links
                boundary-links
                color="primary"
                active-design="unelevated"
                active-color="primary"
                active-text-color="white"
              />
            </div>
            
            <!-- Empty state -->
            <div v-if="!loading && products.length === 0" class="column items-center q-my-xl">
              <q-icon name="search_off" size="xl" color="grey-5" />
              <div class="text-h6 q-mt-md text-grey-7">No se encontraron productos</div>
              <div class="text-subtitle1 q-mt-sm text-grey-6 text-center">
                Prueba ajustando tus filtros de búsqueda o revisa nuestras categorías
              </div>
              <q-btn
                label="Explorar productos"
                color="primary"
                class="q-mt-md"
                @click="clearFilters"
              />
            </div>
          </div>
        </div>
      </q-page>
    </q-page-container>
    
    <!-- Footer mejorado -->
    <q-footer elevated class="bg-dark text-white">
      <div class="container q-py-lg">
        <div class="row q-col-gutter-lg">
          <div class="col-12 col-md-4">
            <div class="text-h6 q-mb-md">ColProductMarket</div>
            <p class="text-justify">
              Tu destino confiable para productos electrónicos de calidad. Ofrecemos las mejores marcas a precios competitivos con envío rápido a todo el país.
            </p>
            <div class="row q-gutter-x-sm q-mt-md">
              <q-btn round flat icon="facebook" color="white" />
              <q-btn round flat icon="twitter" color="white" />
              <q-btn round flat icon="instagram" color="white" />
              <q-btn round flat icon="linkedin" color="white" />
            </div>
          </div>
          
          <div class="col-6 col-md-2">
            <div class="text-subtitle1 q-mb-md">Categorías</div>
            <q-list dense>
              <q-item v-for="cat in footerCategories" :key="cat" clickable>
                <q-item-section>{{ cat }}</q-item-section>
              </q-item>
            </q-list>
          </div>
          
          <div class="col-6 col-md-2">
            <div class="text-subtitle1 q-mb-md">Ayuda</div>
            <q-list dense>
              <q-item v-for="help in helpItems" :key="help" clickable>
                <q-item-section>{{ help }}</q-item-section>
              </q-item>
            </q-list>
          </div>
          
          <div class="col-12 col-md-4">
            <div class="text-subtitle1 q-mb-md">Suscríbete a nuestro boletín</div>
            <p>
              Recibe ofertas exclusivas y novedades directamente en tu correo.
            </p>
            <q-input 
              v-model="newsletterEmail"
              outlined
              dense
              placeholder="Tu correo electrónico"
              class="q-mt-sm"
            >
              <template v-slot:append>
                <q-btn 
                  icon="send" 
                  color="primary" 
                  dense 
                  flat 
                  @click="subscribeNewsletter"
                />
              </template>
            </q-input>
          </div>
        </div>
        
        <q-separator color="grey-7" class="q-my-md" />
        
        <div class="row items-center justify-between">
          <div class="text-caption">
            © 2023 ColProductMarket. Todos los derechos reservados.
          </div>
          <div class="row q-gutter-x-md">
            <div class="text-caption cursor-pointer">Términos y condiciones</div>
            <div class="text-caption cursor-pointer">Política de privacidad</div>
          </div>
        </div>
      </div>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useStore } from '../stores/store'
import { getData } from '../service/service'

const $q = useQuasar()
const store = useStore()

const leftDrawerOpen = ref(false)


const searchQuery = ref('Electrónicos')
const slide = ref(0)

const supplierType = ref(null)
const productType = ref(null)
const condition = ref(null)
const priceRange = ref({ min: 0, max: 10000 })
const minOrder = ref({ min: 0, max: 10000 })
const sortBy = ref('Relevancia')
const showDiscountOnly = ref(false)

// UI estados
const loading = ref(false)
const categoryExpanded = ref(true)
const priceExpanded = ref(true)
const featuresExpanded = ref(false)

// Newsletter
const newsletterEmail = ref('')

// Paginación
const pagination = ref({
  page: 1,
  rowsPerPage: 9,
  total: 0,
  from: 0,
  to: 0
})

// Datos de ejemplo
const banners = ref([
  {
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    title: 'Oferta Especial en Laptops',
    subtitle: 'Hasta 30% de descuento en marcas seleccionadas',
    link: '/rebajas'
  },
  {
    image: 'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    title: 'Nuevos Smartphones',
    subtitle: 'Los últimos modelos ya disponibles',
    link: '/productos'
  },
  {
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    title: 'Accesorios Premium',
    subtitle: 'Compra 2 y lleva el tercero gratis',
    link: '/productos'
  }
])

const categories = ref([
  { id: 1, name: 'Laptops', count: 42 },
  { id: 2, name: 'Smartphones', count: 36 },
  { id: 3, name: 'Tablets', count: 18 },
  { id: 4, name: 'Audio', count: 27 },
  { id: 5, name: 'Accesorios', count: 53 },
  { id: 6, name: 'Componentes', count: 31 }
])

const tabs = ref([
  { label: 'INICIO', route: '/' },
  { label: 'PRODUCTOS', route: '/productos' },
  { label: 'OFERTAS', route: '/rebajas' },
  { label: 'NOVEDADES', route: '/novedades' },
  { label: 'CONTACTO', route: '/contacto' }
])

const menuItems = ref([
  { label: 'Inicio', icon: 'home', route: '/' },
  { label: 'Productos', icon: 'shopping_bag', route: '/productos' },
  { label: 'Ofertas', icon: 'local_offer', route: '/rebajas' },
  { label: 'Novedades', icon: 'new_releases', route: '/novedades' },
  { label: 'Contacto', icon: 'contact_mail', route: '/contacto' }
])

const footerCategories = ref([
  'Laptops', 'Smartphones', 'Tablets', 'Audio', 'Accesorios', 'Componentes'
])

const helpItems = ref([
  'Centro de ayuda', 'Cómo comprar', 'Envíos', 'Devoluciones', 'Pagos', 'Garantías'
])

const supplierOptions = [
  { label: 'Proveedores verificados', value: 'verified' },
  { label: 'Proveedores premium', value: 'premium' },
  { label: 'Todos los proveedores', value: 'all' }
]

const productOptions = [
  { label: 'Listo para comprar', value: 'ready' },
  { label: 'Muestras PaaS', value: 'samples' },
  { label: 'Productos personalizados', value: 'custom' }
]

const conditionOptions = [
  { label: 'Nuevo', value: 'new' },
  { label: 'Usado', value: 'used' },
  { label: 'Reacondicionado', value: 'refurbished' }
]

const sortOptions = [
  { label: 'Relevancia', value: 'Relevancia' },
  { label: 'Precio: menor a mayor', value: 'price_asc' },
  { label: 'Precio: mayor a menor', value: 'price_desc' },
  { label: 'Más vendidos', value: 'popular' },
  { label: 'Mejor valorados', value: 'rating' },
  { label: 'Novedades', value: 'newest' }
]

const products = ref([])

// Computed
const cartItemCount = computed(() => store.cartItems?.length)

const filteredProducts = computed(() => {
  let filtered = [...products.value]
  
  // Filtrar por ofertas si está activado
  if (showDiscountOnly.value) {
    filtered = filtered.filter(p => p.discount > 0)
  }
  
  // Filtrar por rango de precio
  filtered = filtered.filter(p => 
    p.price >= priceRange.value.min && 
    p.price <= priceRange.value.max
  )
  
  // Ordenar
  switch (sortBy.value) {
    case 'price_asc':
      return filtered.sort((a, b) => a.price - b.price)
    case 'price_desc':
      return filtered.sort((a, b) => b.price - a.price)
    case 'popular':
      return filtered.sort((a, b) => b.sales - a.sales)
    case 'rating':
      return filtered.sort((a, b) => b.rating - a.rating)
    case 'newest':
      return filtered.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
    default:
      return filtered
  }
})

// Métodos
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function cart() {
  window.location.href = 'http://localhost:5173/#/cart'
}

function formatPrice(price) {
  return price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
}

function clearFilters() {
  supplierType.value = null
  productType.value = null
  condition.value = null
  priceRange.value = { min: 0, max: 10000 }
  minOrder.value = { min: 0, max: 10000 }
  sortBy.value = 'Relevancia'
  showDiscountOnly.value = false
  fetchProducts()
}

function applyFilters() {
  pagination.value.page = 1
  fetchProducts()
}

async function fetchProducts() {
  try {
    loading.value = true
    
    // Simular llamada API
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Datos de ejemplo
    products.value = [
      {
        id: 1,
        name: 'Zenbook Pro 14.5" OLED - Intel Core i7, 16GB RAM, 512GB SSD',
        description: 'Pantalla OLED 2.8K 120Hz, procesador Intel Core i7-12700H, GPU NVIDIA RTX 3050 Ti, diseño ultradelgado.',
        price: 1854,
        originalPrice: 2100,
        discount: 12,
        minOrder: 1,
        stock: 15,
        rating: 4.5,
        reviews: 42,
        sales: 128,
        dateAdded: '2023-05-15',
        isNew: true,
        image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 2,
        name: 'MacBook Air M2 - Chip M2, 8GB RAM, 256GB SSD',
        description: 'Chip M2 con CPU de 8 núcleos y GPU de 10 núcleos, pantalla Retina 13.6", diseño sin ventilador.',
        price: 1299,
        minOrder: 1,
        stock: 8,
        rating: 4.8,
        reviews: 67,
        sales: 215,
        dateAdded: '2023-06-20',
        isNew: true,
        image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 3,
        name: 'Dell XPS 15 - Intel Core i9, 32GB RAM, 1TB SSD',
        description: 'Pantalla InfinityEdge 15.6" 4K UHD+, procesador Intel Core i9-12900HK, NVIDIA GeForce RTX 3050 Ti.',
        price: 2499,
        originalPrice: 2799,
        discount: 11,
        minOrder: 1,
        stock: 5,
        rating: 4.7,
        reviews: 38,
        sales: 92,
        dateAdded: '2023-04-10',
        image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 4,
        name: 'HP Spectre x360 - Intel Core i7, 16GB RAM, 1TB SSD',
        description: 'Convertible 2-en-1 con pantalla 13.5" 3K2K OLED táctil, bisel ultra delgado, diseño premium.',
        price: 1499,
        minOrder: 1,
        stock: 12,
        rating: 4.6,
        reviews: 54,
        sales: 176,
        dateAdded: '2023-03-22',
        image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 5,
        name: 'Lenovo ThinkPad X1 Carbon - Intel Core i7, 16GB RAM, 512GB SSD',
        description: 'Ultraportátil empresarial con pantalla 14" WUXGA, teclado retroiluminado, construcción de fibra de carbono.',
        price: 1699,
        originalPrice: 1999,
        discount: 15,
        minOrder: 1,
        stock: 7,
        rating: 4.4,
        reviews: 29,
        sales: 84,
        dateAdded: '2023-02-18',
        image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 6,
        name: 'Asus ROG Zephyrus G14 - AMD Ryzen 9, 16GB RAM, 1TB SSD',
        description: 'Gaming portátil con GPU NVIDIA RTX 3060, pantalla 14" QHD 120Hz, animatrix LED en tapa.',
        price: 1599,
        minOrder: 1,
        stock: 9,
        rating: 4.9,
        reviews: 73,
        sales: 198,
        dateAdded: '2023-07-05',
        isNew: true,
        image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
      }
    ]
    
    pagination.value.total = products.value.length
    pagination.value.from = 1
    pagination.value.to = products.value.length
    
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Error al cargar productos',
      position: 'top'
    })
    console.error('Error fetching products:', error)
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  pagination.value.page = 1
  fetchProducts()
}

function addToCart(product) {
  store.addToCart(product)
  $q.notify({
    type: 'positive',
    message: `${product.name} añadido al carrito`,
    position: 'top-right',
    timeout: 1500,
    progress: true,
    actions: [
      { label: 'Ver carrito', color: 'white', handler: cart }
    ]
  })
}

function toggleFavorite(product) {
  product.isFavorite = !product.isFavorite
  $q.notify({
    message: product.isFavorite 
      ? 'Añadido a favoritos' 
      : 'Eliminado de favoritos',
    icon: product.isFavorite ? 'favorite' : 'favorite_border',
    color: product.isFavorite ? 'pink' : 'grey',
    position: 'top-right',
    timeout: 1000
  })
}

function viewProduct(product) {
  // Navegar a la página de detalle del producto
  console.log('View product:', product)
}

function handleBannerClick(banner) {
  // Navegar al enlace del banner
  console.log('Banner clicked:', banner)
}

function selectCategory(category) {
  searchQuery.value = category.name
  handleSearch()
}

function subscribeNewsletter() {
  if (newsletterEmail.value) {
    $q.notify({
      type: 'positive',
      message: 'Gracias por suscribirte a nuestro boletín',
      icon: 'email',
      position: 'top-right'
    })
    newsletterEmail.value = ''
  }
}

// Watchers
watch([
  () => pagination.value.page,
  sortBy,
  priceRange,
  minOrder
], () => {
  fetchProducts()
}, { deep: true })




// datos del backed filtrados

//variables usadas para filtros , estas las pone arroba junto con las demas al inicio del script
// todo esto esta estatico luego debe hacer esto dinamico osea con v-model y usar inputs para cosas como
// parameter y precios maximo y minimo para el filtro por categoria usa un select ese es facil de hacer
// si no sabe como hacer la parte del select me llame y eso se ahce rapidito 
const parameter = ref('nevera')
const categoryId = ref('6830ce51182591e400d08b72')
const minimumPrice = ref(16000)
const maximunPrice = ref(2000000)

//1 filtro para buscar por cualquier palabra , este es el de la barra de busqueda
async function searchProducts(){
  try {
    const response = await getData(`/product/search-products?search=${parameter.value}`)
    console.log("productos filtrados por palabra" , response.data);
  } catch (error) {
    console.log("error al filtrar priductos por palabras" , error);
  }
} 

//2 filtro para buscar por categoria 

async function searchProductsByCategory(){
  try {
    const response = await getData(`/product/search-products?categoryId=${categoryId.value}`)
    console.log("productos filtrados por categoria" , response.data);
  } catch (error) {
    console.log("error al filtrar priductos por categoria" , error);
  }
} 


// 3 filtro por precios
async function searchProductsByPrice(){
  try {
    const response = await getData(`/product/search-products?min_price=${minimumPrice.value}&max_price=${maximunPrice.value}`)
    console.log("productos filtrados por precios" , response.data);
  } catch (error) {
    console.log("error al filtrar priductos por precios" , error);
  }
} 




// Lifecycle hooks
onMounted(() => {
  fetchProducts()
  searchProducts()
  searchProductsByCategory()
  searchProductsByPrice()
})
</script>

<style scoped>
/* Estilos generales */
.header-gradient {
  background: linear-gradient(135deg, #1976d2 0%, #0d47a1 100%);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.brand-title {
  font-family: 'Montserrat', sans-serif;
  font-size: 1.5rem;
  letter-spacing: 0.5px;
  color: white;
}

.search-container {
  flex-grow: 1;
  max-width: 600px;
}

.search-input {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.categories-tabs .q-tab {
  padding: 0 16px;
  font-weight: 500;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.categories-tabs .q-tab:hover {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.tab-item {
  position: relative;
}

.tab-item:after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: white;
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.tab-item.active:after {
  width: 60%;
}

/* Drawer styles */
.drawer-menu {
  background-color: #f8f9fa;
}

.menu-item {
  border-radius: 8px;
  margin: 4px 8px;
  transition: all 0.3s ease;
}

.menu-item:hover {
  background-color: #e9ecef;
}

.active-menu-item {
  background-color: #e3f2fd;
  color: var(--q-primary);
}

.active-menu-item .q-icon {
  color: var(--q-primary);
}

/* Product cards */
.product-card {
  border-radius: 12px;
  transition: all 0.3s ease;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

.product-image {
  border-radius: 12px 12px 0 0;
}

.discount-badge {
  border-radius: 0 12px 0 8px;
  font-weight: bold;
}

.new-badge {
  border-radius: 12px 0 8px 0;
  font-weight: bold;
}

.ellipsis-2-lines {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ellipsis-3-lines {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Filter card */
.filter-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* Promo banner */
.promo-banner {
  border-radius: 12px;
  overflow: hidden;
}

.banner-slide {
  position: relative;
}

.banner-content {
  background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%);
  padding: 20px;
  border-radius: 0 0 12px 12px;
}

/* Skeleton loading */
.product-card-skeleton {
  border-radius: 12px;
  overflow: hidden;
}

/* Footer */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

/* Responsive adjustments */
@media (max-width: 1023px) {
  .brand-title {
    font-size: 1.2rem;
  }
  
  .search-container {
    order: 3;
    width: 100%;
    margin: 12px 0;
    max-width: 100%;
  }
  
  .categories-tabs .q-tab {
    padding: 0 8px;
    font-size: 0.8rem;
  }
}

@media (max-width: 599px) {
  .promo-banner {
    margin-left: -8px;
    margin-right: -8px;
    border-radius: 0;
  }
  
  .filter-card {
    margin-bottom: 16px;
  }
}
</style>