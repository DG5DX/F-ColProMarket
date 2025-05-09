<template>
  <q-layout view="hHh lpR fFf" id="body">
    <!-- Drawer izquierdo fijo -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :width="250"
      class="bg-grey-2"
    >
      <!-- Encabezado del drawer -->
      <div class="drawer-header q-pa-md bg-primary text-white">
        <div class="text-h6">Menú de Administración</div>
        <div class="text-subtitle2">Sistema de Productos</div>
        <q-avatar size="60px" class="q-mt-sm">
          <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg" />
        </q-avatar>
      </div>

      <!-- Botones del drawer -->
      <q-list padding class="q-mt-md">
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="inventory_2" />
          </q-item-section>
          <q-item-section> Productos </q-item-section>
        </q-item>

        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="category" />
          </q-item-section>
          <q-item-section> Compras </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <q-page class="q-pa-md flex flex-center">
        <div
          class="q-pa-md shadow-2 q-mx-auto"
          style="width: 100%; background-color: white"
        >
          <div
            class="text-h5 text-weight-bold"
            style="display: grid; justify-items: center; padding: 10px"
          >
            📄 Detalles Generales
          </div>
          <!-- Rectángulos de métricas -->
          <div class="row q-mb-md q-gutter-md">
            <!-- Total de Productos -->
            <q-card class="col metric-card bg-blue-1">
              <q-card-section >
                <div class="text-h6">Total de Productos</div>
                <div class="text-h4 text-weight-bold"></div>
                <q-icon name="inventory_2" size="md" class="metric-icon" />
                <q-label class="text-h2">{{ dataProducts.count || 0 }}</q-label>
              </q-card-section>
            </q-card>

            <!-- Total de Pedidos -->
            <q-card class="col metric-card bg-green-1">
              <q-card-section>
                <div class="text-h6">Total de Pedidos</div>
                <div class="text-h4 text-weight-bold"></div>
                <q-icon name="shopping_cart" size="md" class="metric-icon" />
              </q-card-section>
            </q-card>

            <!-- Total en Stock -->
            <q-card class="col metric-card bg-orange-1">
              <q-card-section>
                <div class="text-h6">Total en Stock</div>
                <div class="text-h4 text-weight-bold"></div>
                <q-icon name="warehouse" size="md" class="metric-icon" />
                <q-label class="text-h2">{{ dataProducts.stock?.stockAvailable || 0 }}</q-label>
              </q-card-section>
            </q-card>

            <!-- Total Fuera de Stock -->
            <q-card class="col metric-card bg-red-1">
              <q-card-section>
                <div class="text-h6">Total Fuera de Stock</div>
                <div class="text-h4 text-weight-bold"></div>
                <q-icon name="warning" size="md" class="metric-icon" />
                <q-label class="text-h2">{{ dataProducts.stock?.zeroStock || 0 }}</q-label>


              </q-card-section>
            </q-card>
          </div>
        </div>

        <q-card> </q-card>
        <q-card
          class="q-pa-md shadow-2 q-mx-auto"
          style="width: 100%; min-height: 600px;"
        >
          <div class="row justify-between items-center q-mb-md">
            <div class="text-h5 text-weight-bold">📦 Lista de Productos</div>
            <div class="row q-mb-md items-center q-gutter-md">
              <q-input
                filled
                dense
                debounce="300"
                v-model="search"
                label="Buscar producto"
                clearable
                prepend-inner-icon="search"
                class="search"
                @clear="search = ''"
              />
              <q-btn
                label="Crear Producto"
                color="primary"
                icon="add"
                @click="productDialog = true"
                class="col-auto"
              />
            </div>
          </div>

          <!-- Barra de categorías -->
          <div class="row q-mb-md items-center q-gutter-md">
            <q-select
              filled
              dense
              v-model="selectedCategory"
              :options="categories"
              option-label="name"
              label="Filtrar por categoría"
              clearable
              class="col"
              @clear="selectedCategory = null"
            />
            <q-btn
              label="Crear Categoría"
              color="secondary"
              icon="add"
              @click="categoryDialog = true"
              class="col-auto"
            />
            <q-btn
              label="Crear Subcategoría"
              color="secondary"
              icon="add"
              @click="subcategoryDialog = true"
              class="col-auto"
            />
          </div>

          <q-table
            :rows="dataProducts.data || []"
            :columns="columns"
            row-key="nombre"
            flat
            bordered
            wrap-cells
            class="bg-white my-sticky-table"
            :filter="search"
            style="max-height: 400px"
          >
            <!-- Imagen -->
            <template v-slot:body-cell-imagen="props">
              <q-td :props="props">
                <q-img
                  :src="props.row.images[0].urlImage"
                  contain
                  style="width: 60px; height: 60px"
                />
              </q-td>
            </template>

            <!-- Acciones -->
            <template v-slot:body-cell-acciones="props">
              <q-td :props="props">
                <q-btn
                  icon="visibility"
                  flat
                  dense
                  color="primary"
                  @click="verDetalle(props.row)"
                />
                <q-btn
                  icon="edit"
                  flat
                  dense
                  color="warning"
                  @click="editarProducto(props.row)"
                />
                <q-btn
                  icon="delete"
                  flat
                  dense
                  color="negative"
                  @click="eliminarProducto(props.row)"
                />
              </q-td>
            </template>
          </q-table>
        </q-card>
      </q-page>
    </q-page-container>

    <!-- Diálogo Crear Producto -->
    <q-dialog v-model="productDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Agregar Producto</div>
        </q-card-section>
        <q-card-section>
          <q-input v-model="dataProduct.name" label="Nombre del Producto" />
          <q-input
            v-model="dataProduct.description"
            label="Descripción"
            type="textarea"
          />
          <q-input v-model="dataProduct.price" label="Precio" type="number" />
        </q-card-section>

        <!-- Archivos -->
        <div class="q-pa-md">
          <q-file
            v-model="files"
            label="Seleccionar imágenes"
            multiple
            accept="image/*"
            @update:model-value="handleFiles"
            style="max-width: 300px"
          >
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
          </q-file>

          <div class="q-mt-md row q-gutter-sm">
            <q-img
              v-for="(image, index) in previewImages"
              :key="index"
              :src="image"
              style="height: 100px; width: 100px"
              class="rounded-borders"
            >
              <q-btn
                dense
                round
                icon="close"
                color="negative"
                class="absolute-top-right"
                @click="removeImage(index)"
              />
            </q-img>
          </div>
        </div>

        <q-card-actions>
          <q-btn
            label="Cerrar"
            color="secondary"
            @click="productDialog = false"
          />
          <q-btn label="Guardar" color="primary" @click="saveProduct()" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Diálogo Crear Categoría -->
    <q-dialog v-model="categoryDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Agregar Categoría</div>
        </q-card-section>
        <q-card-section class="q-gutter-md">
          <q-input v-model="newCategory.name" label="Nombre de la categoría" />
          <q-input
            v-model="newCategory.description"
            label="Descripción"
            type="textarea"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="secondary" v-close-popup />
          <q-btn flat label="Guardar" color="primary" @click="saveCategory" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    
    <!-- Diálogo Crear subcategoría -->

    <q-dialog v-model="subcategoryDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Agregar subcategoría</div>
        </q-card-section>
        <q-select label="Categoria principal" v-model="newSubcategory.idCategoryFather" :options="categories" option-label="name"  option-value="_id" map-options></q-select>
        <q-card-section class="q-gutter-md">
          <q-input v-model="newSubcategory.name" label="Nombre de la subcategoría" />
          <q-input
            v-model="newSubcategory.description"
            label="Descripción"
            type="textarea"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="secondary" v-close-popup />
          <q-btn flat label="Guardar" color="primary" @click="saveSubcategory()" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Diálogo Detalle -->
    <q-dialog v-model="detalleDialog" persistent>
      <q-card class="q-pa-md" style="min-width: 400px; max-width: 600px">
        <q-card-section class="text-h6 text-primary"
          >Detalle del Producto</q-card-section
        >
        <q-separator />
        <q-card-section class="q-gutter-md">
          <q-img
            :src="productoSeleccionado.imagen"
            style="width: 100%; height: 250px"
            class="rounded-borders"
            contain
          />
          <div>
            <div>
              <strong>Nombre:</strong> {{ productoSeleccionado.nombre }}
            </div>
            <div>
              <strong>Descripción:</strong>
              {{ productoSeleccionado.descripcion }}
            </div>
            <div>
              <strong>Precio:</strong> ${{ productoSeleccionado.precio }}
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cerrar" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Diálogo Editar -->
    <q-dialog v-model="editarDialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section class="text-h6 text-warning"
          >Editar Producto</q-card-section
        >
        <q-separator />
        <q-card-section class="q-gutter-md">
          <q-input
            v-model="productoEditado.nombre"
            label="Nombre del Producto"
          />
          <q-input
            v-model="productoEditado.descripcion"
            label="Descripción"
            type="textarea"
          />
          <q-input
            v-model="productoEditado.precio"
            label="Precio"
            type="number"
          />
          <q-input v-model="productoEditado.imagen" label="URL de Imagen" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="secondary" v-close-popup />
          <q-btn
            flat
            label="Guardar Cambios"
            color="primary"
            @click="actualizarProducto"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted, toRaw } from "vue";
import { Notify } from "quasar";
import { getData, postData } from "../service/service.js";

const files = ref([]);
const dataProduct = ref({ // tengo que arreglar esto despues
  categoryId: "681d74695b4961fb4cdb9e88",
  stock: 0,
  brand:"generico",
  acceptReturns:"si",
});
const previewImages = ref([]);
const leftDrawerOpen = ref(true);
const rightDrawerOpen = ref(false);
const search = ref("");

// Diálogos
const productDialog = ref(false);
const categoryDialog = ref(false);
const subcategoryDialog = ref(false);
const detalleDialog = ref(false);
const editarDialog = ref(false);

// Categorías
const categories = ref([]);
const selectedCategory = ref(null);
const newCategory = ref({});
const newSubcategory = ref({});

//productos
const dataProducts = ref([])

// Datos para ver o editar
const productoSeleccionado = ref({});
const productoEditado = ref({});

onMounted(()=>{
  getAllCategories();
  getAllProducts()
})

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

    formData.append("data", JSON.stringify(dataProduct.value));
    const response = await postData("/product", formData);

    if (response) {
      Notify.create({
        type: "positive",
        message: "producto creado correctamente",
      });
    }

    files.value = [];
    previewImages.value = [];
  } catch (error) {
    Notify.create({
      type: "positive",
      message: "Error al crear producto",
    });
    console.error("Error uploading images:", error);
  }
};

async function saveCategory (){
  try {
    if (!newCategory.value.name || !newCategory.value.description) {
      Notify.create({
        type: "negative",
        message: "Por favor completa todos los datos",
      });
      console.log("datos de categoria incompletos");
      return;
    }

    const response = await postData("/categories",{
      data:{
        name : newCategory.value.name,
        description : newCategory.value.description
      }
    });

    if (response && response.success) { 
      Notify.create({
        type:'positive',
        message :'categoria creada y guardada correctamente'
      });
      newCategory.value = { name: "", description: "" };
      categoryDialog.value = false;
      console.log("categoria creada" , response.data);
    } else {
      const errorMessage = response?.error || 'Error al crear categoría desde la API';
      Notify.create({
        type:'negative',
        message: errorMessage
      });
      console.error("error al crear categoria desde la API" , response);
    }

  } catch (error) {
    console.log("error al crear categoria" , error);
    Notify.create({
      type:'negative',
      message:'Error al crear categoria'
    });
  }
};

async function saveSubcategory (){
  try {
    if (!newSubcategory.value.name || !newSubcategory.value.description) {
      Notify.create({
        type: "negative",
        message: "Por favor completa todos los datos",
      });
      console.log("datos de subcategoria incompletos");
      return;
    }

    const response = await postData("/categories",{
      data:newSubcategory.value
    });

    if (response && response.success) { 
      Notify.create({
        type:'positive',
        message :'subcategoria creada y guardada correctamente'
      });
      newSubcategory.value = {};
      subcategoryDialog.value = false;
      console.log("subcategoria creada" , response.data);
    } else {
      const errorMessage = response?.error || 'Error al crear subcategoría desde la API';
      Notify.create({
        type:'negative',
        message: errorMessage
      });
      console.error("error al crear subcategoria desde la API" , response);
    }

  } catch (error) {
    console.log("error al crear subcategoria" , error);
    Notify.create({
      type:'negative',
      message:'Error al crear subcategoria'
    });
  }
};

async function getAllProducts(){
  try {
    const response = await getData("/product");
    if(response.success){
      dataProducts.value = response
    }
    console.log("productos en admin" , toRaw(dataProducts.value))
  } catch (error) {
    console.error("Error al traer datos de productos" , dataProducts.value)

  }
}

async function getAllCategories() {
  try {
    const response = await getData("/categories");
    if(response.data.length > 0){
      categories.value = response.data
    }
    else{
      return console.log("no hay categorias" , response.data);
    }
  } catch (error) {
    console.error(error)
  }
}





// Filtro dinámico de productos
const productosFiltrados = computed(() => {
  const texto = search.value.trim().toLowerCase();
  const categoria = selectedCategory.value?.value;

  let filtered = dataProduct.value.data;

  if (texto) {
    filtered = filtered.filter(
      (p) =>
        p.nombre.toLowerCase().includes(texto) ||
        p.descripcion.toLowerCase().includes(texto)
    ); // Se movió el paréntesis de cierre aquí
  }

  if (categoria) {
    filtered = filtered.filter((p) => p.categoria === categoria);
  }

  return filtered;
});

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
    aling: "center",
  },
  { name: "precio", label: "Precio", field: "price", align: "center" },
  { name: "imagen", label: "Imagen", align: "center" },
  { name: "acciones", label: "Acciones", field: "acciones", align: "center" },
];

// Ver detalles del producto
function verDetalle(producto) {
  productoSeleccionado.value = { ...producto };
  detalleDialog.value = true;
}

// Abrir modal para editar
function editarProducto(producto) {
  productoEditado.value = { ...producto };
  editarDialog.value = true;
}

// Guardar cambios al editar
function actualizarProducto() {
  const index = dataProduct.value.data.findIndex(
    (p) => p.nombre === productoEditado.value.nombre
  );

  if (index !== -1) {
    dataProduct.value.data[index] = { ...productoEditado.value };

    Notify.create({
      type: "positive",
      message: "Producto actualizado correctamente",
    });
    editarDialog.value = false;
  } else {
    Notify.create({
      type: "negative",
      message: "Error al actualizar el producto",
    });
  }
}

// Eliminar producto
function eliminarProducto(producto) {
  const index =dataProduct.value.data.indexOf(producto);

  if (index !== -1) {
    dataProduct.value.data.splice(index, 1);
    Notify.create({
      type: "warning",
      message: "Producto eliminado",
    });
  }
}
</script>

<style scoped>
@import url(../style/Admin.css);
</style>