<template>
  <q-layout view="hHh lpR fFf" id="body">
  
    <!-- Contenido principal -->
    <q-page-container>
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

        <!-- Productos -->
        <div class="productos-wrapper">
          <div class="productos row q-gutter-xl justify-start q-pa-xl">
            <q-card
              v-for="(producto, index) in productos"
              :key="index"
              class="my-card"
              bordered
              flat
              @click="verDetalleProducto(producto)"
            >
              <q-card-section class="q-pa-none">
                <q-img
                  :src="producto.images[0].urlImage"
                  :alt="producto.name"
                  style="height: 200px;"
                  fit="cover"
                >
                  <template v-slot:loading>
                    <q-spinner color="primary" />
                  </template>
                </q-img>
              </q-card-section>

              <q-card-section>
                <div class="text-h6">{{ producto.name }}</div>
                <div class="text-subtitle2 text-grey">{{ producto.description }}</div>
              </q-card-section>

              <q-card-section class="text-h6" style="color: red; font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">
                ${{ producto.price.toFixed(2) }}
              </q-card-section>

              <q-card-actions align="center">
                <q-btn color="primary" icon="shopping_cart" @click.stop="agregarAlCarrito(producto)" />
              </q-card-actions>
            </q-card>
          </div>
        </div>
      </div>

      <!-- Productos Especiales -->
      <div class="especial q-pa-xl">
        <div class="row q-col-gutter-md justify-center">
          <q-card
            v-for="(producto, index) in productosEspeciales"
            :key="'especial-' + index"
            class="especial-card col-12 col-sm-6"
            flat
            bordered
            @click="verDetalleProducto(producto)"
          >
            <q-card-section class="special row no-wrap">
              <q-img
                :src="producto.imagen"
                :alt="producto.nombre"
                class="col-5"
                style="height: 180px"
                fit="cover"
              />
              <div class="col q-pa-md">
                <div class="text-h6">{{ producto.nombre }}</div>
                <div class="text-h6 q-mt-sm" style="color: red; font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">
                  ${{ producto.precio.toFixed(2) }}
                </div>
                <div class="text-subtitle2">{{ producto.descripcion }}</div>
                <q-card-actions align="center">
                  <q-btn icon="shopping_cart" color="primary" @click.stop="agregarAlCarrito(producto)" />
                </q-card-actions>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </q-page-container>

    <!-- Footer -->
    <div
      class="row justify-around items-start q-gutter-md full-width"
      id="footer"
    >
      <div class="redes">
        <div class="text-bold q-mb-sm">Redes Sociales</div>
        <q-btn icon="fa-brands fa-facebook" flat round color="primary" />
        <q-btn icon="fa-brands fa-x-twitter" flat round color="dark" />
        <q-btn icon="fa-brands fa-instagram" flat round color="accent" />
        <q-btn icon="fa-brands fa-youtube" flat round color="red" />
      </div>

      <div class="contacto">
        <div class="text-bold q-mb-sm">Contacto</div>
        <div class="text-caption">
          <q-icon name="email" class="q-mr-xs" /> colpromarket@gmail.com
        </div>
        <div class="text-caption">
          <q-icon name="phone" class="q-mr-xs" /> +57 123 456 7890
        </div>
        <div class="text-caption">
          <q-icon name="location_on" class="q-mr-xs" /> Santander, Colombia
        </div>
      </div>

      <div class="informacion">
        <div class="text-bold q-mb-sm">Información</div>
        <div class="text-caption">Envíos</div>
        <div class="text-caption">Política de devoluciones</div>
        <div class="text-caption">Nuestra marca</div>
        <div class="text-caption">Preguntas frecuentes</div>
      </div>

      <div class="legal">
        <div class="text-bold q-mb-sm">Legal</div>
        <div class="text-caption">Términos y condiciones</div>
        <div class="text-caption">Política de privacidad</div>
        <div class="text-caption">Cookies</div>
      </div>
    </div>

    <!-- Modal Login -->
    <q-dialog v-model="loginDialog" persistent>
      <q-card style="min-width: 500px; max-width: 600px">
        <q-card-section>
          <div class="text-h6">Iniciar sesión</div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="loginEmail"
            label="Correo Electrónico"
            type="email"
            :rules="[val => !!val || 'Campo obligatorio']"
          />
          <q-input 
            v-model="loginPassword" 
            label="Contraseña" 
            type="password"
            :rules="[val => !!val || 'Campo obligatorio']"
          />
        </q-card-section>

        <q-card-actions>
          <q-btn label="Cerrar" color="secondary" @click="Dialog('closeLogin')" />
          <q-btn label="Iniciar sesión" color="primary" @click="login" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Modal Register -->
    <q-dialog v-model="registerDialog" persistent>
      <q-card style="min-width: 400px; max-width: 600px">
        <q-card-section>
          <div class="text-h6">Registrarse</div>
        </q-card-section>

        <q-card-section>
          <q-input v-model="user.name" label="Nombre" type="text" />
          <q-input v-model="user.email" label="Correo Electrónico" type="email" />
          <q-input v-model="user.password" label="Contraseña" type="password" />
          <q-input v-model="user.ConfirmPassword" label="Confirmar Contraseña" type="password" />
        </q-card-section>

        <q-card-actions>
          <q-btn label="Cerrar" color="secondary" @click="Dialog('closeRegister')" />
          <q-btn label="Registrarse" color="primary" @click="registerUser()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup>
import { onMounted, ref, toRaw } from 'vue'
import { getData, postData } from '../service/service'
import { router } from '../routes/routes';
import ColorThief from 'colorthief';

const slide = ref(1);
const autoplay = ref(true);
const search = ref("");
const rightDrawerOpen = ref(false);
const loginDialog = ref(false);
const registerDialog = ref(false);
const loginEmail = ref("");
const loginPassword = ref("");
const productos = ref([]);
const user = ref({});


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

// Función para registrar usuario
async function registerUser() {
  try {
    if(user.value.password !== user.value.ConfirmPassword){
      throw new Error ('Contraseñas deben ser iguales')
    }
    console.log(user.value.name);
    const response = await postData("/users",{
      data:toRaw(user.value)
    })

    console.log(response);
    Dialog('closeRegister');

  }catch (error) {
    console.log(error.message);
  }
}


function login() {
  console.log('Iniciando sesión con:', loginEmail.value);
  Dialog('closeLogin');
}

// Función para cargar productos
async function products() {
  try {
    const response = await getData("/product");
    productos.value = response.data
  } catch (error) {
    console.error('Error al cargar productos:', error)
  }
}


function Dialog(action){
  switch (action){
    case "openLogin":
      loginDialog.value = true
    break;

    case "openRegister":
    registerDialog.value = true
    break;

    case "closeLogin":
    loginDialog.value = false
    break;

    case "closeRegister":
    registerDialog.value = false
    break;
  }
} 

// Función para agregar al carrito
const agregarAlCarrito = (producto) => {
  console.log('Agregado al carrito:', producto.nombre || producto.name);
  event.stopPropagation();
}

// Función para ver el detalle del producto
const verDetalleProducto = (producto) => {
  // Guardar información del producto en localStorage para usarla en la página de detalles
  if (producto && (producto.id || producto.name)) {
    localStorage.setItem('selectedProduct', JSON.stringify(producto));
  }
  // Redireccionar a la página de detalles
  window.location.href = 'http://localhost:5173/#/seeproduct';

  router.push({
    path:"/seeproduct", query:{data:JSON.stringify(producto)}
  });
}

onMounted(()=>{
  products();
})

</script>

<style scoped>
@import url("../style/Home.css");
</style>