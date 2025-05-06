<template>
  <q-layout view="hHh lpR fFf">
 

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
          </div>
          

          <div class="row1 ">
            <q-btn flat icon="favorite_border" label="Favoritos" />
            <q-btn flat icon="flag" label="Reportar" />
            <q-btn flat icon="share" label="Compartir" />
          </div>


       

          <!-- Sección de reseñas -->
          <div class="reviews">
            <div class="contemReviews">
              <label class="reviewsText">Reseñas</label>

              <!-- Lista de reseñas existentes -->
              <div v-for="(review, index) in producto.resenas" :key="index" class="RVW q-pa-md">
                <div class="flex items-center q-mb-sm">
                  <q-avatar color="primary" text-color="white" size="sm">
                    {{ review.usuario.charAt(0) }}
                  </q-avatar>
                  <span class="q-ml-sm text-weight-bold">{{ review.usuario }}</span>
                </div>
                
                <q-rating
                  v-model="review.calificacion"
                  size="1em"
                  color="black"
                  icon="star_border"
                  icon-selected="star"
                  readonly
                  class="q-mb-sm"
                />
                
                <div class="coment">{{ review.comentario }}</div>
              </div>

              <!-- Formulario para nueva reseña -->
              <div class="input-containerq-mt-lg">
                <div class="flex items-center q-gutter-sm q-mb-sm">
                  <span>Tu calificación:</span>
                  <q-rating
                    v-model="ratingModel"
                    max="5"
                    size="2em"
                    color="black"
                    icon="star_border"
                    icon-selected="star"
                  />
                </div>
                
                <q-input 
                  class="Testo"
                  v-model="nuevoComentario" 
                  placeholder="Escribe tu reseña..." 
                  outlined
                  type="textarea"
                  rows="3"
                >
                  <template v-slot:append>
                    <q-btn round dense flat icon="send" @click="agregarComentario" />
                  </template>
                </q-input>
              </div>
            </div>
          </div>
        </div>

        <div class="medium">
          <q-card class="bg-grey-3-q-pa-md" >
            <!-- Titulo -->
            <div class="text-h6 text-bold q-mb-sm">{{ (producto.nombre) }}</div>
            <!-- Precio -->
            <div class="text-h6 text-bold q-mb-sm">Precio: {{ formatearPrecio(producto.precio) }}</div>

            <!-- Entrega -->
            <div class="text-body2 q-mb-sm">
              Entrega <b>GRATIS</b> en todo el país, por compras superiores a $100.000 en artículos elegibles
            </div>

             <!-- Calificación -->
        <div class="row2-q-mb-md">
            <div class="flex ">
              <span class="text-subtitle1" style="color:black"><h3>{{ producto.calificacion }}</h3></span>
              <q-rating
                v-model="ratingProducto"
                size="3em"
                color="black"
                icon="star_border"
                icon-selected="star"
                readonly
              />
            </div>
          </div>

            <!-- Disponible -->
            <div :class="disponibilidadClase" class="text-subtitle2 q-mb-sm">{{ producto.disponibilidad }}</div>

            


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
          
          <br><br>
          <div class="contemMmedium">
            <!-- Descripción principal -->
            <div class="text-body1 q-mb-md">
              {{ producto.descripcion }}
            </div>

            

            <br>

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

      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useRoute } from 'vue-router'

const $q = useQuasar()
const route = useRoute()

// Variables de estado
const producto = ref({
  id: '',
  nombre: '',
  descripcion: '',
  precio: 0,
  calificacion: 0,
  disponibilidad: 'DISPONIBLE',
  imagenes: [],
  detalles: {},
  politicaDevolucion: 'Reintegro o Reemplazo en 30 días',
  resenas: []
})

const search = ref('')
const rightDrawerOpen = ref(false)
const cantidad = ref(1)
const cantidades = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const agregarRecibo = ref(false)
const nuevoComentario = ref('')
const imagenSeleccionada = ref('')
const ratingModel = ref(0)
const ratingProducto = ref(0)

// Funciones
const formatearPrecio = (precio) => {
  return '$' + precio.toLocaleString('es-CO')
}

const seleccionarImagen = (index) => {
  imagenSeleccionada.value = producto.value.imagenes[index]
}

const agregarComentario = () => {
  if (nuevoComentario.value.trim() === '') {
    $q.notify({
      message: 'Por favor escribe un comentario',
      color: 'negative',
      position: 'top'
    })
    return
  }

  producto.value.resenas.push({
    usuario: 'Usuario Anónimo',
    comentario: nuevoComentario.value,
    calificacion: ratingModel.value || 5
  })

  actualizarCalificacionPromedio()
  nuevoComentario.value = ''
  ratingModel.value = 0

  $q.notify({
    message: 'Reseña agregada con éxito',
    color: 'positive',
    position: 'top'
  })
}

const actualizarCalificacionPromedio = () => {
  if (producto.value.resenas.length === 0) {
    producto.value.calificacion = 0
    ratingProducto.value = 0
    return
  }
  
  const suma = producto.value.resenas.reduce((acc, review) => acc + review.calificacion, 0)
  producto.value.calificacion = parseFloat((suma / producto.value.resenas.length).toFixed(1))
  ratingProducto.value = producto.value.calificacion
}

const agregarAlCarrito = () => {
  $q.notify({
    message: `Agregado al carrito: ${cantidad.value} unidad(es)`,
    color: 'positive',
    position: 'top'
  })
}

const comprarAhora = () => {
  $q.notify({
    message: 'Procediendo al pago...',
    color: 'primary',
    position: 'top'
  })
}

const disponibilidadClase = computed(() => {
  return producto.value.disponibilidad === 'DISPONIBLE' ? 'text-positive' : 'text-negative'
})

const colorDetalles = (clave) => {
  const colores = {
    'Marca': 'text-primary',
    'Color': 'text-blue',
    'Stock': 'text-green',
    'Categoría': 'text-purple'
  }
  return colores[clave] || 'text-dark'
}

// Inicialización
onMounted(() => {
  const productoData = JSON.parse(route.query.data || '{}')
  
  if (productoData) {
    const imagenesMapeadas = productoData.images?.map(img => img.urlImage) || []
    
    producto.value = {
      id: productoData._id,
      nombre: productoData.name,
      descripcion: productoData.description,
      precio: productoData.price,
      imagenes: imagenesMapeadas,
      detalles: {
        'Marca': productoData.brand || 'Genérica',
        'Stock': productoData.stock || 0
      },
      resenas: productoData.reviews?.map(r => ({
        usuario: r.usuario || 'Anónimo',
        comentario: r.comentario,
        calificacion: r.calificacion || 5
      })) || []
    }
    
    imagenSeleccionada.value = imagenesMapeadas[0] || ''
    actualizarCalificacionPromedio()
  }
})
</script>
<style scoped>
@import url('../style/SEEPRODUCT.css');
</style>