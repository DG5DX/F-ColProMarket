<template>
    <q-layout>
        <mainBar/>
        <q-page-container>
              <q-page class="q-pa-md favorites-page">
    <!-- Título principal de la sección de favoritos -->
    <div class="text-h4 text-center q-mb-lg favorites-title">
      Mis Productos Favoritos
    </div>

    <!-- Contenedor de la cuadrícula para los productos favoritos -->
    <!-- Utiliza el sistema de grid de Quasar (row y col) para la responsividad -->
    <div v-if="favorites.length > 0" class="row q-col-gutter-md">
      <!-- Itera sobre cada producto en el array 'favorites' -->
      <div
        v-for="product in favorites"
        :key="product._id"
        class="col-12 col-sm-6 col-md-4"
      >
        <!-- Tarjeta de producto usando QCard de Quasar -->
        <q-card class="product-card">
          <q-card-section>
            <!-- Nombre del producto -->
            <div class="text-h6 product-name">{{ product.productId.name }}</div>
            <!-- Descripción del producto, truncada inicialmente -->
             <div>
                <img :src="product.productId.images[0].urlImage" alt="">
             </div>
            <div class="text-subtitle2 product-description">
              {{ product.description }}
              <!-- Botón "Ver más" que aparece si la descripción es larga -->
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

          <q-card-section class="q-pt-none">
            <!-- Precio del producto -->
            <div class="text-h5 product-price">{{ product.productId.price }}</div>
          </q-card-section>

          <!-- Acciones de la tarjeta (botón de quitar) -->
          <q-card-actions align="right">
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

    <!-- Mensaje a mostrar si no hay productos favoritos -->
    <div v-else class="empty-favorites-message text-center q-pa-md">
      <q-icon name="sentiment_dissatisfied" size="xl" class="q-mb-md" />
      <p class="text-h6">No tienes productos favoritos aún. ¡Explora y añade algunos!</p>
    </div>

    <!-- Diálogo (modal) para mostrar la descripción completa de un producto -->
    <q-dialog v-model="showDescriptionDialog" class="description-dialog">
      <q-card class="dialog-card">
        <q-card-section>
          <!-- Título del diálogo (nombre del producto) -->
          <div class="text-h6 dialog-title">{{ currentDialogProduct.name }}</div>
        </q-card-section>
        <q-card-section class="q-pt-none dialog-content">
          <!-- Contenido de la descripción completa -->
          {{ currentDialogProduct.description }}
        </q-card-section>
        <q-card-actions align="right">
          <!-- Botón para cerrar el diálogo -->
          <q-btn flat label="Cerrar" color="primary" @click="showDescriptionDialog = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
        </q-page-container>
    </q-layout>
  <!-- Contenedor principal de la página de favoritos con padding y fondo -->

</template>

<script setup>
import { onMounted, ref, toRaw } from 'vue';
import { QPage, QCard, QCardSection, QCardActions, QBtn, QDialog, QIcon } from 'quasar';
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

 
const removeFromFavorites = async (productId) => {
  try {
    // Encontrar el favorito por el productId para obtener su _id
    const favoriteItem = favorites.value.find(fav => fav.productId._id === productId);
    
    if (!favoriteItem) {
      console.error('Favorito no encontrado');
      return;
    }
    
    // Hacer la petición PUT al endpoint correcto usando el favoriteId
    const response = await putData(`/favorites/state/${favoriteItem._id}`);
    
    // Si la petición es exitosa, actualizar el estado local
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
  padding: 32px; /* Espaciado interno */
  background-color: #f0f2f5; /* Un gris claro de fondo */
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); /* Sombra suave */
  font-family: 'Roboto', sans-serif; /* Quasar por defecto usa Roboto */
}

/* Estilos para el título principal */
.favorites-title {
  color: #333; /* Color de texto oscuro */
  font-weight: 700; /* Negrita */
  margin-bottom: 40px; /* Más espacio debajo del título */
  text-transform: uppercase; /* Texto en mayúsculas */
  letter-spacing: 1px; /* Espaciado entre letras */
}

/* Estilos para las tarjetas de productos */
.product-card {
  border-radius: 12px; /* Bordes redondeados */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); /* Sombra suave */
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out; /* Transiciones suaves al interactuar */
  display: flex;
  flex-direction: column;
  height: 100%; /* Asegura que todas las tarjetas tengan la misma altura */
  background-color: #ffffff; /* Fondo blanco */
}

.product-card:hover {
  transform: translateY(-5px); /* Efecto de elevación al pasar el ratón */
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12); /* Sombra más pronunciada al pasar el ratón */
}

.product-name {
  font-weight: 600; /* Seminegrita */
  color: #2c3e50; /* Color de texto para el nombre */
  margin-bottom: 8px; /* Espaciado inferior */
}

.product-description {
  color: #616161; /* Color de texto para la descripción */
  font-size: 0.95rem; /* Tamaño de fuente */
  line-height: 1.5; /* Altura de línea */
  margin-bottom: 16px; /* Espaciado inferior */
  flex-grow: 1; /* Permite que la descripción ocupe el espacio disponible */
}

.product-price {
  color: #27ae60; /* Un verde vibrante para el precio */
  font-weight: 700; /* Negrita */
  margin-top: 16px; /* Espaciado superior */
}

/* Estilos para el botón de quitar */
.q-btn {
  border-radius: 8px; /* Bordes redondeados para los botones */
  font-weight: 500; /* Peso de la fuente */
  text-transform: none; /* Evita que el texto del botón sea mayúsculas por defecto en Quasar */
  padding: 8px 16px; /* Padding interno */
}

.q-btn.q-btn--negative {
  background-color: #e74c3c !important; /* Rojo vibrante para el botón de quitar */
  color: white !important; /* Texto blanco */
}

.q-btn.q-btn--negative:hover {
  background-color: #c0392b !important; /* Rojo más oscuro al pasar el ratón */
}

/* Estilos para el mensaje de "no favoritos" */
.empty-favorites-message {
  background-color: #fefce8; /* Un amarillo muy claro de fondo */
  border: 1px solid #fcd34d; /* Un borde amarillo */
  border-radius: 8px; /* Bordes redondeados */
  color: #78350f; /* Un color de texto más oscuro para contraste */
  margin-top: 40px; /* Espaciado superior */
  padding: 32px; /* Padding interno */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.empty-favorites-message p {
  font-size: 1.1rem; /* Tamaño de fuente */
  font-weight: 500; /* Peso de la fuente */
  margin-top: 16px; /* Espaciado superior */
}

/* Estilos para el diálogo de descripción (modal) */
.description-dialog .dialog-card {
  min-width: 300px; /* Ancho mínimo */
  max-width: 600px; /* Ancho máximo */
  border-radius: 12px; /* Bordes redondeados */
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15); /* Sombra para el diálogo */
}

.description-dialog .dialog-title {
  font-weight: 600; /* Seminegrita */
  color: #2c3e50; /* Color de texto */
}

.description-dialog .dialog-content {
  color: #424242; /* Color de texto */
  line-height: 1.6; /* Altura de línea */
}
</style>
