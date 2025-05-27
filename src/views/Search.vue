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
          <q-input v-model="parameter" dense standout="bg-white text-dark" bg-color="white"
            placeholder="Buscar productos electrónicos..." class="search-input"
            @update:model-value="searchProducts(parameter)">
            <template v-slot:prepend>
              <q-icon name="search" color="primary" />
            </template>
            <template v-slot:append>
              <q-icon v-if="searchQuery" name="close" @click="searchQuery = 'category'" class="cursor-pointer" />
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
      <q-tabs align="center" class="categories-tabs text-white" active-color="white" indicator-color="transparent">
        <q-route-tab v-for="tab in tabs" :key="tab.name" :label="tab.label" :to="tab.route" exact class="tab-item" />
      </q-tabs>
    </q-header>

    <!-- Drawer mejorado -->
    <q-drawer v-model="leftDrawerOpen" side="left" bordered :width="280" class="drawer-menu">
      <q-scroll-area style="height: 100%;">
        <q-list padding>
          <q-item-label header class="text-weight-bold text-primary">
            Menú Principal
          </q-item-label>

          <q-item v-for="item in menuItems" :key="item.label" clickable v-ripple :to="item.route"
            active-class="active-menu-item" class="menu-item">
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
          <!-- Filtros mejorados -->
          <div class="col-12 col-md-3">
            <q-card class="filter-card sticky" style="top: 140px;">
              <q-card-section class="bg-primary text-white">
                <div class="text-h6">Filtros</div>
                <div class="text-caption">Personaliza tu búsqueda</div>
              </q-card-section>

              <q-card-section>
                <q-expansion-item v-model="categoryExpanded" icon="category" label="Categorías"
                  header-class="text-primary">
                  <q-list dense>
                    <q-item  v-for="categories in categories" :key="categories.id" clickable v-ripple @click="selectCategory(categories._id)">
                      <q-item-section>{{ categories.name }}</q-item-section>
                      <q-item-section side>
                        <q-badge color="grey-4" text-color="dark">{{ categories.count }}</q-badge>
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
        v-model="internalPriceRange"
        :min="10000"
        :max="1500000"
        :step="100"
        label-always
        color="primary"
        class="q-mt-sm"
      />
      <div class="row justify-between q-mt-sm">
        <q-input
          v-model.number="internalPriceRange.min"
          type="number"
          dense
          outlined
          prefix="$"
          style="width: 48%"
        />
        <q-input
          v-model.number="internalPriceRange.max"
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
              </q-card-section>
            </q-card>
          </div>

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
            <div v-if="!loading && products.length === 0" class="column items-center q-my-xl">
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
    // Llamar a la función de búsqueda aquí para que se actualice al arrastrar el rango
    searchProductsByPrice(priceRange.value.min, priceRange.value.max);
  },
});

// Watchers para sincronizar y disparar la búsqueda cuando los inputs individuales cambian
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

const category = ref([])
async function getCategoryById() {
  try {
    const response = await getData(`/categories/${categoryId.value}`)
    if (response.data.length > 0) {
      category.value = response.data;
      console.log("categoria seleccionada", category.value);
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

// Computed
const cartItemCount = computed(() => store.cartItems?.length)

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


function handleBannerClick(banner) {
  // Navegar al enlace del banner
  console.log('Banner clicked:', banner)
}





// datos del backed filtrados
//variables usadas para filtros , estas las pone arroba junto con las demas al inicio del script
// todo esto esta estatico luego debe hacer esto dinamico osea con v-model y usar inputs para cosas como
// parameter y precios maximo y minimo para el filtro por categoria usa un select ese es facil de hacer
// si no sabe como hacer la parte del select me llame y eso se hace rapidito 
const parameter = ref('')
const minimumPrice = ref(16000)
const maximunPrice = ref(15000000)

//1 filtro para buscar por cualquier palabra , este es el de la barra de busqueda
async function searchProducts() {
  try {
    const response = await getData(`/product/search-products?search=${parameter.value}`)
    products.value = response.data
    console.log("productos filtrados por palabra", response.data);
  } catch (error) {
    console.log("error al filtrar priductos por palabras", error);
  }
}

//2 filtro para buscar por categoria 
async function selectCategory(categoryId) {
  try {
    const response = await getData(`/product/search-products?categoryId=${categoryId}`)
    products.value = response.data
    console.log("productos filtrados por categoria", response.data);
  } catch (error) {
    console.log("error al filtrar priductos por categoria", error);
  }
}
// 3 filtro por precios



function obtainDataSearch() {
  parameter.value = route.query.data || ''
  console.log("parametro de busqueda", parameter.value);
}

onMounted(() => {
  selectCategory()
  searchProductsByPrice()
  getAllCategories()
  obtainDataSearch()
  searchProducts()
  getCategoryById()
})
</script>

<style scoped>
@import url("../style/Search.css");
</style>