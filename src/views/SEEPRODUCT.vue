<template>
  <q-layout>
    <MainBar />
    <!-- Contenedor de página -->
    <q-page-container class="theContainer">
      <div class="ContainerMedium">
        <div class="start">
        <q-btn icon="arrow_back" style="margin: 5%;" to="/"></q-btn>
          <div class="boxOne">
            <div class="sideL">
              <img v-for="(image, index) in dataProduct.images" :key="index" :class="`thumbnail ${index + 1}`"
                :src="image.urlImage" @click="selectImage(index)" />
            </div>
            <div class="sideR">
              <img
  v-if="dataProduct.images && dataProduct.images.length" class="imG" :src="selectedImage || dataProduct.images[0].urlImage"/>
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
              <div v-for="(review, index) in dataProduct.reviews" :key="index" class="RVW q-pa-md">
                <div class="flex items-center q-mb-sm">
                  <q-avatar color="primary" text-color="white" size="sm">
                    {{ review.userId.name.charAt(0) }}
                  </q-avatar>
                  <span class="q-ml-sm text-weight-bold">{{ review.userId.name }}</span>
                </div>
                
                <q-rating
                  v-model="review.stars"
                  size="1em"
                  color="black"
                  icon="star_border"
                  icon-selected="star"
                  readonly
                  class="q-mb-sm"
                />
                
                <div class="coment">{{ review.message }}</div>
              </div>

              <!-- Formulario para nueva reseña -->
              <div class="input-containerq-mt-lg">
                <div class="flex items-center q-gutter-sm q-mb-sm">
                  <span>Tu calificación:</span>
                  <q-rating
                    v-model="productQualification"
                    max="5"
                    size="2em"
                    color="black"
                    icon="star_border"
                    icon-selected="star"
                  />
                </div>
                
                <q-input 
                  class="Testo"
                  v-model="review" 
                  placeholder="Escribe tu reseña..." 
                  outlined
                  type="textarea"
                  rows="3"
                >
                  <template v-slot:append>
                    <q-btn round dense flat icon="send" @click="addReview(dataProduct._id)" />
                  </template>
                </q-input>
              </div>
            </div>
          </div>
        </div>

        <div class="medium">
          <q-card class="bg-grey-3-q-pa-md" >
            <!-- Titulo -->
            <div class="text-h6 text-bold q-mb-sm">{{ (dataProduct.name) }}</div>
            <!-- Precio -->
            <div class="text-h6 text-bold q-mb-sm">Precio: {{ formatPrice(dataProduct.price || 1500) }}</div>

            <!-- Entrega -->
            <div class="text-body2 q-mb-sm">
              Entrega <b>GRATIS</b> en todo el país, por compras superiores a $100.000 en artículos elegibles
            </div>

             <!-- Calificación -->
        <div class="row2-q-mb-md">
            <div class="flex ">
              <span class="text-subtitle1" style="color:black"><h3>{{ dataProduct.averageRating }}</h3></span>
              <q-rating
                v-model="dataProduct.averageRating"
                size="3em"
                color="black"
                icon="star_border"
                icon-selected="star"
                readonly
              />
            </div>
          </div>

            <!-- Disponible -->
            <div :class="isProductAvailable" class="text-subtitle2 q-mb-sm"> <p>Quedan {{ dataProduct.stock }}</p></div>

            


            <div class="text-blue">Devoluciones:</div>
            <div class="q-mb-md">{{ dataProduct.acceptReturns === 'si' ? 'Se aceptan devoluciones' : 'No se aceptan devoluciones' }}</div>

            <!-- Botones -->
            <q-btn label="Agregar al carrito" class="bg-dark text-white full-width q-mb-sm" unelevated
              @click="addToTheCart(dataProduct)" />

            <!-- Notificación --- si se usa esto ay que crear una coleccion --> 
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
              {{ dataProduct.description }}
            </div>
          </div>
        </div>

      </div>
      <div class="productos-wrapper">
  <div class="productos row q-gutter-xl justify-start q-pa-xl">
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
      <div class="card-title">{{ producto.name }}</div>
      <div class="card-subtitle">{{ producto.description }}</div>
      <hr class="card-divider">
      <div class="card-footer">
        <div class="card-price"><span>$</span> {{ producto.price.toFixed(2) }}</div>
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
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar, Notify } from 'quasar'
import { useStore } from '../stores/store.js'
import { putData } from '../service/service.js'
const store = useStore()
import { useRoute, useRouter } from 'vue-router' // Añade useRouter
const $q = useQuasar()
const route = useRoute()
const router = useRouter() // Añade router

// Variables de estado
const dataProduct = ref({});
const agregarRecibo = ref(false)
const review = ref('')
const selectedImage = ref('')
const productQualification = ref(0)
const productos = ref([]);

// Función para cargar productos (copiada del primer componente)
async function products() {
  try {
    const response = await getData("/product");
    productos.value = response.data
  } catch (error) {
    console.error('Error al cargar productos:', error)
  }
}

// Función para agregar al carrito (copiada del primer componente)
const addToTheCart = (producto) => {
  store.addToCart(producto)
  Notify.create({
    type: "positive",
    message: "Producto agregado al carrito"
  })
  console.log('Agregado al carrito:', producto.name);
}

// Función para ver el detalle del producto (similar a la del primer componente)
const verDetalleProducto = (producto) => {
  if (producto && (producto.id || producto.name)) {
    localStorage.setItem('selectedProduct', JSON.stringify(producto));
  }
  router.push({
    path:"/seeproduct", 
    query:{data:JSON.stringify(producto)}
  });
}

// Resto de tus funciones existentes...
const formatPrice = (precio) => {
  return '$' + precio.toLocaleString('es-CO')
}

const selectImage = (index) => {
  selectedImage.value = dataProduct.value.images[index].urlImage
}

async function addReview(id){
  try {
    const response = await putData(`/product/reviews/${id}`,{
      userId:store.userId,
      stars:productQualification.value,
      message:review.value
    })

    if(response){
      Notify.create({
        type:'positive',
        message:'Reseña guardada'
      })
      dataProduct.value.reviews = response.product.reviews
    }
  } catch (error) {
    console.log(error);
    Notify.create({
      type:'negative',
      message:'Error al crear reseña'
    })
  }
}

const comprarAhora = () => {
  $q.notify({
    message: 'Procediendo al pago...',
    color: 'primary',
    position: 'top'
  })
}

const isProductAvailable = computed(() => {
  return dataProduct.value.Stock >= 0 ? 'text-positive' : 'text-negative'
})

function obtainDataProduct(){
  dataProduct.value = JSON.parse(route.query.data || '{}')
  console.log("detalles del producto" , dataProduct);
}

// Inicialización
onMounted(() => {
  obtainDataProduct();
  products(); // Llama a la función para cargar productos al montar el componente
})
</script>
<style scoped>
@import url('../style/SEEPRODUCT.css');
</style>