<template>
  <q-layout view="hHh lpR fFf" id="body">
    <mainBar/>
      <!-- Contenido principal -->
    <div>
      <div class="Home">
        <!-- Carrusel -->
        <div class="carrusel">
    <q-carousel
      animated
      v-model="slide"
      navigation
      infinite
      :autoplay="autoplay"
      arrows
      transition-prev="slide-right"
      transition-next="slide-left"
      @mouseenter="autoplay = false"
      @mouseleave="autoplay = true"
      height="500px"
      class="carrusel-container"
    >
      <q-carousel-slide
        v-for="(imagen, index) in imagenesCarrusel" 
        :key="index"
        :name="index + 1"
        class="carrusel-slide"
      >
        <div class="carrusel-image-container">
          <img :src="imagen.src" :alt="imagen.alt" class="carrusel-image" />
        </div>
      </q-carousel-slide>
    </q-carousel>
  </div>
  <div class="productos-wrapper">
    <!-- Skeleton Loader -->
    <div v-if="productos?.length === 0" class="productos row q-gutter-xl justify-start q-pa-xl">
      <div 
        v-for="n in 8" 
        :key="'skeleton-'+n"
        class="my-card card skeleton-card"
      >
        <div class="card-img skeleton">
          <div class="img skeleton"></div>
        </div>
        <div class="card-title skeleton"></div>
        <div class="card-subtitle skeleton"></div>
        <hr class="card-divider">
        <div class="card-footer">
          <div class="card-price skeleton"></div>
          <button class="card-btn skeleton"></button>
        </div>
      </div>
    </div>

    <!-- Productos reales -->
    <div 
      v-else
      class="productos row q-gutter-xl justify-start q-pa-xl"
    >
      <div 
        v-for="(producto, index) in productos"
        :key="index"
        class="my-card card"
        @click="verDetalleProducto(producto)"
      >
        <div class="card-img">
          <div class="img">
            <q-img
              :src="producto.images[0].urlImage"
              :alt="producto.name"
              fit="cover"
            >
              <template v-slot:loading>
                <q-spinner color="primary" />
              </template>
            </q-img>
          </div>
        </div>
        <div class="card-title">{{ producto.name || 'Producto#' }}</div>
        <div class="card-subtitle">{{ producto.description }}</div>
        <hr class="card-divider">
        <div class="card-footer">
          <div class="card-price"><span>$</span> {{ formatNum(producto.price) }}</div>
          <button class="card-btn" @click.stop="addToTheCart(producto)">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="m397.78 316h-205.13a15 15 0 0 1 -14.65-11.67l-34.54-150.48a15 15 0 0 1 14.62-18.36h274.27a15 15 0 0 1 14.65 18.36l-34.6 150.48a15 15 0 0 1 -14.62 11.67zm-193.19-30h181.25l27.67-120.48h-236.6z"></path>
              <path d="m222 450a57.48 57.48 0 1 1 57.48-57.48 57.54 57.54 0 0 1 -57.48 57.48zm0-84.95a27.48 27.48 0 1 0 27.48 27.47 27.5 27.5 0 0 0 -27.48-27.47z"></path>
              <path d="m368.42 450a57.48 57.48 0 1 1 57.48-57.48 57.54 57.54 0 0 1 -57.48 57.48zm0-84.95a27.48 27.48 0 1 0 27.48 27.47 27.5 27.5 0 0 0 -27.48-27.47z"></path>
              <path d="m158.08 165.49a15 15 0 0 1 -14.23-10.26l-25.71-77.23h-47.44a15 15 0 1 1 0-30h58.3a15 15 0 0 1 14.23 10.26l29.13 87.49a15 15 0 0 1 -14.23 19.74z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
      </div>
    </div>
    

   
<!-- Footer -->
<footer class="footer-container">
  <div class="q-container">
    <div class="row q-col-gutter-lg">
      <!-- Sección Sobre Nosotros -->
      <div class="col-12 col-sm-6 col-md-3">
        <div class="footer-section animated-item animated-delay-1">
          <h3>Sobre Nosotros</h3>
          <p>ColProductMarket es tu destino online para encontrar los mejores productos colombianos con la mejor calidad y precio.</p>
          <div class="social-icons">
            <a href="https://facebook.com" target="_blank" class="social-icon facebook"><q-icon name="fa-brands fa-facebook" /></a>
            <a href="https://twitter.com" target="_blank" class="social-icon twitter"><q-icon name="fa-brands fa-x-twitter" /></a>
            <a href="https://instagram.com" target="_blank" class="social-icon instagram"><q-icon name="fa-brands fa-instagram" /></a>
            <a href="https://youtube.com" target="_blank" class="social-icon youtube"><q-icon name="fa-brands fa-youtube" /></a>
          </div>
        </div>
      </div>

      <!-- Sección Enlaces Rápidos -->
      <div class="col-12 col-sm-6 col-md-3">
        <div class="footer-section animated-item animated-delay-2">
          <h3>Enlaces Rápidos</h3>
          <a href="#" class="footer-link">Inicio</a>
          <a href="#" class="footer-link">Productos</a>
          <a href="#" class="footer-link">Ofertas Especiales</a>
          <a href="#" class="footer-link">Nuestra Marca</a>
          <a href="#" class="footer-link">Preguntas Frecuentes</a>
        </div>
      </div>

      <!-- Sección Contacto -->
      <div class="col-12 col-sm-6 col-md-3">
        <div class="footer-section animated-item animated-delay-3">
          <h3>Contacto</h3>
          <div class="footer-contact-item">
            <i class="q-icon material-icons">email</i>
            <span>colproductmarket@gmail.com</span>
          </div>
          <div class="footer-contact-item">
            <i class="q-icon material-icons">phone</i>
            <span>+57 123 456 7890</span>
          </div>
          <div class="footer-contact-item">
            <i class="q-icon material-icons">location_on</i>
            <span>Santander, Colombia</span>
          </div>
        </div>
      </div>

      <!-- Sección Legal -->
      <div class="col-12 col-sm-6 col-md-3">
        <div class="footer-section animated-item animated-delay-4">
          <h3>Legal</h3>
          <a href="#" class="footer-link">Términos y Condiciones</a>
          <a href="#" class="footer-link">Política de Privacidad</a>
          <a href="#" class="footer-link">Política de Devoluciones</a>
          <a href="#" class="footer-link">Cookies</a>
        </div>
      </div>
    </div>

    <!-- Sección Copyright -->
    <div class="copyright-section">
      <p>&copy; 2025 ColProductMarket. Todos los derechos reservados.</p>
      <div class="payment-methods">
        <q-icon name="fa-brands fa-cc-visa" size="24px" />
        <q-icon name="fa-brands fa-cc-mastercard" size="24px" />
        <q-icon name="fa-brands fa-cc-paypal" size="24px" />
        <q-icon name="fa-brands fa-cc-amex" size="24px" />
      </div>
    </div>
  </div>
</footer>






<!--modal para loguearse-->



  </q-layout>
</template>

<script setup>
import { onMounted, computed, ref, toRaw } from 'vue'
import { showNotification, validateToken, scrollToTopInstant, formatNum } from '../utils/utils.js'
import mainBar from '../components/mainBar.vue';
import { getData, postData } from '../service/service'
import { useStore } from '../stores/store.js';
import { router } from '../routes/routes';
const store = useStore();
const slide = ref(1);
const autoplay = ref(true);
const productos = ref([]);


// Imágenes del carrusel optimizadas
const imagenesCarrusel = ref([
  {
    src: "https://alavista.co/wp-content/uploads/2022/03/H220_Themis_PNGWEB-4.png",
    alt: "Nike Showcase"
  },
  {
    src: "https://portal-center.com/wp-content/uploads/2020/09/PC-GAMER.png",
    alt: "Gaming Laptop"
  },
  {
    src: "https://www.claroshop.com/c/algolia/assets/portada/deportes-tenis.webp",
    alt: "Phantom HD"
  },
  {
    src: "https://img.fcbayern.com/image/upload/f_auto,q_auto,w_1280/eCommerce/produkte/51116",
    alt: "Product Image"
  }
]);








// Función para cargar productos
async function products() {
  try {
    const response = await getData("/product");
    productos.value = response.data
  } catch (error) {
    console.error('Error al cargar productos:', error)
  }
}

// Función para agregar al carrito
const addToTheCart = async (producto) => {
  const canProceed = await validateToken();
  if (!canProceed) return;

  store.addToCart(producto);
  console.log("Agregado al carrito:", producto.name);
};

// Función para ver el detalle del producto
const verDetalleProducto = (producto) => {
  // Guardar información del producto en localStorage para usarla en la página de detalles
  if (producto && (producto.id || producto.name)) {
    localStorage.setItem('selectedProduct', JSON.stringify(producto));
  }

  router.push({
    path:"/seeproduct", query:{data:JSON.stringify(producto)}
  });
}

onMounted(()=>{
  scrollToTopInstant()
  products();
})

</script>

<style scoped>
@import url("../style/Home.css");
</style>