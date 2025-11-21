<template>
  <q-layout>
    <mainBar/>
    <q-page-container>
      <q-page class="q-pa-md favorites-page">
        <div class="text-h4 text-center q-mb-lg favorites-title">
          Mis Productos Favoritos
        </div>

        <div v-if="favorites.length > 0" class="row q-col-gutter-md">
          <div
            v-for="product in favorites"
            :key="product._id"
            class="col-12 col-sm-6 col-md-4"
          >
            <q-card class="product-card">
              <q-card-section class="product-image-section">
                <div class="product-image-container">
                  <img :src="product.productId.images[0].urlImage" alt="Product Image" class="product-image">
                </div>
              </q-card-section>

              <q-card-section class="product-content">
                <div class="text-h6 product-name">{{ product.productId.name }}</div>
                <div class="text-subtitle2 product-description">
                  {{ product.productId.description?.length > 120 ? product.productId.description.substring(0, 120) + '...' : product.productId.description }}
                  <q-btn
                    v-if="product.productId.description?.length > 120"
                    flat
                    dense
                    color="primary"
                    label="Ver más"
                    @click="openDescriptionDialog(product.productId)"
                    class="q-ml-sm"
                  />
                </div>
              </q-card-section>

              <q-card-section class="q-pt-none product-price-section">
                <div class="text-h5 product-price">${{ product.productId.price }}</div>
              </q-card-section>

              <q-card-actions align="right" class="product-actions">
                <button class="card-btn" @click.stop="addToTheCart(product)">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path d="m397.78 316h-205.13a15 15 0 0 1 -14.65-11.67l-34.54-150.48a15 15 0 0 1 14.62-18.36h274.27a15 15 0 0 1 14.65 18.36l-34.6 150.48a15 15 0 0 1 -14.62 11.67zm-193.19-30h181.25l27.67-120.48h-236.6z"></path>
                    <path d="m222 450a57.48 57.48 0 1 1 57.48-57.48 57.54 57.54 0 0 1 -57.48 57.48zm0-84.95a27.48 27.48 0 1 0 27.48 27.47 27.5 27.5 0 0 0 -27.48-27.47z"></path>
                    <path d="m368.42 450a57.48 57.48 0 1 1 57.48-57.48 57.54 57.54 0 0 1 -57.48 57.48zm0-84.95a27.48 27.48 0 1 0 27.48 27.47 27.5 27.5 0 0 0 -27.48-27.47z"></path>
                    <path d="m158.08 165.49a15 15 0 0 1 -14.23-10.26l-25.71-77.23h-47.44a15 15 0 1 1 0-30h58.3a15 15 0 0 1 14.23 10.26l29.13 87.49a15 15 0 0 1 -14.23 19.74z"></path>
                  </svg>
                </button>
                <q-btn
                  color="negative"
                  label="Quitar"
                  icon="favorite_border"
                  @click="removeFromFavorites(product.productId._id)"
                />
              </q-card-actions>
            </q-card>
          </div>
        </div>

        <div v-else class="empty-favorites-message text-center q-pa-md">
          <q-icon name="sentiment_dissatisfied" size="xl" class="q-mb-md" />
          <p class="text-h6">No tienes productos favoritos aún. ¡Explora y añade algunos!</p>
        </div>

        <q-dialog v-model="showDescriptionDialog" class="description-dialog">
          <q-card class="dialog-card">
            <q-card-section>
              <div class="text-h6 dialog-title">{{ currentDialogProduct.name }}</div>
            </q-card-section>
            <q-card-section class="q-pt-none dialog-content">
              {{ currentDialogProduct.description }}
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="Cerrar" color="primary" @click="showDescriptionDialog = false" />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { onMounted, ref, toRaw } from 'vue';
import { QPage, QCard, QCardSection, QCardActions, QBtn, QDialog, QIcon } from 'quasar';
import { validateToken } from '../utils/utils.js';
import mainBar from '../components/mainBar.vue';
import { getData, putData } from '../service/service';
import { useStore } from '../stores/store';

const store = useStore();
const favorites = ref([]);
const showDescriptionDialog = ref(false);
const currentDialogProduct = ref({});

const openDescriptionDialog = (product) => {
  currentDialogProduct.value = product;
  showDescriptionDialog.value = true;
};

async function favorite() {
  try {
    const response = await getData(`/favorites/list/${store.userId}`);
    favorites.value = response.data;
    console.log("favoritos cargados", toRaw(favorites.value));
  } catch (error) {
    console.error('Error al cargar tus favoritos:', error);
  }
}

const addToTheCart = async (favoriteItem) => {
  const canProceed = await validateToken();
  if (!canProceed) return;

  if (!favoriteItem || !favoriteItem.productId) {
    console.error("Error: el objeto favorito o su productId es indefinido.");
    console.log("Objeto recibido:", favoriteItem);
    return;
  }

  try {
    await store.addToCart(favoriteItem.productId);
    console.log("Agregado al carrito:", favoriteItem.productId.name);
  } catch (error) {
    console.error("Error al agregar al carrito:", error);
  }
};

const removeFromFavorites = async (productId) => {
  try {
    const favoriteItem = favorites.value.find(fav => fav.productId._id === productId);

    if (!favoriteItem) {
      console.error('Favorito no encontrado');
      return;
    }

    const response = await putData(`/favorites/state/${favoriteItem._id}`);

    if (response.success || response.status === 200) {
      favorites.value = favorites.value.filter((product) => product.productId._id !== productId);
      console.log(`Producto con ID ${productId} eliminado de favoritos.`);
    }
  } catch (error) {
    console.error('Error al eliminar de favoritos:', error);
  }
};

onMounted(() => {
  favorite();
});
</script>

<style scoped>
/* Estilos generales para la página de favoritos */
.favorites-page {
  padding: 32px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  font-family: 'Roboto', sans-serif;
  min-height: 100vh;
}

/* Estilos para el título principal */
.favorites-title {
  color: #2c3e50;
  font-weight: 700;
  margin-bottom: 40px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  text-align: center;
  font-size: 2.2rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Grid responsivo para las tarjetas */
.row.q-col-gutter-md {
  margin-top: 20px;
}

/* Estilos para las tarjetas de productos */
.product-card {
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  height: 100%;
  background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.product-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

/* Sección de la imagen mejorada */
.product-image-section {
  padding: 0; /* Remove padding from q-card-section to control image container directly */
  display: flex;
  justify-content: center;
  align-items: center;
  background: #e9ebee; /* Light grey background for empty space */
  border-bottom: 1px solid #eee;
}

.product-image-container {
  width: 100%;
  max-width: 250px; /* Max width for the image container */
  height: 180px; /* Fixed height for consistency */
  overflow: hidden;
  border-radius: 16px; /* Rounded corners for the image container */
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 15px 0; /* Add some margin top and bottom */
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: contain; /* Ensures the whole image is visible, scales down */
  object-position: center;
  transition: transform 0.3s ease;
  max-width: 100%; /* Ensure image doesn't exceed its container */
  max-height: 100%; /* Ensure image doesn't exceed its container */
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

/* Contenido de la tarjeta */
.product-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.product-name {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 12px;
  font-size: 1.1rem;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.6em; /* Ensure consistent height for names */
}

.product-description {
  color: #64748b;
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 16px;
  flex-grow: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 4.8em; /* Ensure consistent height for descriptions */
}

.product-price-section {
  padding-top: 0;
  padding-bottom: 20px; /* Add more padding at the bottom for price */
}

.product-price {
  color: #059669;
  font-weight: 700;
  font-size: 1.4rem; /* Slightly larger price font */
  text-align: right; /* Align price to the right */
  margin-bottom: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* Área de acciones */
.product-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-top: auto;
  padding: 16px 20px; /* Adjust padding for actions */
  border-top: 1px solid #eee; /* Separator for actions */
}

/* Estilos mejorados para botones */
.q-btn {
  border-radius: 12px;
  font-weight: 500;
  text-transform: none;
  padding: 10px 20px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.q-btn.q-btn--negative {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%) !important;
  color: white !important;
  border: none;
}

.q-btn.q-btn--negative:hover {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%) !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
}

/* Botón circular mejorado */
.card-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%); /* Use a consistent blue gradient */
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
}

.card-btn:hover {
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  transform: translateY(-3px) scale(1.1);
  box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
}

.card-btn svg {
  width: 22px;
  height: 22px;
  fill: #fff;
  transition: transform 0.2s ease;
}

.card-btn:hover svg {
  transform: scale(1.1);
}

/* Estilos mejorados para el mensaje de "no favoritos" */
.empty-favorites-message {
  background: linear-gradient(135deg, #fefce8 0%, #fef3c7 100%);
  border: 2px solid #f59e0b;
  border-radius: 16px;
  color: #92400e;
  margin-top: 60px;
  padding: 48px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  box-shadow: 0 10px 30px rgba(245, 158, 11, 0.2);
}

.empty-favorites-message .q-icon { /* Changed from .empty-icon to .q-icon for direct targeting */
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.7;
  color: #f59e0b; /* Apply icon color for better visibility */
}

.empty-favorites-message p {
  font-size: 1.2rem;
  font-weight: 500;
  margin-top: 16px;
  line-height: 1.6;
}

/* Estilos mejorados para el diálogo de descripción */
.description-dialog .dialog-card {
  min-width: 320px;
  max-width: 700px;
  border-radius: 16px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.description-dialog .dialog-title {
  font-weight: 600;
  color: #2c3e50;
  font-size: 1.3rem;
  padding: 24px 24px 12px;
}

.description-dialog .dialog-content {
  color: #475569;
  line-height: 1.7;
  padding: 12px 24px 24px;
  font-size: 1rem;
}

/* Animaciones y efectos adicionales */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.col-12.col-sm-6.col-md-4 { /* Apply animation to the grid item for staggered effect */
  animation: fadeInUp 0.6s ease forwards;
}

.col-12.col-sm-6.col-md-4:nth-child(odd) {
  animation-delay: 0.1s;
}

.col-12.col-sm-6.col-md-4:nth-child(even) {
  animation-delay: 0.2s;
}

/* Responsividad mejorada */
@media (max-width: 768px) {
  .favorites-page {
    padding: 20px 16px;
  }

  .favorites-title {
    font-size: 1.8rem;
    margin-bottom: 30px;
  }

  .product-image-container {
    height: 150px; /* Adjust height for smaller screens */
  }

  .product-content {
    padding: 16px;
  }

  .empty-favorites-message {
    padding: 32px 20px;
    margin-top: 40px;
  }
}

/* Efectos de carga para imágenes */
.product-image[loading] {
  background: linear-gradient(90deg, #f0f2f5 25%, #e2e8f0 50%, #f0f2f5 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>