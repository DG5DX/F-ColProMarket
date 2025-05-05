<template>
  <q-layout view="hHh lpR fFf">
    <!-- Drawer -->
    <q-drawer
      v-model="rightDrawerOpen"
      side="right"
      :show-if-above="false"
      :breakpoint="900"
      bordered
      class="custom-drawer"
    >
      <div class="drawer-header q-pa-md flex items-center">
        <img src="../assets/MiniLogo.jpeg" alt="Logo" class="mini-logo q-mr-md" />
        <h3 class="text-h6 q-ma-none">Menú</h3>
      </div>
      <q-separator />
      <q-list>
        <q-item clickable v-ripple class="drawer-item">
          <q-item-section>Productos</q-item-section>
        </q-item>
        <q-item clickable v-ripple class="drawer-item">
          <q-item-section>Comunidad</q-item-section>
        </q-item>
        <q-item clickable v-ripple class="drawer-item">
          <q-item-section>Rebajas</q-item-section>
        </q-item>
        <q-item clickable v-ripple class="drawer-item">
          <q-item-section>Contacto</q-item-section>
        </q-item>
        <hr />
        <q-item clickable v-ripple class="drawer-item" @click="Dialog('openRegister')">
          <q-item-section>Registrarse</q-item-section>
        </q-item>
        <q-item clickable v-ripple class="drawer-item" @click="Dialog('openLogin')">
          <q-item-section>Iniciar Sesión</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- Header -->
    <q-header elevated>
      <div id="app">
        <router-link to="/" id="logo" style="text-decoration: none;">
          <img src="../assets/Logo ColProMarket.jpeg" alt="logo" />
        </router-link>
        <div id="search">
          <q-input v-model="search" filled type="search" placeholder="Buscar">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
        <div id="nav-buttons">
          <q-btn-group push>
            <q-btn push label="Productos" color="grey" />
            <q-btn push label="Comunidad" color="grey" />
            <q-btn push label="Rebajas" color="grey" />
            <q-btn push label="Contacto" color="grey" />
          </q-btn-group>
        </div>
        <div id="menu">
          <q-btn color="dark" icon="menu" @click="rightDrawerOpen = !rightDrawerOpen" flat round />
        </div>
      </div>
    </q-header>

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
          >
            <q-carousel-slide
              :name="1"
              img-src="https://i.revistapym.com.co/cms/2023/11/16171723/Plantilla-nota-7.png?w=412&d=2.625"
            />
            <q-carousel-slide
              :name="2"
              img-src="https://imagenes.eltiempo.com/files/image_1200_600/uploads/2018/01/25/5a6a513f2f1fc.jpeg"
            />
            <q-carousel-slide
              :name="3"
              img-src="https://mir-s3-cdn-cf.behance.net/project_modules/fs/c1074d118179925.6084033e823f0.jpg"
            />
            <q-carousel-slide
              :name="4"
              img-src="https://newsletters.pcel.com/assets/templates/template-6633/banner-landing-dell-0203_2022.jpg"
            />
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

              <q-card-section class="text-h6">
                ${{ producto.price.toFixed(2) }}
              </q-card-section>

              <q-card-actions align="center">
                <q-btn color="primary" label="Agregar al carrito" @click="agregarAlCarrito(producto)" />
              </q-card-actions>
            </q-card>
          </div>
        </div>

      </div>
    </q-page-container>

    <!-- Footer -->
    <q-footer class="bg-white text-black q-pa-md">
      <div class="row justify-around items-start q-gutter-md full-width">
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
    </q-footer>

    <!-- Modales para login y registro -->
    <!-- Modal Login -->
    <q-dialog v-model="loginDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Iniciar sesión</div>
        </q-card-section>

        <q-card-section>
          <q-input v-model="loginEmail" label="Correo Electrónico" type="email" />
          <q-input v-model="loginPassword" label="Contraseña" type="password" />
        </q-card-section>

        <q-card-actions>
          <q-btn label="Cerrar" color="secondary" @click="Dialog('closeLogin')" />
          <q-btn label="Iniciar sesión" color="primary" @click="login" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Modal Register -->
    <q-dialog v-model="registerDialog">
      <q-card>
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

const slide = ref(1)
const autoplay = ref(true)
const search = ref('')
const rightDrawerOpen = ref(false)

const productos = ref([])

// States for login and register modals
const loginDialog = ref(false)
const registerDialog = ref(false)

const user = ref({});

async function registerUser() {
  try {
    if(user.value.password !== user.value.ConfirmPassword){
      throw new Error ('Constraine must be the same')
    }
    console.log(user.value.name);
    const response = await postData("/users",{
      data:toRaw(user.value)
    })

    console.log(response);

  }catch (error) {
    console.log(error.message);
  }
}


async function products() {
  try {
    const response = await getData("/product");
    productos.value = response.data
  } catch (error) {
    console.error('error when bringing products')
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



const agregarAlCarrito = (producto) => {
  console.log('Agregado al carrito:', producto.nombre)
}


onMounted(()=>{
  products();
})

</script>

<style scoped>
#app {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 5px;
  gap: 10px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

#logo img {
  max-height: 10vh;
  object-fit: contain;
}

.mini-logo {
  height: 40px;
  object-fit: contain;
  border-radius: 4px;
}

#search {
  flex: 1;
  min-width: 200px;
  max-width: 400px;
}

#nav-buttons {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
}

#menu {
  margin-left: auto;
}

.custom-drawer {
  background-color: #ffffff;
  color: #333;
  width: 260px;
  font-family: 'Roboto', sans-serif;
}

.drawer-header {
  background-color: #f1f1f1;
  padding: 16px;
  border-bottom: 1px solid #ddd;
}

.drawer-item {
  padding: 12px 16px;
  font-size: 16px;
  transition: background-color 0.2s ease;
}

.drawer-item:hover {
  background-color: #f0f0f0;
}

.drawer-item:active {
  background-color: #e0e0e0;
}

.productos-wrapper {
  background-color: #f0f0f0;
  overflow-x: auto;
}

.productos {
  flex-wrap: nowrap;
  overflow-x: auto;
  display: flex;
  white-space: nowrap;
}

.my-card {
  flex: 0 0 auto;
  width: 250px;
  text-align: center;
}


.q-carousel-slide {
  max-height: 500px;
}

.q-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-bottom: 1px solid #ccc;
}

@media (max-width: 900px) {
  #nav-buttons {
    display: none;
  }
  #menu {
    display: block;
  }
}

@media (max-width: 450px) {
  #logo img {
    max-height: 8vh;
  }
}
</style>
