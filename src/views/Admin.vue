<template>
  <q-layout view="hHh lpR fFf" id="body">
    <admin-drawer />
    <q-page-container>
      <q-page class="q-pa-md flex flex-center">
        <!-- Skeleton para la tarjeta de métricas -->
        <template v-if="loading">
          <q-card class="q-pa-md shadow-2 q-mx-auto" style="width: 100%; background-color: white">
            <div class="text-h5 text-weight-bold" style="display: grid; justify-items: center; padding: 10px">
              <q-skeleton type="text" width="200px" />
            </div>
            <div class="row q-mb-md q-gutter-md">
              <q-card v-for="n in 4" :key="n" class="col metric-card">
                <q-card-section>
                  <div class="text-h6"><q-skeleton type="text" width="120px" /></div>
                  <q-skeleton type="QAvatar" size="md" class="metric-icon" />
                  <q-label class="text-h2"><q-skeleton type="text" width="80px" height="60px" /></q-label>
                </q-card-section>
              </q-card>
            </div>
          </q-card>
        </template>

        <template v-else>
          <q-card class="q-pa-md shadow-2 q-mx-auto" style="width: 100%; background-color: white">
            <div class="text-h5 text-weight-bold" style="display: grid; justify-items: center; padding: 10px">
              📄 Detalles Generales
            </div>
            <!-- Rectángulos de métricas -->
            <div class="row q-mb-md q-gutter-md">
              <!-- Total de Productos -->
              <q-card class="col metric-card bg-blue-1">
                <q-card-section>
                  <div class="text-h6">Total de Productos</div>
                  <div class="text-h4 text-weight-bold"></div>
                  <q-icon name="inventory_2" size="md" class="metric-icon" />
                  <q-label class="text-h2">{{ dataProducts.count || 0 }}</q-label>
                </q-card-section>
              </q-card>

              <!-- Total en Stock -->
              <q-card class="col metric-card bg-orange-1">
                <q-card-section>
                  <div class="text-h6">Total en Stock</div>
                  <div class="text-h4 text-weight-bold"></div>
                  <q-icon name="warehouse" size="md" class="metric-icon" />
                  <q-label class="text-h2">{{
                    dataProducts.stock?.stockAvailable || 0
                  }}</q-label>
                </q-card-section>
              </q-card>

              <!-- Total Fuera de Stock -->
              <q-card class="col metric-card bg-red-1">
                <q-card-section>
                  <div class="text-h6">Total Fuera de Stock</div>
                  <div class="text-h4 text-weight-bold"></div>
                  <q-icon name="warning" size="md" class="metric-icon" />
                  <q-label class="text-h2">{{
                    dataProducts.stock?.zeroStock || 0
                  }}</q-label>
                </q-card-section>
              </q-card>
            </div>
          </q-card>
        </template>

        <!-- Skeleton para los filtros -->
        <template v-if="loading">
          <q-card class="q-pa-md shadow-2 q-mx-auto q-mt-md"
            style="width: 100%; background-color: #f5f5f5; margin-bottom: 16px">
            <div class="text-h6 text-weight-bold q-mb-md"><q-skeleton type="text" width="250px" /></div>
            <div class="row q-gutter-md items-center" style="display: flex; align-items: center">
              <q-skeleton type="rect" width="200px" height="40px" />
              <q-skeleton type="rect" width="150px" height="40px" />
              <q-skeleton type="rect" width="150px" height="40px" />
              <q-skeleton type="rect" width="200px" height="40px" />
              <div class="row q-gutter-sm">
                <q-skeleton type="rect" width="150px" height="40px" />
                <q-skeleton type="rect" width="150px" height="40px" />
              </div>
            </div>
          </q-card>
        </template>

        <template v-else>
          <!-- Filtros de Búsqueda -->
          <q-card class="q-pa-md shadow-2 q-mx-auto q-mt-md"
            style="width: 100%; background-color: #f5f5f5; margin-bottom: 16px">
            <div class="text-h6 text-weight-bold q-mb-md">
              🔍 Filtros Avanzados
            </div>

            <div class="row q-gutter-md items-center" style="display: flex; align-items: center">
              <q-select filled dense v-model="selectedCategory" :options="categories" option-label="name"
                label="Filtrar por categoría" clearable class="col" style="min-width: 200px" :loading="loading" />

              <q-input filled dense v-model="minPrice" label="Precio mínimo" type="number" class="col"
                style="min-width: 150px" />

              <q-input filled dense v-model="maxPrice" label="Precio máximo" type="number" class="col"
                style="min-width: 150px" />

              <q-select filled dense v-model="stockFilter" label="Filtrar por stock" class="col"
                style="min-width: 200px" :options="['En stock', 'Sin stock']" clearable />

              <div class="row q-gutter-sm" style="margin-top: 0%">
                <q-btn label="Aplicar Filtros" color="primary" dense style="height: 40px" @click="applyFilters"
                  :loading="loading" />
                <q-btn label="Limpiar Filtros" color="negative" outline dense style="height: 40px" @click="clearFilters"
                  :disable="loading" />
              </div>
            </div>
          </q-card>
        </template>

        <!-- Skeleton para la tabla de productos -->
        <template v-if="loading">
          <q-card class="q-pa-md shadow-2 q-mx-auto" style="width: 100%; min-height: 600px">
            <div class="row justify-between items-center q-mb-md">
              <div class="text-h5 text-weight-bold"><q-skeleton type="text" width="200px" /></div>
              <div class="row q-mb-md items-center q-gutter-md">
                <q-skeleton type="text" width="300px" height="40px" />
                <q-skeleton type="rect" width="150px" height="40px" />
              </div>
            </div>

            <q-table flat bordered :rows="[]" :columns="columns" row-key="id" hide-pagination>
              <template v-slot:body="props">
                <q-tr v-for="n in 5" :key="n">
                  <q-td v-for="col in columns" :key="col.name">
                    <q-skeleton type="text" />
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </q-card>
        </template>

        <template v-else>
          <q-card class="q-pa-md shadow-2 q-mx-auto" style="width: 100%; min-height: 600px">
            <div class="row justify-between items-center q-mb-md">
              <div class="text-h5 text-weight-bold">
                📦 Lista de Productos
                <span :style="{
                  color: dataProducts.type === 'actives' ? 'green' : 'red',
                  backgroundColor: dataProducts.type === 'actives' ? '#e6ffe6' : '#ffe6e6', /* Tonos pastel */
                  padding: '0.2em 0.5em', /* Añade un poco de espacio alrededor */
                  borderRadius: '5px' /* Opcional: bordes redondeados */
                }">
                  {{ dataProducts.type === 'actives' ? 'activos' : 'inactivos' }}
                </span>
              </div>
              <div class="row q-mb-md items-center q-gutter-md" style="display: flex; align-items: flex-start">
                <q-input filled dense debounce="300" v-model="search" label="Buscar producto" clearable
                  prepend-inner-icon="search" class="search" @clear="search = ''" />
                <q-btn label="Crear Producto" color="primary" icon="add" @click="productDialog = true"
                  class="col-auto" />
                <q-btn color="primary" :loading="loadingActivatedProducts" label="Cargar productos activos"
                  @click="getAllProducts" icon="refresh"></q-btn>
                <q-btn icon="refresh" :loading="loadingDeactivatedProducts" label="Cargar productos inactivos"
                  color="primary" @click="loadDeactivatedProducts"></q-btn>
              </div>
            </div>

            <q-table :rows="appliedFilters ? filteredProducts : (dataProducts.data || [])" :columns="columns"
              row-key="nombre" flat bordered wrap-cells class="bg-white my-sticky-table" :filter="search"
              style="max-height: 400px" separator="cell">
              <template v-slot:body-cell-imagen="props">
                <q-td :props="props" class="q-table--cell-center">
                  <q-img :src="props.row.images[0].urlImage" contain style="width: 60px; height: 60px" />
                </q-td>
              </template>

              <template v-slot:body-cell-acciones="props">
                <q-td :props="props" class="q-table--cell-center">
                  <q-btn icon="visibility" flat dense color="primary" @click="seeDetail(props.row)" />
                  <q-btn icon="edit" flat dense color="warning" @click="editarProducto(props.row)" class="q-ml-sm" />
                  <q-btn title="Cambiar estado" :color="props.row.state == 0 ? 'green' : 'red'" icon="check_circle" flat
                    dense color="negative" @click="changeState(props.row)" class="q-ml-sm" />
                  <q-btn icon="local_offer" flat dense color="positive"
                    @click="productOnOffer = props.row; offerDialog = true" class="q-ml-sm" />
                </q-td>
              </template>
            </q-table>
          </q-card>
        </template>
      </q-page>
    </q-page-container>

    <!-- Diálogo Crear Producto -->
    <q-dialog v-model="productDialog" persistent>
      <q-card style="min-width: 600px; max-width: 800px">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">Agregar Nuevo Producto</div>
        </q-card-section>

        <q-separator />

        <q-card-section class="q-gutter-md scroll" style="max-height: 70vh">
          <!-- Sección de información básica -->
          <div class="text-subtitle1 text-weight-bold q-mb-sm">Información Básica</div>
          <div class="row q-gutter-md">
            <q-input v-model="dataProduct.name" label="Nombre del Producto *" class="col" outlined dense
              :rules="[val => !!val || 'Campo obligatorio']" />
            <q-input v-model="dataProduct.brand" label="Marca *" class="col" outlined dense
              :rules="[val => !!val || 'Campo obligatorio']" />
          </div>

          <q-input v-model="dataProduct.description" label="Descripción *" type="textarea" outlined dense
            :rules="[val => !!val || 'Campo obligatorio']" />

          <div class="row q-gutter-md">
            <q-input v-model="dataProduct.price" label="Precio *" type="number" class="col" outlined dense prefix="$"
              :rules="[val => val > 0 || 'El precio debe ser mayor a 0']" />

            <q-input v-model="dataProduct.stock" label="Cantidad en Stock *" type="number" class="col" outlined dense
              :rules="[val => val >= 0 || 'La cantidad no puede ser negativa']" />
          </div>

          <div class="row q-gutter-md">
            <q-select filled dense v-model="dataProduct.category" :options="categories" option-label="name" map-options
              label="Categoría *" class="col" :rules="[val => !!val || 'Seleccione una categoría']"
              @update:model-value="handleCategoryChange" />

            <q-select v-model="dataProduct.acceptReturns" :options="acceptReturns" label="Permite Devoluciones *"
              class="col" outlined dense :rules="[val => !!val || 'Seleccione una opción']" />
          </div>

          <!-- Características específicas de la categoría -->
          <template v-if="dataProduct.category">
            <div class="text-subtitle1 text-weight-bold q-mt-md q-mb-sm">Características Específicas</div>
            <div class="row q-gutter-md">
              <q-input v-for="(element, index) of dataProduct.category.characteristics"
                v-model="dataProduct.details[element]" :label="element" :key="index" class="col" outlined dense />
            </div>
          </template>

          <!-- Sección de imágenes -->
          <div class="text-subtitle1 text-weight-bold q-mt-md q-mb-sm">Imágenes del Producto</div>
          <q-file v-model="files" label="Seleccionar imágenes (máx. 5)" multiple accept="image/*"
            @update:model-value="handleFiles" counter :max-files="5" outlined dense>
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
            <template v-slot:hint>
              Formatos soportados: JPG, PNG
            </template>
          </q-file>

          <div class="q-mt-md row q-gutter-sm">
            <div v-for="(image, index) in previewImages" :key="index" class="relative-position">
              <q-img :src="image" style="height: 100px; width: 100px" class="rounded-borders" />
              <q-btn dense round icon="close" color="negative" class="absolute-top-right" size="sm"
                @click="removeImage(index)" />
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right" class="q-pa-md">
          <q-btn label="Cancelar" color="grey" flat @click="resetProductForm" />
          <q-btn label="Guardar Producto" color="primary" @click="saveProduct" :disable="!isFormValid" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Diálogo Detalle -->
    <q-dialog v-model="detailDialog" v-close-popup>
      <q-card class="q-pa-md" style="min-width: 400px; max-width: 600px">
        <q-card-section class="text-h6 text-primary">Detalle del Producto</q-card-section>
        <q-separator />
        <q-card-section class="q-gutter-md">
          <q-img :src="productSelect.images[0].urlImage" style="width: 100%; height: 250px" class="rounded-borders"
            contain />
          <div>
            <div><strong>Nombre:</strong> {{ productSelect.name }}</div>
            <div>
              <strong>Descripción:</strong>
              {{ productSelect.description }}
            </div>
            <div><strong>Precio:</strong> ${{ productSelect.price }}</div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cerrar" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!--Dialogo oferta-->
    <q-dialog v-model="offerDialog">
      <q-card style="min-width: 400px">
        <q-card-section class="text-h6 text-warning">Editar Producto</q-card-section>
        <q-separator />
        <q-card-section>
          <q-img v-if="productOnOffer && productOnOffer.images && productOnOffer.images.length > 0"
            :src="productOnOffer.images[0].urlImage" style="width: 100%; height: 250px" class="rounded-borders"
            contain />
          <div v-else class="text-center q-py-md">
            <q-icon name="image_not_supported" size="xl" color="grey" />
            <p class="text-grey">Sin imagen</p>
          </div>

          <span class="text-subtitle1 text-weight-bold">{{ productOnOffer.name }}</span>
          <p class="text-body2">Precio actual: ${{ formatNum(productOnOffer.price) }}</p>

          <q-input v-model="productOnOffer.discountPercentage" type="number" label="Porcentaje de descuento" suffix="%"
            :rules="[val => val >= 0 && val <= 100 || 'El porcentaje debe estar entre 0 y 100']"
            @update:model-value="calculateDiscountedPrice"></q-input>

          <p class="text-h6 q-mt-md" v-if="productOnOffer.offerPrice !== null">
            Precio con descuento: <span class="text-primary text-weight-bold">${{ formatNum(productOnOffer.offerPrice)
            }}</span>
          </p>
          <p class="text-caption text-grey" v-else>
            Introduce un porcentaje para ver el precio de oferta.
          </p>
        </q-card-section>

        <q-card-section>
          <q-date v-model="productOnOffer.offerDateRange" range mask="YYYY-MM-DD" color="primary" no-unset flat />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <p v-if="productOnOffer.offerDateRange && productOnOffer.offerDateRange.from">
            Fecha de Inicio: <strong>{{ productOnOffer.offerDateRange.from }}</strong>
          </p>
          <p v-if="productOnOffer.offerDateRange && productOnOffer.offerDateRange.to">
            Fecha de Fin: <strong>{{ productOnOffer.offerDateRange.to }}</strong>
          </p>
          <p v-else>
            Por favor, selecciona un rango de fechas.
          </p>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="secondary" v-close-popup />
          <q-btn flat label="Aplicar Oferta" :loading="offerLoading" color="primary" @click="establishOffer" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Diálogo Editar -->
    <q-dialog v-model="editDialog" persistent>
      <q-card class="edit-product-card">
        <q-card-section class="edit-product-header">
          <div class="header-content">
            <q-icon name="edit" size="24px" class="header-icon" />
            <span class="header-title">Editar Producto</span>
          </div>
        </q-card-section>

        <q-separator class="custom-separator" />

        <q-card-section class="edit-product-form" @keyup.enter="updateProduct">
          <div class="form-container">
            <q-input v-model="productEdit.name" label="Nombre del Producto" class="custom-input" outlined
              :rules="[val => !!val || 'El nombre es requerido']">
              <template v-slot:prepend>
                <q-icon name="inventory" />
              </template>
            </q-input>

            <q-input v-model="productEdit.description" label="Descripción" type="textarea" class="custom-input" outlined
              rows="3" counter maxlength="500">
              <template v-slot:prepend>
                <q-icon name="description" />
              </template>
            </q-input>

            <q-input v-model="productEdit.price" label="Precio" type="number" class="custom-input" outlined prefix="$"
              :rules="[val => val > 0 || 'El precio debe ser mayor a 0']">
              <template v-slot:prepend>
                <q-icon name="attach_money" />
              </template>
            </q-input>
          </div>
        </q-card-section>

        <q-card-actions class="edit-product-actions">
          <q-btn flat label="Cancelar" class="cancel-btn" v-close-popup />
          <q-btn label="Guardar Cambios" class="save-btn" :loading="loadingEditButton" @click="updateProduct" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, computed, toRaw } from "vue";
import { Notify } from "quasar";
import { getData, postData, putData } from "../service/service.js";
import adminDrawer from "../components/adminDrawer.vue";
import { useStore } from "../stores/store.js";
import { formatNum, showNotification, showNotification2 } from "../utils/utils.js";

const store = useStore();
const files = ref([]);
const dataProduct = ref({
  details: {}
});
const productOnOffer = ref({})
const loadingEditButton = ref(false)
const loadingDeactivatedProducts = ref(false);
const loadingActivatedProducts = ref(false);
const offerLoading = ref(false);
const previewImages = ref([]);
const search = ref("");
// Diálogos
const productDialog = ref(false);
const offerDialog = ref(false);
const detailDialog = ref(false);
const editDialog = ref(false);

// Categorías
const categories = ref([]);
const selectedCategory = ref(null);
const dataProducts = ref([]);
const acceptReturns = ['Si', 'No']
const productSelect = ref({});
const productEdit = ref({});

// Filtros
const minPrice = ref(null);
const maxPrice = ref(null);
const stockFilter = ref(null);
const appliedFilters = ref(false);
const loading = ref(false);

// Función para aplicar los filtros
const applyFilters = () => {
  appliedFilters.value = true;
  getAllProducts(); // Vuelve a cargar los productos con los filtros aplicados
};

// Función para limpiar los filtros
const clearFilters = () => {
  selectedCategory.value = null;
  minPrice.value = null;
  maxPrice.value = null;
  stockFilter.value = null;
  appliedFilters.value = false;
  getAllProducts(); // Vuelve a cargar los productos sin filtros
};

// Función para filtrar los productos localmente (opcional)
const filteredProducts = computed(() => {
  if (!appliedFilters.value) return dataProducts.value.data || [];

  return (dataProducts.value.data || []).filter(product => {
    // Filtro por categoría
    if (selectedCategory.value && product.categoryId?._id !== selectedCategory.value._id) {
      return false;
    }

    // Filtro por precio mínimo
    if (minPrice.value && product.price < minPrice.value) {
      return false;
    }

    // Filtro por precio máximo
    if (maxPrice.value && product.price > maxPrice.value) {
      return false;
    }

    // Filtro por stock
    if (stockFilter.value === 'En stock' && product.stock <= 0) {
      return false;
    }
    if (stockFilter.value === 'Sin stock' && product.stock > 0) {
      return false;
    }

    return true;
  });
});

onMounted(() => {
  loading.value = true;
  Promise.all([getAllCategories(), getAllProducts()])
    .finally(() => {
      loading.value = false;
    });
});

// Validaciones
const isFormValid = computed(() => {
  return (
    dataProduct.value.name &&
    dataProduct.value.description &&
    dataProduct.value.brand &&
    dataProduct.value.price > 0 &&
    dataProduct.value.stock >= 0 &&
    dataProduct.value.category &&
    dataProduct.value.acceptReturns &&
    previewImages.value.length > 0
  );
});

function resetProductForm() {
  dataProduct.value = {
    name: '',
    description: '',
    brand: '',
    price: 0,
    stock: 0,
    category: null,
    acceptReturns: null,
    details: {}
  };
  files.value = [];
  previewImages.value = [];
  productDialog.value = false;
}

function handleCategoryChange() {
  // Limpiar detalles anteriores cuando cambia la categoría
  dataProduct.value.details = {};
}

const handleFiles = (selectedFiles) => {
  previewImages.value = [];

  if (!selectedFiles) return;

  Array.from(selectedFiles).forEach((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImages.value.push(e.target.result);
    };
    reader.readAsDataURL(file);
  });
};

const removeImage = (index) => {
  previewImages.value.splice(index, 1);
  files.value.splice(index, 1);
};

const saveProduct = async () => {
  try {
    const formData = new FormData();
    Array.from(files.value).forEach((file, index) => {
      formData.append("images", file);
    });

    dataProduct.value.categoryId = dataProduct.value.category._id
    dataProduct.value.adminId = store.userId;
    delete dataProduct.value.category

    formData.append("data", JSON.stringify(dataProduct.value));
    const response = await postData("/product", formData);
    console.log("datos de producto enviado", toRaw(dataProduct.value));

    if (response) {
      Notify.create({
        type: "positive",
        message: "producto creado correctamente",
      });
      productDialog.value = false;
      resetProductForm();
    }

    files.value = [];
    previewImages.value = [];
  } catch (error) {
    Notify.create({
      type: "negative",
      message: "Error al crear producto",
    });
    console.error("Error uploading images:", error);
  }
};

async function getAllProducts() {
  try {
    loadingActivatedProducts.value = true;
    let url = "/product";
    const params = [];

    if (appliedFilters.value) {
      if (selectedCategory.value) {
        params.push(`category=${selectedCategory.value._id}`);
      }
      if (minPrice.value) {
        params.push(`minPrice=${minPrice.value}`);
      }
      if (maxPrice.value) {
        params.push(`maxPrice=${maxPrice.value}`);
      }
      if (stockFilter.value === 'En stock') {
        params.push(`minStock=1`);
      } else if (stockFilter.value === 'Sin stock') {
        params.push(`maxStock=0`);
      }

      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }
    }

    const response = await getData(url);
    if (response.success) {
      dataProducts.value = response;
      showNotification('positive', 'Productos cargados')
    }
  } catch (error) {
    console.error("Error al traer datos de productos", error);
  } finally {
    loadingActivatedProducts.value = false;

  }
}

async function getAllCategories() {
  try {
    const response = await getData("/categories");
    if (response.data.length > 0) {
      categories.value = response.data;
      console.log("data categorias", categories.value);
    } else {
      return console.log("no hay categorias", response.data);
    }
  } catch (error) {
    console.error(error);
  }
}

// Columnas de la tabla
const columns = [
  { name: "nombre", label: "Nombre", field: "name", align: "center" },
  {
    name: "descripcion",
    label: "Descripción",
    field: "description",
    align: "center",
  },
  {
    name: "stock",
    label: "Stock",
    field: "stock",
    align: "center",
  },
  { name: "categoria", label: "ID Categoria", field: (product) => product.categoryId?.name || 'Sin categoria', align: "center" },
  { name: "precio", label: "Precio", field: "price", align: "center" },
  { name: "imagen", label: "Imagen", align: "center" },
  { name: "acciones", label: "Acciones", field: "acciones", align: "center", style: "width: 5px" },
];

// Ver detalles del producto
function seeDetail(producto) {
  productSelect.value = { ...producto };
  detailDialog.value = true;
}

function calculateDiscountedPrice() {
  const discountAmount = (productOnOffer.value.price * productOnOffer.value.discountPercentage) / 100;
  const finalPrice = productOnOffer.value.price - discountAmount;
  productOnOffer.value.offerPrice = finalPrice
  console.log('Descuento de producto :', finalPrice);
  return parseFloat(finalPrice.toFixed(2));
}

async function establishOffer() {
  try {
    offerDialog.value = true
    productOnOffer.value.offer = 1 // para indicar que esta en oferta
    const response = await putData(`/product/${productOnOffer.value._id}`, {
      data: productOnOffer.value
    })
    showNotification('positive', `¡Oferta aplicada! ${productOnOffer.value.name} ahora tiene un descuento`)
  } catch (error) {
    showNotification('negative', 'Error al aplicar la oferta. Por favor, inténtalo de nuevo')
    console.log(error);
  } finally {
    offerLoading.value = false;
  }
}

// Abrir modal para editar
function editarProducto(producto) {
  productEdit.value = producto;
  editDialog.value = true;
}

// Guardar cambios al editar
async function updateProduct() {
  try {
    loadingEditButton.value = true
    const response = await putData(`/product/${productEdit.value._id}`, {
      data: productEdit.value
    })
    showNotification('positive', `${response.data.name}  se ha actualizado correctamente`)
  } catch (error) {
    showNotification('negative', 'Error Actualizando Producto , Intente Nuevamente')
  } finally {
    loadingEditButton.value = false
    editDialog.value = false
    return getAllProducts()
  }
}

async function loadDeactivatedProducts() {
  try {
    loadingDeactivatedProducts.value = true
    console.log("productos", dataProducts.value);
    const response = await getData("/product/deactivated")
    dataProducts.value = response;

    showNotification('positive', 'Productos inactivos , cargados correctamente')
  } catch (error) {
    showNotification('negative', 'Operacion fallida')
  } finally {
    loadingDeactivatedProducts.value = false
  }
}


// Eliminar producto
function changeState(product) {
  const action = product.state === 1 ? 'Desactivado' : 'Activado'
  showNotification2('Confirmacion', `El producto ${product.name} sera ${action}`, 'warning', async () => {
    try {
      const response = await putData(`/product/state/${product._id}`)
      const state = response.data.state === 0 ? 'Desactivado' : 'Activado'
      showNotification('positive', `El producto ha sido ${state}`);
      getAllProducts();
    } catch (error) {
      showNotification('negative', 'Operacion fallida')
    }
  })
};
</script>

<style scoped>
@import url(../style/Admin.css);

.status-active {
  color: green;
  background-color: #e6ffe6;
  padding: 0.2em 0.5em;
  border-radius: 5px;
}

.status-inactive {
  color: red;
  background-color: #ffe6e6;
  padding: 0.2em 0.5em;
  border-radius: 5px;
}

/* Estilos para el diálogo de producto */
.q-dialog__card {
  border-radius: 8px;
  overflow: hidden;
}

.q-card__section--vert {
  padding: 20px;
}

/* Mejoras para los inputs */
.q-field--outlined .q-field__control {
  border-radius: 4px;
}

.q-field--dense .q-field__control,
.q-field--dense .q-field__marginal {
  height: 40px;
}

/* Estilo para las imágenes de vista previa */
.relative-position {
  transition: all 0.3s ease;
}

.relative-position:hover {
  transform: scale(1.05);
  z-index: 1;
}

/* Estilo para el botón de eliminar imagen */
.absolute-top-right {
  top: -8px;
  right: -8px;
}

/* Scroll personalizado */
.scroll {
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #1976D2 #f5f5f5;
}

.scroll::-webkit-scrollbar {
  width: 6px;
}

.scroll::-webkit-scrollbar-track {
  background: #f5f5f5;
  border-radius: 10px;
}

.scroll::-webkit-scrollbar-thumb {
  background-color: #1976D2;
  border-radius: 10px;
}

.metric-card {
  border-radius: 10px;
  position: relative;
  min-height: 120px;
}

.metric-icon {
  position: absolute;
  top: 15px;
  right: 15px;
  opacity: 0.3;
  font-size: 2.5em;
}

.my-sticky-table {
  height: 400px;
}

.q-table__top {
  background-color: #f5f5f5;
}
</style>