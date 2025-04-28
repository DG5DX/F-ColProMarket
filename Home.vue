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
    <q-item-section avatar>
      <q-icon name="shopping_bag" />
    </q-item-section>
    <q-item-section>Productos</q-item-section>
  </q-item>

  <q-item clickable v-ripple class="drawer-item">
    <q-item-section avatar>
      <q-icon name="groups" />
    </q-item-section>
    <q-item-section>Comunidad</q-item-section>
  </q-item>

  <q-item clickable v-ripple class="drawer-item">
    <q-item-section avatar>
      <q-icon name="local_offer" />
    </q-item-section>
    <q-item-section>Rebajas</q-item-section>
  </q-item>

  <q-item clickable v-ripple class="drawer-item">
    <q-item-section avatar>
      <q-icon name="contact_mail" />
    </q-item-section>
    <q-item-section>Contacto</q-item-section>
  </q-item>

  <q-separator class="q-my-sm" />

  <q-item clickable v-ripple class="drawer-item" @click="openRegisterDialog">
    <q-item-section avatar>
      <q-icon name="person_add" />
    </q-item-section>
    <q-item-section>Registrarse</q-item-section>
  </q-item>

  <q-item clickable v-ripple class="drawer-item" @click="openLoginDialog">
    <q-item-section avatar>
      <q-icon name="login" />
    </q-item-section>
    <q-item-section>Iniciar Sesión</q-item-section>
  </q-item>

  <q-separator class="q-my-sm" />

  <q-item clickable v-ripple class="drawer-item">
    <q-item-section avatar>
      <q-icon name="help_outline" />
    </q-item-section>
    <q-item-section>Ayuda</q-item-section>
  </q-item>

  <q-item clickable v-ripple class="drawer-item">
    <q-item-section avatar>
      <q-icon name="wallet" />
    </q-item-section>
    <q-item-section>Metodo De Pago</q-item-section>
  </q-item>

  <q-item clickable v-ripple class="drawer-item">
    <q-item-section avatar>
      <q-icon name="shopping_cart" />
    </q-item-section>
    <q-item-section>Carrito</q-item-section>
  </q-item>

  <q-separator class="q-my-sm" />
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
                  :src="producto.imagen"
                  :alt="producto.nombre"
                  style="height: 200px;"
                  fit="cover"
                >
                  <template v-slot:loading>
                    <q-spinner color="primary" />
                  </template>
                </q-img>
              </q-card-section>

              <q-card-section>
                <div class="text-h6">{{ producto.nombre }}</div>
                <div class="text-subtitle2 text-grey">{{ producto.descripcion }}</div>
              </q-card-section>

              <q-card-section class="text-h6">
                ${{ producto.precio.toFixed(2) }}
              </q-card-section>

              <q-card-actions align="center">
                <q-btn color="primary" label="Agregar al carrito" @click="agregarAlCarrito(producto)" />
              </q-card-actions>
            </q-card>
          </div>
        </div>
      </div>

      <div>

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

    <!-- Modal Login -->
    <q-dialog v-model="loginDialog" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">Iniciar sesión</div>
        </q-card-section>

        <q-card-section>
          <q-input v-model="loginEmail" label="Correo Electrónico" type="email" />
          <q-input v-model="loginPassword" label="Contraseña" type="password" />
        </q-card-section>

        <q-card-actions>
          <q-btn label="Cerrar" color="secondary" @click="closeLoginDialog" />
          <q-btn label="Iniciar sesión" color="primary" @click="login" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Modal Register -->
    <q-dialog v-model="registerDialog" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">Registrarse</div>
        </q-card-section>

        <q-card-section>
          <q-input v-model="registerName" label="Nombre"></q-input>
          <q-select v-model="registerType" :options="registerTypeOptions" label="Tipo de Usuario"></q-select>
          <q-input v-model="registerEmail" label="Correo Electrónico" type="email" />
          <q-input v-model="registerPassword" label="Contraseña" type="password" />
          <q-input v-model="registerConfirmPassword" label="Confirmar Contraseña" type="password" />
        </q-card-section>

        <q-card-actions>
          <q-btn label="Cerrar" color="secondary" @click="closeRegisterDialog" />
          <q-btn label="Registrarse" color="primary" @click="register" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'

const slide = ref(1)
const autoplay = ref(true)
const search = ref('')
const rightDrawerOpen = ref(false)

const productos = ref([
  {
    nombre: 'Producto A',
    descripcion: 'Descripción del producto A.',
    precio: 19.99,
    imagen: 'https://www.pcware.com.co/wp-content/uploads/2018/05/delloptiplexaio.jpg'
  },
  {
    nombre: 'Producto B',
    descripcion: 'Descripción del producto B.',
    precio: 29.99,
    imagen: 'https://centraldesuministrosgs.com/wp-content/uploads/2022/02/totto-morral-con-porta-pc-ribbon-negro-negro-black-negro-negro-black_1-1.jpg'
  },
  {
    nombre: 'Producto C',
    descripcion: 'Descripción del producto C.',
    precio: 9.99,
    imagen: 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/3bbecbdf584e40398446a8bf0117cf62_9366/Tenis_Samba_OG_Blanco_B75806_01_00_standard.jpg'
  },
  {
    nombre: 'Producto D',
    descripcion: 'Descripción del producto D.',
    precio: 39.99,
    imagen: 'https://www.pcware.com.co/wp-content/uploads/2018/05/delloptiplexaio.jpg'
  }
])

// States for login and register modals
const loginDialog = ref(false)
const registerDialog = ref(false)

const registerName = ref('')
const registerType = ref('')
const registerTypeOptions = ref(['Usuario', 'Administrador'])
const loginEmail = ref('')
const loginPassword = ref('')
const registerEmail = ref('')
const registerPassword = ref('')
const registerConfirmPassword = ref('')

const openLoginDialog = () => {
  loginDialog.value = true
}

const openRegisterDialog = () => {
  registerDialog.value = true
}

const closeLoginDialog = () => {
  loginDialog.value = false
}

const closeRegisterDialog = () => {
  registerDialog.value = false
}

const login = () => {
  console.log(`Iniciar sesión con ${loginEmail.value} y ${loginPassword.value}`)
  closeLoginDialog()
}

const register = () => {
  console.log(`Registrarse con ${registerEmail.value}, ${registerPassword.value} y ${registerConfirmPassword.value}`)
  closeRegisterDialog()
}

const agregarAlCarrito = (producto) => {
  console.log('Agregado al carrito:', producto.nombre)
}
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
  background: linear-gradient(to bottom, #ffffff, #f9f9f9);
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
}

.drawer-header {
  background-color: #f1f1f1;
  padding: 16px;
  border-bottom: 1px solid #ddd;
}

.drawer-item {
  padding: 10px 16px;
  font-size: 15px;
  border-radius: 8px;
  margin: 4px 8px;
  transition: background-color 0.2s ease;
}

.drawer-item:hover {
  background-color: #f5f5f5;
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

@media (max-width: 500px) {
  #logo img {
    max-height: 6vh;
  }
}
</style>
