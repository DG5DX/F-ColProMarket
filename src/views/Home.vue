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
    src: "https://media.about.nike.com/img/926f7aaf-ea24-4cea-a1ec-473c7dd16056/snkrs-showcase.jpeg?m=eyJlZGl0cyI6eyJqcGVnIjp7InF1YWxpdHkiOjEwMH0sIndlYnAiOnsicXVhbGl0eSI6MTAwfSwiZXh0cmFjdCI6eyJsZWZ0Ijo4NTAsInRvcCI6ODQ5LCJ3aWR0aCI6MTUwMSwiaGVpZ2h0Ijo5OTh9LCJyZXNpemUiOnsid2lkdGgiOjM4NDB9fX0%3D&s=5c9910ec7c174510040f154caa5ca9962b07f1dd09d48f7004fe69ea1b040747",
    alt: "Nike Showcase"
  },
  {
    src: "https://i.pinimg.com/736x/36/6a/f4/366af481af06ea25f237391aba3cca52.jpg",
    alt: "Gaming Laptop"
  },
  {
    src: "https://ocelot.com.mx/wp-content/uploads/2024/12/PHANTOM-HD-3.jpg",
    alt: "Phantom HD"
  },
  {
    src: "https://i.pinimg.com/736x/e8/c1/cc/e8c1cc33de371ba441feb9d041f63024.jpg",
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
/* Estilos optimizados para el carrusel */
.carrusel {
  width: 98%;
  margin: 1% auto;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}


.carrusel-slide {
  height: 100%;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
 
}

.carrusel-image-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  
}

.carrusel-image {
  width: 100%;
  height: auto;
  object-fit: contain; 
  max-height: 100%; 
    
}


.q-carousel-slide, .q-carousel {
  border-radius: 15px;
  box-shadow: none;
  border: none;
}


.q-carousel-slide,.q-carousel{
  border-radius: 15px;
  background-color: black;
  box-shadow: none;
  border: none;
}
.carrusel{
  margin-top: 1%;
}
#body {
  font-family: 'Roboto', sans-serif;
  background-color: #f5f5f5;
}

/* Header */
#app {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  background-color: white;
}

#logo img {
  height: 50px;
  object-fit: contain;
}

#search {
  flex: 1;
  margin: 0 30px;
}

#nav-buttons {
  display: none;
}

#menu {
  margin-left: 10px;
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

/* Contenedores de productos */
.productos-wrapper {
  overflow-x: hidden;
  margin-top: 3vh;
  width: 98%;
  margin-left: 1%;
  padding: 20px 0;
  border-radius: 15px;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.productos {
  flex-wrap: wrap;
  display: flex;
  justify-content: center;
  gap: 30px;
  padding: 20px;
}

.especial {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  margin-top: 30px;
}

/* Tarjetas de productos regulares */
.my-card {
  flex: 0 0 auto;
  width: 280px;
  text-align: center;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  background: white;
  position: relative;
  cursor: pointer; /* Cursor pointer para indicar que es clicable */
}

.my-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.15);
}

/* Imagen del producto */
.my-card .q-img {
  height: 220px !important;
  transition: transform 0.5s ease;
}

.my-card:hover .q-img {
  transform: scale(1.05);
}

/* Título del producto */
.my-card .text-h6 {
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 8px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Descripción del producto */
.my-card .text-subtitle2 {
  color: #666;
  font-size: 0.9rem;
  height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* Precio */
.my-card .text-h6[style*="color: red"] {
  font-size: 1.3rem;
  font-weight: bold;
  color: #e53935 !important;
  margin: 10px 0;
}

/* Botones */
.my-card .q-card-actions {
  padding: 8px 16px 16px;
  display: flex;
  justify-content: center;
  gap: 20px;
}

.my-card .q-btn {
  border-radius: 8px;
  transition: all 0.2s;
}

.my-card .q-btn[icon="shopping_cart"] {
  background: #1976d2;
  color: white;
  padding: 8px 12px;
}

.my-card .q-btn[icon="shopping_cart"]:hover {
  background: #0d47a1;
  transform: scale(1.05);
}

.my-card::before {
  content: "Nuevo";
  position: absolute;
  top: 10px;
  right: 10px;
  background: #e53935;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: bold;
  z-index: 1;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  opacity: 0;
  transform: translateX(10px);
  transition: all 0.3s ease;
}

.my-card:hover::before {
  opacity: 0.9;
  transform: translateX(0);
}

/* Tarjetas de productos especiales */
.especial-card {
  transition: all 0.3s ease;
  border-radius: 12px !important;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  background: linear-gradient(to bottom right, #ffffff, #f8f9fa);
  border: none !important;
  cursor: pointer; /* Cursor pointer para indicar que es clicable */
}

.especial-card:hover {
  transform: translateY(-5px) !important;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12) !important;
}

.especial-card .q-img {
  border-radius: 8px !important;
  overflow: hidden;
  transition: transform 0.5s;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
}

.especial-card:hover .q-img {
  transform: scale(1.03);
}

.especial-card .text-h6 {
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
  position: relative;
  padding-bottom: 8px;
}

.especial-card .text-h6::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 2px;
  background: #1976d2;
}

.especial-card .text-h6[style*="color: red"] {
  font-size: 1.4rem;
  color: #e53935 !important;
  margin: 12px 0;
}

.especial-card .text-subtitle2 {
  color: #666;
  line-height: 1.5;
  margin-bottom: 15px;
}

.especial-card .q-card-actions {
  margin-top: 5px;
}

.especial-card .q-btn {
  border-radius: 8px;
  transition: all 0.2s;
  margin: 0 5px;
}

.especial-card .q-btn[icon="shopping_cart"] {
  background: #1976d2;
  color: white;
  padding: 8px 15px;
}

.especial-card .q-btn[icon="shopping_cart"]:hover {
  background: #0d47a1;
  transform: scale(1.05);
}

/* Mejoras para efectos de clic */
.my-card:active, .especial-card:active {
  transform: scale(0.98) !important;
  transition: transform 0.1s;
}

/* Efecto de overlay al hacer hover para indicar que es clicable */
.my-card::after, .especial-card::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0);
  transition: background-color 0.3s ease;
  pointer-events: none;
  z-index: 1;
}

.my-card:hover::after, .especial-card:hover::after {
  background-color: rgba(0, 0, 0, 0.03);
}

/* Solo mantener el botón del carrito */
.my-card .q-card-actions, .especial-card .q-card-actions {
  padding: 8px 16px 16px;
  display: flex;
  justify-content: center;
}

/* Hacer que el botón del carrito se mantenga por encima para capturar su propio clic */
.my-card .q-btn, .especial-card .q-btn {
  z-index: 2;
  position: relative;
}

/* Responsive */
@media (max-width: 600px) {
  .my-card {
    width: 100%;
    max-width: 340px;
    margin: 0 auto;
  }
  
  .especial-card .text-h6::after {
    left: 50%;
    transform: translateX(-50%);
  }
}

.especial .especial-card{
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
    display: block;
  }

  #menu {
    display: none;
  }
}

/* Drawer */
.custom-drawer {
  background-color: #ffffff;
  width: 270px;
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

@media (max-width: 550px) {
  .especial .especial-card{
    min-width: 90%;
  }
}

.drawer-item {
  transition: background-color 0.2s;
}

.drawer-item:hover {
  background-color: #e0e0e0;
}

.mini-logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

/* Carrusel */
.carrusel {
  margin-top: 20px;
}

.q-carousel__slide img {
  border-radius: 8px;
}

/* Cards de productos */
.my-card,
.especial-card {
  border-radius: 12px;
  transition: transform 0.2s, box-shadow 0.2s;
  background-color: #ffffff;
}

.my-card:hover,
.especial-card:hover {
  transform: scale(1.03);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.text-h6 {
  font-weight: 600;
}

.productos-wrapper {
  background-color: #ffffff;
  padding: 40px 0;
}

/* Especiales */
.especial {
  background-color: #fafafa;
  padding-top: 30px;
}

.special {
  align-items: center;
}

/* Footer */
#footer {
  background-color: #212121;
  color: white;
  padding: 40px 20px;
}

#footer .text-bold {
  font-size: 1.1rem;
}

#footer .text-caption {
  color: #cfcfcf;
  margin-bottom: 5px;
}

#footer .q-btn {
  margin-right: 10px;
}

</style>