<template>
    <q-layout>
        <q-page-container>
  <q-page class="categories-page q-pa-md">
  <mainBar/>

    <!-- Listado de categorías principales -->
    <div class="q-mb-xl">
      <h2 class="text-h4 text-weight-bold q-mb-md">Todas las categorías</h2>
      
      <div class="row q-col-gutter-md">
        <div 
          v-for="category in categories" 
          :key="category._id" 
          class="col-12 col-sm-6 col-md-4 col-lg-3"
        >
          <q-card 
            class="category-card cursor-pointer"
            @click="goToCategory(category._id)"
          >
            <q-img
              :src="category.image || 'https://via.placeholder.com/300'"
              ratio="1"
              class="category-image"
            >
              <div class="absolute-bottom text-h6 text-center text-white category-title">
                {{ category.name }}
              </div>
              <div class="absolute-top-right bg-primary text-white q-pa-xs text-caption">
                {{ category.count }} productos
              </div>
            </q-img>

            <!-- Subcategorías -->
            <q-card-section v-if="category.subcategories && category.subcategories.length > 0">
              <q-list dense>
                <q-item 
                  v-for="subcat in category.subcategories.slice(0, 3)" 
                  :key="subcat._id"
                  clickable
                  @click.stop="goToSubCategory(subcat._id)"
                >
                  <q-item-section>{{ subcat.name }}</q-item-section>
                  <q-item-section side>
                    <q-badge color="grey-4" text-color="dark">{{ subcat.count }}</q-badge>
                  </q-item-section>
                </q-item>

                <q-item v-if="category.subcategories.length > 3" clickable @click.stop="viewAllSubcategories(category)">
                  <q-item-section class="text-primary">
                    Ver todas ({{ category.subcategories.length }})
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Categorías destacadas -->
    <div class="q-mb-xl">
      <h2 class="text-h4 text-weight-bold q-mb-md">Categorías destacadas</h2>
      
      <div class="row q-col-gutter-md">
        <div 
          v-for="category in featuredCategories" 
          :key="category._id" 
          class="col-12 col-sm-6 col-md-3"
        >
          <q-card 
            class="featured-category cursor-pointer"
            @click="goToCategory(category._id)"
          >
            <q-img
              :src="category.image || 'https://via.placeholder.com/300'"
              ratio="1"
              class="rounded-borders"
            >
              <div class="absolute-bottom text-subtitle1 text-center text-white category-title">
                {{ category.name }}
              </div>
            </q-img>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Diálogo para ver todas las subcategorías -->
    <q-dialog v-model="showSubcategoriesDialog">
      <q-card style="width: 500px; max-width: 90vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Subcategorías de {{ currentCategory?.name }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-list bordered separator>
            <q-item 
              v-for="subcat in currentCategory?.subcategories" 
              :key="subcat._id"
              clickable
              v-ripple
              @click="goToSubCategory(subcat._id)"
            >
              <q-item-section>{{ subcat.name }}</q-item-section>
              <q-item-section side>
                <q-badge color="grey-4" text-color="dark">{{ subcat.count }}</q-badge>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
    </q-page-container>
    </q-layout>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getData } from '../service/service'
import { useQuasar } from 'quasar'
import mainBar from '../components/mainBar.vue';

const $q = useQuasar()
const router = useRouter()

// Datos de categorías
const categories = ref([])
const featuredCategories = ref([])
const currentCategory = ref(null)
const showSubcategoriesDialog = ref(false)
const loading = ref(false)

// Obtener categorías
onMounted(async () => {
  try {
    loading.value = true
    if ($q) $q.loading.show()
    const response = await getData("/categories")
    categories.value = response.data
    
    // Seleccionar 4 categorías aleatorias como destacadas
    featuredCategories.value = [...response.data]
      .sort(() => 0.5 - Math.random())
      .slice(0, 4)
  } catch (error) {
    if ($q) {
      $q.notify({
        type: 'negative',
        message: 'Error al cargar las categorías',
        caption: error.message
      })
    }
  } finally {
    if ($q && loading.value) {
      $q.loading.hide()
      loading.value = false
    }
  }
})

onBeforeUnmount(() => {
  if ($q && loading.value) {
    $q.loading.hide()
  }
})

// Navegación
const goToCategory = (categoryId) => {
  router.push(`/products?category=${categoryId}`)
}

const goToSubCategory = (subcategoryId) => {
  router.push(`/products?subcategory=${subcategoryId}`)
}

const viewAllSubcategories = (category) => {
  currentCategory.value = category
  showSubcategoriesDialog.value = true
}

// Categorías más populares (calculadas)
const popularCategories = computed(() => {
  return [...categories.value]
    .sort((a, b) => b.count - a.count)
    .slice(0, 6)
})
</script>

<style scoped>
.categories-page {
  max-width: 1200px;
  margin: 0 auto;
}

.categories-banner {
  border-radius: 8px;
  overflow: hidden;
}

.banner-content {
  background: rgba(0, 0, 0, 0.5);
  padding: 20px;
  border-radius: 8px;
}

.category-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 8px;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.category-image {
  border-radius: 8px 8px 0 0;
}

.category-title {
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, transparent 100%);
  padding: 16px;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
}

.featured-category {
  transition: transform 0.3s ease;
  border-radius: 8px;
  overflow: hidden;
}

.featured-category:hover {
  transform: scale(1.03);
}

/* Responsive */
@media (max-width: 1024px) {
  .banner-content h1 {
    font-size: 2rem;
  }
}

@media (max-width: 768px) {
  .banner-content {
    padding: 10px;
  }
  
  .banner-content h1 {
    font-size: 1.5rem;
  }
  
  .banner-content p {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .categories-page {
    padding: 10px;
  }
}
</style>