<template>
  <q-layout style="min-height: 100vh;">
    <!-- Header mejorado -->
<q-header elevated class="header-gradient">
  <q-toolbar class="q-py-sm">
    <!-- Menú y logo - siempre visibles -->
    <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" class="q-mr-sm" />
    <q-avatar size="42px" class="q-mr-sm" @click="router.push('/')">
      <img src="../assets/MiniLogo.jpeg">
    </q-avatar>

    <!-- Nombre de la marca con truncado -->
    <q-toolbar-title class="brand-title text-weight-bold text-ellipsis">
      ColProductMarket
    </q-toolbar-title>

    <!-- Barra de búsqueda con prioridad -->
    <div class="search-container row items-center" style="flex-grow: 1; max-width: 600px; min-width: 150px;">
      <q-input 
        v-model="parameter" 
        dense 
        standout 
        color="black" 
        bg-color="white"
        placeholder="Buscar productos electrónicos..." 
        class="full-width"
        @update:model-value="searchProducts(parameter)" 
        input-class="text-black" 
        @keyup.enter="productsSearch()"
      >
        <template v-slot:prepend>
          <q-icon name="search" color="primary" />
        </template>
        <template v-slot:append>
          <q-icon v-if="searchQuery" name="close" @click="searchQuery = 'category'" class="cursor-pointer" />
        </template>
      </q-input>
    </div>

    <!-- Acciones de usuario - al lado de la barra de búsqueda -->
    <div class="user-actions row no-wrap items-center q-ml-md">
      <template v-if="!store.userId">
        <q-btn 
          flat 
          label="Ingresar" 
          @click="store.showLoginDialog = true"
          class="action-btn gt-sm"
          :class="{ 'ingresar-animado': !store.showRegister }" 
        />
        <q-btn 
          v-if="store.showRegister" 
          flat 
          label="Registro" 
          @click="store.showRegisterDialog = true"
          class="action-btn gt-sm" 
        />
        <q-btn 
          flat 
          round 
          icon="person" 
          @click="store.showLoginDialog = true"
          class="action-btn lt-md" 
        />
      </template>
      
      <template v-else>
        <q-btn flat round icon="person" class="action-btn">
          <q-menu>
            <div class="user-profile-menu q-pa-md">
              <div class="text-h6 text-center q-mt-sm">{{ store.userInformation.name || 'Usuario' }}</div>
              <div class="column items-center q-mb-md">
                <q-avatar size="70px" class="q-mb-sm">
                  <img :src="store.profilePicture || 'https://ostermancron.com/wp-content/uploads/2016/02/blank-profile-picture-973460_640.png'">
                </q-avatar>
                <div class="text-caption text-grey-7 text-center q-mb-md">
                  {{ store.userInformation.email || 'test@gmail.com' }}
                </div>
              </div>
              <q-btn flat label="Administrar cuenta" class="full-width" icon="manage_accounts"
                style="color: #1976D2;" @click="router.push('/userProfile')" />
              <q-separator class="q-my-sm" />
              <q-btn flat label="Cerrar Sesión" icon="logout" class="full-width" style="color: #C10015;"
                @click="closeSession" />
            </div>
          </q-menu>
        </q-btn>
      </template>
      
      <q-btn flat round icon="shopping_cart" class="cart-btn q-ml-sm" @click="cart()">
        <q-badge v-if="store.cart.items?.length > 0" color="red" floating rounded>
          {{ store.cart.items.length }}
        </q-badge>
      </q-btn>
    </div>
  </q-toolbar>

  <!-- Categorías -->
  <q-toolbar class="categories-toolbar" :class="{ 'mobile-menu-open': mobileMenuOpen }">
    <div class="categories-container">
      <q-tabs align="left" class="categories-tabs" :breakpoint="0">
        <q-route-tab label="PRODUCTOS" to="/" exact />
        <q-route-tab label="FACTURAS" to="/invoice" exact />
        <q-route-tab label="REBAJAS" to="/" exact />
        <q-route-tab label="CONTACTO" to="/Contact" exact />
        <q-route-tab label="MOVIMIENTOS" to="/movements" exact />
      </q-tabs>
    </div>
  </q-toolbar>
</q-header>

    <!-- Drawer mejorado -->
    <q-drawer v-model="leftDrawerOpen" side="left" bordered :width="280" class="drawer-menu">
      <q-scroll-area style="height: 100%;">
        <q-list padding>
          <q-item-label header class="text-weight-bold text-primary">
            Filtrar por Categorias
          </q-item-label>
          <q-item v-for="categories in categories" :key="categories.id" clickable v-ripple
            @click="selectCategory(categories._id)">
            <q-item-section>{{ categories.name }}</q-item-section>
            <q-item-section side>
              <q-badge color="grey-4" text-color="dark">{{ categories.count }}</q-badge>
            </q-item-section>
          </q-item>

          <q-item v-model="priceExpanded" icon="attach_money" label="Rango de precios" header-class="text-primary">
            <div class="q-pa-sm">
              <q-range v-model="internalPriceRange" :min="10000" :max="1500000" :step="100" label-always color="primary"
                class="q-mt-sm" />
              <div class="row justify-between q-mt-sm">
                <q-input v-model.number="internalPriceRange.min" type="number" dense outlined prefix="$"
                  style="width: 48%" />
                <q-input v-model.number="internalPriceRange.max" type="number" dense outlined prefix="$"
                  style="width: 48%" />
              </div>
            </div>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <!-- Contenido principal -->
    <q-page-container style="padding-top: 112px;">
      <q-page class="q-pa-md">
        <!-- Banner promocional -->
        <div class="promo-banner q-mb-lg" v-if="!loading">
          <q-carousel animated v-model="slide" arrows infinite height="200px" class="rounded-borders">
            <q-carousel-slide v-for="(banner, index) in banners" :key="index" :name="index" :img-src="banner.image"
              class="banner-slide">
              <div class="banner-content absolute-bottom text-white">
                <div class="text-h5 text-weight-bold">{{ banner.title }}</div>
                <div class="text-subtitle1">{{ banner.subtitle }}</div>
                <q-btn color="primary" label="Ver oferta" class="q-mt-sm" @click="handleBannerClick(banner)" />
              </div>
            </q-carousel-slide>
          </q-carousel>
        </div>

        <div class="row q-col-gutter-lg">
          <!-- Lista de productos -->
          <div class="col-12 col-md-9">
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
              <div v-for="product in products" :key="product.id" class="col-12 col-sm-6 col-md-4">
                <q-card class="product-card cursor-pointer" @click="viewProduct(product)">
                  <div class="product-badge-container">
                    <q-img :src="product.images[1].urlImage || ''" ratio="1" class="product-image">
                      <template v-slot:loading>
                        <q-spinner-gears color="primary" size="3em" />
                      </template>
                      <div v-if="product.discount > 0"
                        class="absolute-top-right bg-red text-white q-pa-xs text-caption discount-badge">
                        -{{ product.discount }}%
                      </div>
                      <div v-if="product.isNew"
                        class="absolute-top-left bg-blue text-white q-pa-xs text-caption new-badge">
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
                        <q-rating v-model="product.rating" size="1em" color="orange" readonly class="q-mr-xs" />
                      </div>

                      <div class="text-caption text-grey-7">
                        <q-icon name="inventory_2" size="1em" class="q-mr-xs" />
                        {{ product.stock }} disponibles
                      </div>
                    </div>
                  </q-card-section>

                  <q-card-actions align="between" class="q-px-md q-pb-md">
                    <div class="row items-center q-gutter-x-sm">
                      <q-btn round icon="add_shopping_cart" color="primary" size="sm"
                        @click.stop="addToCart(product)" />
                    </div>
                  </q-card-actions>

                </q-card>
              </div>
            </div>


            <!-- Paginación -->
            <div class="row justify-center q-mt-lg">
              <q-pagination v-model="pagination.page" :max="Math.ceil(pagination.total / pagination.rowsPerPage)"
                :input="true" direction-links boundary-links color="primary" active-design="unelevated"
                active-color="primary" active-text-color="white" />
            </div>

            <!-- Empty state -->
            <div v-if="products.length === 0" class="column items-center q-my-xl">
              <q-icon name="search_off" size="xl" color="grey-5" />
              <div class="text-h6 q-mt-md text-grey-7">No se encontraron productos</div>
              <div class="text-subtitle1 q-mt-sm text-grey-6 text-center">
                Prueba ajustando tus filtros de búsqueda o revisa nuestras categorías
              </div>
              <q-btn label="Explorar productos" color="primary" class="q-mt-md" @click="clearFilters" />
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
              Tu destino confiable para productos electrónicos de calidad. Ofrecemos las mejores marcas a precios
              competitivos con envío rápido a todo el país.
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
            <q-input v-model="newsletterEmail" outlined dense placeholder="Tu correo electrónico" class="q-mt-sm">
              <template v-slot:append>
                <q-btn icon="send" color="primary" dense flat @click="subscribeNewsletter" />
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
import { useRoute } from 'vue-router'
import { ref, computed, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useStore } from '../stores/store'
import { getData } from '../service/service'
import SEEPRODUCT from './SEEPRODUCT.vue'
import { router } from '../routes/routes'
import { showNotification, validateToken } from '../utils/utils'

// Variables reactivas
const priceExpanded = ref(false);
const priceRange = ref({
  min: 10000,
  max: 1500000,
});

// Propiedad computada para vincular q-range y q-inputs
const internalPriceRange = computed({
  get() {
    return priceRange.value;
  },
  set(newVal) {
    // Validaciones para asegurar que los valores se mantengan dentro de los límites y consistentes
    if (newVal.min < 10000) newVal.min = 10000;
    if (newVal.max > 1500000) newVal.max = 1500000;

    // Aseguramos que min no sea mayor que max
    if (newVal.min > newVal.max) {
      newVal.min = newVal.max;
    }
    // Aseguramos que max no sea menor que min
    if (newVal.max < newVal.min) {
      newVal.max = newVal.min;
    }

    priceRange.value = newVal;
    searchProductsByPrice(priceRange.value.min, priceRange.value.max);
  },
});

watch(() => priceRange.value.min, (newVal) => {
  if (newVal > priceRange.value.max) {
    priceRange.value.max = newVal;
  }
  searchProductsByPrice(priceRange.value.min, priceRange.value.max);
});

watch(() => priceRange.value.max, (newVal) => {
  if (newVal < priceRange.value.min) {
    priceRange.value.min = newVal;
  }
  searchProductsByPrice(priceRange.value.min, priceRange.value.max);
});


async function searchProductsByPrice() {
  try {
    const response = await getData(`/product/search-products?min_price=${priceRange.value.min}&max_price=${priceRange.value.max}`)
    products.value = response.data
    console.log("productos filtrados por precios", response.data);
  } catch (error) {
    console.log("error al filtrar priductos por precios", error);
  }
}

const route = useRoute()
const $q = useQuasar()
const store = useStore()
const leftDrawerOpen = ref(false)
const searchQuery = ref('')
const slide = ref(0)
const newsletterEmail = ref('')


const pagination = ref({
  page: 1,
  rowsPerPage: 9,
  total: 0,
  from: 0,
  to: 0
})

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

const categories = ref([])
async function getAllCategories() {
  try {
    const response = await getData("/categories");
    if (response.data.length > 0) {
      categories.value = response.data;
      console.log("data categorias", categories.value);
    } else {
      return console.log("no hay categorias", response.data);
    }
  } catch (error) {
    console.error(error);
  }
}

const tabs = ref([
  { label: 'INICIO', route: '/' },
  { label: 'PRODUCTOS', route: '/productos' },
  { label: 'OFERTAS', route: '/' },
  { label: 'NOVEDADES', route: '/' },
  { label: 'CONTACTO', route: '/' }
])

const menuItems = ref([
  { label: 'Inicio', icon: 'home', route: '/' },
  { label: 'Productos', icon: 'shopping_bag', route: '/productos' },
  { label: 'Ofertas', icon: 'local_offer', route: '/rebajas' },
  { label: 'Novedades', icon: 'new_releases', route: '/novedades' },
  { label: 'Contacto', icon: 'contact_mail', route: '/contacto' }
])

const viewProduct = (product) => {
  router.push({
    path: '/SEEPRODUCT',
    query: { data: JSON.stringify(product) }
  })
  console.log('View product:', product)
}

const products = ref([])
const cartItemCount = computed(() => store.cartItems?.length)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

async function cart() {
  const canProceed = await validateToken()
  if (!canProceed) return
  window.location.href = 'http://localhost:5173/#/cart'
}

async function userProfile() {
  const canProceed = await validateToken()
  if (!canProceed) return
  window.location.href = 'http://localhost:5173/#/userProfile'
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
}

async function addToCart(product) {
  const canProceed = await validateToken()
  if (!canProceed) return
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

function handleBannerClick(banner) {
  console.log('Banner clicked:', banner)
}

const parameter = ref('')
const searchError = ref(false)

async function searchProducts() {
  try {
    searchError.value = false
    const response = await getData(`/product/search-products?search=${parameter.value}`)
    products.value = response.data
    console.log("productos filtrados por palabra", response.data);
  } catch (error) {
    searchError.value = true
    products.value = []
    console.log("error al filtrar priductos por palabras", error);
  }
}

async function selectCategory(categoryId) {
  try {
    searchError.value = false
    const response = await getData(`/product/search-products?categoryId=${categoryId}`)
    if (response.status === 404) {
      showNotification('negative', 'No se encontraron productos')
    }
    products.value = response.data
    console.log("productos filtrados por categoria", response.data);
  } catch (error) {
    searchError.value = true
    console.log("error al filtrar productos por categoria", error);
    products.value = []
  }
}

function obtainDataSearch() {
  parameter.value = route.query.data || ''
  console.log("parametro de busqueda", parameter.value);
}

function closeSession() {
  store.token = null;
  store.userId = null;
  store.showRegister = true;
  store.cart = {
    items:[],
    total:0
  }
  showNotification('positive', 'Has cerrado tu sesión.')
  router.replace("/");
}


onMounted(() => {
  getAllCategories()
  obtainDataSearch()
  searchProducts()
})
</script>

<style scoped>
@import url("../style/Search.css");

/* Estilos para el perfil de usuario */
.user-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.full-actions {
  display: flex;
  gap: 8px;
}

.compact-actions {
  display: none;
  gap: 8px;
}

.action-btn {
  color: white;
  font-weight: 500;
  padding: 6px 10px;
}

.cart-btn {
  position: relative;
  color: white;
}

.user-profile-menu {
  min-width: 250px;
}

.user-profile-menu .q-avatar {
  margin-bottom: 10px;
}

@keyframes pulse-ingresar {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 rgba(255, 255, 255, 0.4);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.7);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 rgba(255, 255, 255, 0.4);
  }
}

.ingresar-animado {
  animation: pulse-ingresar 2s infinite ease-in-out;
}

/* Responsive */
@media (max-width: 768px) {
  .full-actions {
    display: none;
  }
  
  .compact-actions {
    display: flex;
  }
  
  .search-container {
    margin-left: 8px;
    margin-right: 8px;
  }
}

@media (max-width: 480px) {
  .brand-title {
    font-size: 1rem;
  }
  
  .search-container {
    flex-grow: 1;
    margin-left: 4px;
    margin-right: 4px;
  }
}

/* Estilos para el header */
.header-gradient {
  background: linear-gradient(135deg, #1976D2 0%, #0D47A1 100%);
}

/* Nombre de la marca con truncado */
.brand-title {
  font-size: 1.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px; /* Ajusta según necesidad */
  margin-right: 12px;
}

/* Barra de búsqueda responsive */
.search-container {
  transition: all 0.3s ease;
  margin: 0 12px;
}

/* Acciones de usuario */
.user-actions {
  flex-shrink: 0;
}

.action-btn {
  color: white;
  font-weight: 500;
  padding: 6px 10px;
}

.cart-btn {
  position: relative;
  color: white;
}

/* Animación para el botón de ingresar */
@keyframes pulse-ingresar {
  0% { transform: scale(1); box-shadow: 0 0 0 rgba(255, 255, 255, 0.4); }
  50% { transform: scale(1.05); box-shadow: 0 0 15px rgba(255, 255, 255, 0.7); }
  100% { transform: scale(1); box-shadow: 0 0 0 rgba(255, 255, 255, 0.4); }
}

.ingresar-animado {
  animation: pulse-ingresar 2s infinite ease-in-out;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .brand-title {
    max-width: 120px;
  }
}

@media (max-width: 768px) {
  .brand-title {
    max-width: 100px;
    font-size: 1.1rem;
  }
  
  .search-container {
    margin: 0 8px;
  }
}

@media (max-width: 480px) {
  .brand-title {
    max-width: 80px;
    font-size: 1rem;
  }
  
  .search-container {
    margin: 0 4px;
    min-width: 100px;
  }
  
  .user-actions {
    margin-left: 4px;
  }
}
</style>