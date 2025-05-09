<template>
  <q-layout view="hHh lpR fFf">
 

    <!-- Contenedor de página -->
    <q-page-container class="theContainer">
      <div class="ContainerMedium">
        <div class="start">
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
            <q-btn label="Comprar Ahora" class="bg-dark text-white full-width" unelevated @click="comprarAhora" />

            <!-- Checkbox -->
            <q-checkbox v-model="agregarRecibo" label="Agregar Recibo" class="q-mt-md"> <!--esto pasarlo para la vista de pago-->
              <template v-slot:after>
                <div class="text-caption text-orange-5 q-ml-sm">
                  Facilita la devolución del producto en cuestión
                </div>
              </template>
            </q-checkbox>

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
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar, Notify } from 'quasar'
import { useStore } from '../stores/store.js'
import { putData } from '../service/service.js'
const store = useStore()
import { useRoute } from 'vue-router'
const $q = useQuasar()
const route = useRoute()

// Variables de estado
const dataProduct = ref({});
const agregarRecibo = ref(false)
const review = ref('')
const selectedImage = ref('')
const productQualification = ref(0)

// Funciones
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
      console.log("data product al agregar reseña",dataProduct.value);
      console.log("reseña" , response.product);
    }

  } catch (error) {
    console.log(error);
    Notify.create({
        type:'negative',
        message:'Error al crear reseña'
      })
  }
}


const addToTheCart = (product) => {
  store.addToCart(product)
  Notify.create({
        type: "positive",
        message: "Producto agregado al carrito"
      })
  console.log('Agregado al carrito:', product);
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
})
</script>
<style scoped>
@import url('../style/SEEPRODUCT.css');
</style>