<template>
  <q-layout view="hHh lpR fFf">
    <!-- Drawer -->
    <q-drawer v-model="rightDrawerOpen" side="right" :show-if-above="false" :breakpoint="900" bordered
            class="custom-drawer">
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


    <!-- Contenedor de página -->
    <q-page-container class="theContainer">
      <div class="ContainerMedium">
        <div class="start">
          <div class="boxOne">
            <div class="sideL">
              <img v-for="(imagen, index) in producto.imagenes" :key="index" :class="`thumbnail ${index + 1}`"
                :src="imagen" @click="seleccionarImagen(index)" />
            </div>
            <div class="sideR">
              <img class="imG" :src="imagenSeleccionada" />
            </div>
          </div><br><br>

          <div class="row justify-around full-width">
            <q-btn flat icon="favorite_border" label="Favoritos" />
            <q-btn flat icon="flag" label="Reportar" />
            <q-btn flat icon="share" label="Compartir" />
          </div>

          <div class="reviews">
            <div class="contemReviews">
              <br><br><label class="reviewsText">Reseñas</label>

              <div v-for="(review, index) in producto.resenas" :key="index" class="RVW"><br>
                <label>{{ review.usuario }}</label><br>
                <label class="coment">{{ review.comentario }}</label>
              </div>

              <br><br>
              <div class="input-container">
                <q-input class="inputText" v-model="nuevoComentario" placeholder="Escribir comentario" outlined>
                  <template v-slot:append>
                    <q-btn round dense flat icon="send" @click="agregarComentario" />
                  </template>
                </q-input>
              </div>
            </div>
          </div>
        </div>

        <div class="medium"><br><br>
          <div class="contemMmedium">
            <!-- Descripción principal -->
            <div class="text-body1 q-mb-md">
              {{ producto.descripcion }}
            </div>

            <!-- Calificación -->
            <div class="row items-center q-gutter-sm q-mb-md">
              <div class="q-px-sm q-py-xs text-subtitle1 bg-yellow text-dark"
                style="border: 2px solid black; border-radius: 8px;">
                {{ producto.calificacion }} {{ mostrarEstrellas(producto.calificacion) }}
              </div>
            </div>

            <!-- Precio -->
            <div class="text-h6 text-bold q-mb-md">
              {{ formatearPrecio(producto.precio) }}
            </div>

            <!-- Modelos -->
            <div class="text-subtitle2 text-center q-mb-sm">MODELOS</div>
            <div class="row">
              <img v-for="(imagen, index) in producto.imagenes" :key="index" :class="`modelo ${index + 1}`"
                :src="imagen" @click="seleccionarImagen(index)" />
            </div><br>

            <!-- Detalles del producto -->
            <q-card class="bg-grey-3 q-pa-md">
              <div class="text-subtitle2 text-negative q-mb-sm">Detalles</div>
              <div v-for="(valor, clave) in producto.detalles" :key="clave" class="q-mb-sm">
                <span class="text-bold" :class="colorDetalles(clave)">{{ clave }}:</span> {{ valor }}
              </div>

              <div class="q-mt-md text-bold text-red">Sobre este artículo</div>
              <div class="q-mt-sm" v-html="producto.sobreEsteArticulo"></div>
            </q-card>
          </div>
        </div>

        <div class="end">
          <q-card class="bg-grey-3-q-pa-md" style="max-width: 300px">
            <!-- Precio -->
            <div class="text-h6 text-bold q-mb-sm">Precio: {{ formatearPrecio(producto.precio) }}</div>

            <!-- Entrega -->
            <div class="text-body2 q-mb-sm">
              Entrega <b>GRATIS</b> en todo el país, por compras superiores a $100.000 en artículos elegibles
            </div>

            <!-- Disponible -->
            <div :class="disponibilidadClase" class="text-subtitle2 q-mb-sm">{{ producto.disponibilidad }}</div>

            <!-- Selector de cantidad -->
            <q-select filled v-model="cantidad" :options="cantidades" label="Cantidad" dense class="q-mb-md" />

            <!-- Información de envío -->
            <div class="text-blue">Enviado por:</div>
            <div class="q-mb-sm">{{ producto.enviadoPor }}</div>

            <div class="text-blue">Vendido por:</div>
            <div class="q-mb-sm">{{ producto.vendidoPor }}</div>

            <div class="text-blue">Devoluciones:</div>
            <div class="q-mb-md">{{ producto.politicaDevolucion }}</div>

            <!-- Botones -->
            <q-btn label="Agregar al carrito" class="bg-dark text-white full-width q-mb-sm" unelevated
              @click="agregarAlCarrito" />
            <q-btn label="Comprar Ahora" class="bg-dark text-white full-width" unelevated @click="comprarAhora" />

            <!-- Checkbox -->
            <q-checkbox v-model="agregarRecibo" label="Agregar Recibo" class="q-mt-md">
              <template v-slot:after>
                <div class="text-caption text-orange-5 q-ml-sm">
                  Facilita la devolución del producto en cuestión
                </div>
              </template>
            </q-checkbox>

            <!-- Notificación -->
            <div class="row items-center q-mt-md">
              <q-icon name="notifications_none" size="md" class="q-mr-sm" />
              <div class="text-caption">
                Recibe notificaciones del estado de tu compra
              </div>
            </div>
          </q-card>
        </div>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'


const $q = useQuasar()

// Array con la información del producto
const productos = [
  {
    id: 1,
    nombre: 'BERIBES Auriculares Bluetooth',
    descripcion: 'BERIBES Auriculares Bluetooth sobre la oreja, tiempo de reproducción de 65 horas y 3 modos de música ecualizador, auriculares inalámbricos con micrófono, auriculares estéreo de alta fidelidad plegables ligeros, graves profundos para el hogar, oficina, teléfono celular, PC y TV',
    precio: 358000,
    calificacion: 4.0,
    disponibilidad: 'DISPONIBLE',
    imagenes: [
      'https://www.compudemano.com/wp-content/uploads/2022/01/auriculares-inalambricos-belkin-de-diadema-para-ninos-azul-1.png.webp',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGaYXDiuQWqfV3VwFb7mu5BLbVUkQQRM8Vu9TMA8Okc7l0qhjecq6JOUvmCFeb4j_PTZo&usqp=CAU',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpyCnc-YSBzhS61Im2MO8AIJxSIvMJ7jRNVmacXDHRV16XjWAVXc7c3zaMItuj4J7-1io&usqp=CAU',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTeLvoKxl7mbXOrVdh5NO6EEokKE4Kwkp8Vr7WFZIbzOEFeTo6eNMx3jrIvIVEwWNMyYjk&usqp=CAU'
    ],
    detalles: {
      'Marca': 'BERIBES',
      'Color': 'Negro',
      'Impedancia': '2215 ohmio',
      'Conectividad': 'Bluetooth 5.0',
      'Autonomía': '65 horas'
    },
    sobreEsteArticulo: '🔥 <strong>[ 3 modos de música opcionales]</strong> Simplemente cambia los auriculares entre sonido equilibrado, graves extra potentes y modos de mejora de agudos medios. BERIBES siempre se ha comprometido a proporcionar a nuestros clientes una mejor calidad de sonido como el punto focal de nuestra ingeniería.',
    enviadoPor: 'ColProMarket',
    vendidoPor: 'Capibara.inc',
    politicaDevolucion: 'Reintegro o Reemplazo en 30 días',
    resenas: [
      {
        usuario: 'Roberto Rodriguez',
        comentario: 'Excelente producto, me gustó, es de muy buena calidad.'
      }
    ]
  },

]

const search = ref('')
const rightDrawerOpen = ref(false)
const producto = ref(productos[0])
const cantidad = ref(1)
const cantidades = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const agregarRecibo = ref(false)
const nuevoComentario = ref('')
const imagenSeleccionada = ref(productos[0].imagenes[0])
const menuItems = ['Productos', 'Comunidad', 'Rebajas', 'Contacto']


const formatearPrecio = (precio) => {
  return '$' + precio.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}


const mostrarEstrellas = (calificacion) => {
  const estrellas = '★★★★★'
  return estrellas.substring(0, Math.floor(calificacion))
}


const seleccionarImagen = (index) => {
  imagenSeleccionada.value = producto.value.imagenes[index]
}

// Función para agregar un comentario
const agregarComentario = () => {
  if (nuevoComentario.value.trim() === '') return

  producto.value.resenas.push({
    usuario: 'Usuario',
    comentario: nuevoComentario.value
  })

  nuevoComentario.value = ''

  $q.notify({
    message: 'Comentario agregado con éxito',
    color: 'positive',
    position: 'top',
    timeout: 2000
  })
}

// Función para agregar al carrito
const agregarAlCarrito = () => {
  $q.notify({
    message: `${cantidad.value} ${cantidad.value > 1 ? 'unidades' : 'unidad'} agregada al carrito`,
    color: 'positive',
    position: 'top',
    timeout: 2000
  })
}

// Función para comprar ahora
const comprarAhora = () => {
  $q.notify({
    message: 'Redirigiendo al proceso de compra...',
    color: 'primary',
    position: 'top',
    timeout: 2000
  })
}


const disponibilidadClase = computed(() => {
  return producto.value.disponibilidad === 'DISPONIBLE' ? 'text-positive' : 'text-negative'
})

// Función para asignar color según el tipo de detalle
const colorDetalles = (clave) => {
  const colores = {
    'Marca': 'text-primary',
    'Color': 'text-blue',
    'Impedancia': 'text-indigo',
    'Conectividad': 'text-purple',
    'Autonomía': 'text-deep-orange'
  }
  return colores[clave] || 'text-dark'
}
</script>

<style scoped>
.row {
  display: grid;
  grid-template-columns: 25% 25% 25% 25%;
}

.contemMmedium {
  width: 90%;
  margin-left: 10%;
}

.bg-grey-3-q-pa-md {
  background: gainsboro;
  margin-left: 20%;
  margin-top: 10%;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
}

.coment {
  font-size: large;
}

.input-container {
  width: 90%;
  margin: 0 auto;
}

.inputText {
  width: 400%;
}

.RVW {
  background: white;
  border-radius: 10px;
  width: 80%;
  min-height: 100px;
  margin: 10px auto;
  padding: 15px;
  text-align: start;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.reviewsText {
  font-size: x-large;
  font-weight: bold;
}

.contemReviews {
  background: #f5f5f5;
  border-radius: 10px;
  width: 90%;
  min-height: 50vh;
  margin: 30px auto;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.thumbnail,.modelo {
  width: 70%;
  border-radius: 10px;
  border: 1px solid #2196F3;
  cursor: pointer;
  margin: 10px 0px 0px 15px;
  transition: all 0.3s ease;
}.thumbnail:hover,.modelo:hover {
  border: 1px solid #F44336;
  transform: scale(1.05);
}

.sideL {
  display: grid;
  grid-template-rows: 25% 25% 25% 25%;
  gap: 5px;
}

.boxOne {
  display: grid;
  grid-template-columns: 20% 80%;
  height: 350px;
}

.imG {
  width: 80%;
  border-radius: 10px;
  border: 2px solid #2196F3;
  margin: 30px 0px 0px 50px;
  cursor: pointer;
  transition: transform 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.imG:hover {
  border: 2px solid #F44336;
  transform: scale(1.02);
}

.ContainerMedium {
  margin-top: 2%;
  width: 100%;
  min-height: 100vh;
  background-color: white;
  display: grid;
  grid-template-columns: 33% 34% 33%;
}

.q-img {
  cursor: pointer;
  border-radius: 8px;
}

.start {
  border-right: 1px gray solid;
  padding-right: 15px;
}

.text-bold {
  font-weight: bold;
}

.bg-yellow {
  background-color: #FFEB3B;
}

@media (max-width: 768px) {
  .ContainerMedium {
    grid-template-columns: 100%;
  }

  .start,
  .medium,
  .end {
    width: 95%;
    margin: 0 auto;
    border-right: none;
    border-bottom: 1px solid gray;
    padding-bottom: 20px;
  }

  .boxOne {
    grid-template-columns: 30% 70%;
  }

  .contemMmedium {
    width: 95%;
    margin-left: 2.5%;
  }

  .bg-grey-3-q-pa-md {
    margin-left: 2.5%;
    width: 95%;
  }
}
</style>