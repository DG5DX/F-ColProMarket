<template>
  <q-layout view="hHh lpR fFf" id="body">
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
        <img
          src="../assets/MiniLogo.jpeg"
          alt="Logo"
          class="mini-logo q-mr-md"
        />
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
        <hr />
        <q-item clickable v-ripple class="drawer-item" @click="Dialog('openRegister')">
          <q-item-section>Registrarse</q-item-section>
        </q-item>
        <q-item clickable v-ripple class="drawer-item" @click="Dialog('openLogin')">
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

        <q-item clickable v-ripple class="drawer-item">
          <q-item-section avatar>
            <q-icon name="local_mall" />
          </q-item-section>
          <q-item-section>
            <router-link to="/admin" style="text-decoration: none; color:inherit">Vender</router-link></q-item-section>
        </q-item>

        <q-separator class="q-my-sm" />
      </q-list>
    </q-drawer>

    <!-- Header -->
    <q-header elevated>
      <div id="app">
        <router-link to="/" id="logo" style="text-decoration: none">
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
          <q-btn
            color="dark"
            icon="menu"
            @click="rightDrawerOpen = !rightDrawerOpen"
            flat
            round
          />
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

              <q-card-section class="text-h6" style="color: red; font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">
                ${{ producto.price.toFixed(2) }}
              </q-card-section>

              <q-card-actions align="center">
                <q-btn color="grey" icon="visibility" />
                <q-btn color="primary" icon="shopping_cart" @click="agregarAlCarrito(producto)"
                />
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
                  <q-btn icon="visibility" color="grey" />
                  <q-btn icon="shopping_cart" color="primary"
                    @click="agregarAlCarrito(producto)"
                  />
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

const slide = ref(1);
const autoplay = ref(true);
const search = ref("");
const rightDrawerOpen = ref(false);

const productos = ref([])

const productosEspeciales = ref([
  {
    nombre: "Producto Especial 1",
    descripcion: "Descripción del producto especial 1.",
    precio: 299.99,
    imagen:
      "https://geprofile.lat/medias/1200Wx1200H-GEAppliances-Refrigeradores-755LT-Inoxidable-GNM26AETFSS-Izquierda.jpg?context=bWFzdGVyfHJvb3R8MjczODE4fGltYWdlL2pwZWd8YUdGbEwyZ3dZUzh4TVRVMU9EYzVOVEl4TkRnM09DOHhNakF3VjNneE1qQXdTRjlIUlVGd2NHeHBZVzVqWlhNdFVtVm1jbWxuWlhKaFpHOXlaWE10TnpVMVRGUXRTVzV2ZUdsa1lXSnNaUzFIVGsweU5rRkZWRVpUVXkxSmVuRjFhV1Z5WkdFdWFuQm58ODJhNWQ0OTU3NzFkMjNmYTQwNzI5ZmNhYzQwM2JhM2M5MjhkN2Q3ZTRkZmVjMzQ5ODhhNDdjMWM0NDFiYWU4Nw",
  },
  {
    nombre: "Producto Especial 2",
    descripcion: "Descripción del producto especial 2.",
    precio: 399.99,
    imagen:
      "https://panamericana.vtexassets.com/arquivos/ids/531492/impresora-todo-en-uno-hp-smart-tank-580-196068963507.jpg?v=638435460263070000",
  },
]);

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
#body {
  background: linear-gradient(
    to right,
    rgba(255, 255, 0, 0.5),
    rgba(0, 0, 255, 0.5),
    rgba(255, 0, 0, 0.5)
  );
}

#app {
  display: flex;
  justify-content: space-between;
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

#footer {
  background-color: #f9f9f9;
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
  display: flex;
  justify-content: center;
}

#nav-buttons {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  margin-left: 7vh;
}

#menu {
  margin-left: auto;
}

#header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.custom-drawer {
  background: linear-gradient(to bottom, #ffffff, #f9f9f9);
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
}

.drawer-header {
  background-color: #f1f1f1;
  padding: 5px;
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
  overflow-x: auto;
  margin-top: 3vh;
}

.productos {
  flex-wrap: wrap;
  overflow-x: auto;
  display: flex;
  white-space: nowrap;
  justify-content: space-evenly;
  background: rgba(255, 255, 255, 0.1);
}

.especial {
  display: grid;
  overflow-x: auto;
}

.especial .especial-card {
  display: flex;
  min-width: 330px;
  max-width: 40%;
  margin-right: 16px;
  vertical-align: top;
  flex-wrap: wrap;
}

.special {
  display: flex;
  width: 100%;
  height: 100%;
  padding: 0%;
}

.especial-card:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.especial-card .q-card-section.row {
  display: flex;
  flex-direction: row;
}

.especial-card .col.q-pa-md {
  padding: 16px;
}

.especial-card .text-h6 {
  font-weight: bold;
}

.especial-card .text-subtitle2 {
  margin-top: 5px;
  color: #666;
}

.especial-card .q-btn-group {
  margin-top: 15px;
}

.especial-card .q-btn {
  margin-bottom: 10px;
}

@media (max-width: 786px) {
  .especial .especial-card{
    min-width: 90%;
  }
  .especial-card .q-img {
    height: 150px !important;
  }
  .especial-card .q-card-section.row {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .especial-card .col.q-pa-md {
    padding: 16px 8px !important;
  }
  .especial-card .q-btn-group {
    flex-direction: column;
  }
  .especial-card .q-btn {
    margin-bottom: 8px;
  }
  .especial {
    margin-top: 20px;
  }
  .especial-card {
    margin-bottom: 20px;
  }
}

.my-card {
  flex: 0 0 auto;
  width: 250px;
  text-align: center;
}

.my-card:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.productos .q-btn {
  margin: 10px;
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

@media (max-width: 990px) {
  #nav-buttons {
    margin: 0%;
  }
  #menu {
    display: block;
  }
}

@media (max-width: 900px) {
  #nav-buttons {
    display: none;
  }
}

@media (max-width: 500px) {
  #logo img {
    max-height: 6vh;
  }
}
@media (max-width: 550px) {
  .especial .especial-card{
    min-width: 90%;
  }
}
</style>