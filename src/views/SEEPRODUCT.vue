<template>
  <q-layout>
    <mainBar @open-register-dialog="registerDialog = true" @open-logIn-dialog="loginDialog = true" />
    
    <q-page-container class="product-page-container">
      <!-- Botón de regreso -->
      <q-btn 
        icon="arrow_back" 
        flat 
        round 
        dense 
        class="back-btn"
        to="/"
      />
      
      <!-- Contenido principal -->
      <div class="product-container">
        <!-- Sección izquierda - Galería y reseñas -->
        <div class="left-section">
          <!-- Galería de imágenes -->
          <q-card class="gallery-card">
            <div class="gallery-container">
              <!-- Imagen principal -->
              <q-img
                :src="selectedImage || (dataProduct.images && dataProduct.images[0]?.urlImage)"
                :ratio="1"
                class="main-image"
                spinner-color="primary"
              />
              
              <!-- Miniaturas -->
              <div class="thumbnails">
                <q-img
                  v-for="(image, index) in dataProduct.images"
                  :key="index"
                  :src="image.urlImage"
                  :ratio="1"
                  class="thumbnail"
                  :class="{ 'thumbnail-active': selectedImage === image.urlImage }"
                  @click="selectImage(index)"
                />
              </div>
            </div>
          </q-card>
          
          <!-- Acciones secundarias -->
          <div class="secondary-actions">
            <q-btn 
              flat 
              icon="favorite_border" 
              label="Favoritos" 
              class="action-btn"
            />
            <q-btn 
              flat 
              icon="share" 
              label="Compartir" 
              class="action-btn"
            />
          </div>
          
          <!-- Reseñas -->
          <q-card class="reviews-card">
            <q-card-section>
              <div class="text-h6">Reseñas ({{ dataProduct.reviews?.length || 0 }})</div>
              
              <!-- Promedio de calificaciones -->
              <div class="rating-summary">
                <div class="average-rating">
                  <span class="rating-value">{{ dataProduct.averageRating?.toFixed(1) || 0 }}</span>
                  <q-rating
                    v-model="dataProduct.averageRating"
                    size="1.5em"
                    color="orange"
                    icon="star_border"
                    icon-selected="star"
                    readonly
                  />
                </div>
              </div>
              
              <!-- Lista de reseñas -->
              <div class="reviews-list">
                <div 
                  v-for="(review, index) in dataProduct.reviews" 
                  :key="index"
                  class="review-item"
                >
                  <div class="review-header">
                    <q-avatar color="primary" text-color="white">
                      {{ review.userId?.name?.charAt(0) || 'U' }}
                    </q-avatar>
                    <div class="review-user">
                      <div class="user-name">{{ review.userId?.name || 'Usuario' }}</div>
                      <q-rating
                        v-model="review.stars"
                        size="1em"
                        color="orange"
                        icon="star_border"
                        icon-selected="star"
                        readonly
                      />
                    </div>
                    <div class="review-date">
                      {{ formatDate(review.createdAt) }}
                    </div>
                  </div>
                  <div class="review-content">
                    {{ review.message }}
                  </div>
                </div>
              </div>
              
              <!-- Formulario para nueva reseña -->
              <div class="new-review">
                <div class="text-subtitle1 q-mb-sm">Deja tu reseña</div>
                <div class="rating-input">
                  <span class="q-mr-sm">Calificación:</span>
                  <q-rating
                    v-model="productQualification"
                    size="2em"
                    color="orange"
                    icon="star_border"
                    icon-selected="star"
                  />
                </div>
                <q-input
                  v-model="review"
                  outlined
                  type="textarea"
                  placeholder="Escribe tu reseña..."
                  class="q-mt-md"
                  rows="3"
                />
                <q-btn
                  label="Enviar reseña"
                  color="primary"
                  class="q-mt-md"
                  @click="addReview(dataProduct._id)"
                  :disable="!review || productQualification === 0"
                />
              </div>
            </q-card-section>
          </q-card>
        </div>
        
        <!-- Sección derecha - Información del producto -->
        <div class="right-section">
          <q-card class="info-card">
            <q-card-section>
              <!-- Nombre y marca -->
              <div class="product-header">
                <div class="text-h4 product-name">{{ dataProduct.name }}</div>
                <div class="text-subtitle1 brand" v-if="dataProduct.brand">{{ dataProduct.brand }}</div>
              </div>
              
              <!-- Precio -->
              <div class="price-section">
                <div class="text-h4 price">{{dataProduct.price }}</div>
                <div class="text-caption price-note">Precio incluye IVA</div>
              </div>
              
              <!-- Disponibilidad -->
              <div class="availability" :class="isProductAvailable">
                <q-icon :name="dataProduct.stock > 0 ? 'check_circle' : 'cancel'" />
                <span v-if="dataProduct.stock > 0">Disponible ({{ dataProduct.stock }} en stock)</span>
                <span v-else>Agotado</span>
              </div>
              
              <!-- Entrega -->
              <div class="delivery-info">
                <q-icon name="local_shipping" size="sm" />
                <span>Envío <strong>GRATIS</strong> en compras superiores a $100.000</span>
              </div>
              
              <!-- Devoluciones -->
              <div class="returns-info">
                <q-icon 
                  :name="dataProduct.acceptReturns === 'si' ? 'assignment_return' : 'block'" 
                  size="sm" 
                  :color="dataProduct.acceptReturns === 'si' ? 'positive' : 'negative'"
                />
                <span>
                  {{ dataProduct.acceptReturns === 'si' ? 'Devoluciones aceptadas' : 'No se aceptan devoluciones' }}
                </span>
              </div>
              
              <!-- Botones de acción -->
              <div class="action-buttons">
                <q-btn
                  label="Agregar al carrito"
                  color="primary"
                  icon="shopping_cart"
                  class="full-width q-mb-sm"
                  :disable="dataProduct.stock <= 0"
                  @click="addToTheCart(dataProduct)"
                />
                
              </div>
              
              <!-- Notificaciones -->
              <div class="notification-preference">
                <q-checkbox v-model="notifyMe" label="Recibir notificaciones sobre este producto" />
              </div>
            </q-card-section>
          </q-card>
          
          <!-- Descripción del producto -->
          <q-card class="description-card">
            <q-card-section>
              <div class="text-h6">Descripción</div>
              <div class="product-description">
                {{ dataProduct.description || 'No hay descripción disponible.' }}
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
      
      <!-- Productos relacionados -->
      <div class="related-products">
        <div class="text-h4 related-title">Productos similares</div>
        
        <div class="products-grid">
          <q-card
            v-for="(producto, index) in productos"
            :key="index"
            class="product-card"
            @click="verDetalleProducto(producto) ; scrollToTopInstant()"
          >
            <q-img
              :src="producto.images[0]?.urlImage"
              :ratio="1"
              class="product-image"
              spinner-color="primary"
            >
              <template v-slot:loading>
                <q-spinner color="primary" />
              </template>
            </q-img>
            
            <q-card-section>
              <div class="product-title">{{ producto.name }}</div>
              <div class="product-brand" v-if="producto.brand">{{ producto.brand }}</div>
              
              <div class="product-rating">
                <q-rating
                  v-model="producto.averageRating"
                  size="1em"
                  color="orange"
                  icon="star_border"
                  icon-selected="star"
                  readonly
                />
                <span class="rating-value">{{ producto.averageRating?.toFixed(1) || 0 }}</span>
              </div>
              
              <div class="product-price">{{ producto.price }}</div>
            </q-card-section>
            
            <q-card-actions class="product-actions">
              <q-btn
                flat
                color="primary"
                icon="shopping_cart"
                label="Agregar"
                @click.stop="addToTheCart(producto)"
              />
            </q-card-actions>
          </q-card>
        </div>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import mainBar from '../components/mainBar.vue'
import { ref, computed, onMounted, watch } from 'vue'
import { useQuasar, Notify } from 'quasar'
import { useStore } from '../stores/store.js'
import { putData, getData } from '../service/service.js'
const store = useStore()
import { useRoute, useRouter } from 'vue-router'
import { validateToken, scrollToTopInstant } from '../utils/utils.js'
const $q = useQuasar()
const route = useRoute()
const router = useRouter()

// Variables de estado
const dataProduct = ref({});
const review = ref('')
const selectedImage = ref('')
const productQualification = ref(0)
const productos = ref([]);

// Función para cargar productos
async function products() {
  try {
    const response = await getData("/product");
    productos.value = response.data
  } catch (error) {
    console.error('Error al cargar productos:', error)
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Función para cargar un producto específico por ID
async function loadProductById(productId) {
  try {
    // Si ya tienes los productos cargados, búscalo en el array
    if (productos.value.length > 0) {
      const product = productos.value.find(p => p._id === productId);
      if (product) {
        dataProduct.value = product;
        selectedImage.value = '';
        review.value = '';
        productQualification.value = 0;
        console.log("Producto cargado desde array:", dataProduct.value);
        return;
      }
    }
    
    // Si no está en el array, cárgalo desde la API
    const response = await getData(`/product/${productId}`);
    dataProduct.value = response.data;
    selectedImage.value = '';
    review.value = '';
    productQualification.value = 0;
    console.log("Producto cargado desde API:", dataProduct.value);
  } catch (error) {
    console.error('Error al cargar producto:', error);
    Notify.create({
      type: 'negative',
      message: 'Error al cargar el producto'
    });
  }
}

// Función para manejar datos del producto (compatibilidad con método anterior)
function obtainDataProduct() {
  const productData = route.query.data;
  if (productData) {
    try {
      dataProduct.value = JSON.parse(productData);
      selectedImage.value = '';
      review.value = '';
      productQualification.value = 0;
      console.log("Producto cargado desde query data:", dataProduct.value);
    } catch (error) {
      console.error('Error al parsear datos del producto:', error);
    }
  }
}

// Función para inicializar el producto
async function initializeProduct() {
  // Primero verificar si hay un ID en la query
  const productId = route.query.id;
  if (productId) {
    await loadProductById(productId);
    return;
  }
  
  // Si no hay ID, verificar si hay data (método anterior)
  const productData = route.query.data;
  if (productData) {
    obtainDataProduct();
    return;
  }
  
  console.log("No se encontró ID ni data en la query");
}

// Función para agregar al carrito
const addToTheCart =async (producto) => {
  const canProceed = await validateToken()
  if(!canProceed) return

  store.addToCart(producto)
  Notify.create({
    type: "positive",
    message: "Producto agregado al carrito"
  })
  console.log('Agregado al carrito:', producto.name);
}

const verDetalleProducto = (producto) => {
  router.push({
    path: "/seeproduct",
    query: { id: producto._id } // Solo pasa el ID
  });
}

// Watcher para detectar cambios en la query
watch(
  () => [route.query.id, route.query.data],
  ([newId, newData], [oldId, oldData]) => {
    // Si cambió el ID
    if (newId && newId !== oldId) {
      loadProductById(newId);
      return;
    }
    
    // Si cambió la data (método anterior)
    if (newData && newData !== oldData) {
      obtainDataProduct();
      return;
    }
  }
)

// Resto de funciones...
/* const formatPrice = (precio) => {
  return '$' + precio.toLocaleString('es-CO')
} */

const selectImage = (index) => {
  selectedImage.value = dataProduct.value.images[index].urlImage
}

async function addReview(id){
  try {
    const canProceed = await validateToken()
    if(!canProceed) return ;
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
      // Limpiar el formulario después de enviar
      review.value = '';
      productQualification.value = 0;
    }
  } catch (error) {
    console.log(error);
    Notify.create({
      type:'negative',
      message:'Error al crear reseña'
    })
  }
}



const isProductAvailable = computed(() => {
  return dataProduct.value.stock >= 0 ? 'text-positive' : 'text-negative'
})

// Inicialización
onMounted(async () => {
  await products(); // Cargar productos primero
  await initializeProduct(); // Luego inicializar el producto específico
})
</script>

<style scoped>
@import url('../style/SEEPRODUCT.css');
</style>