<template>
  <q-layout view="hHh lpR fFf" id="body">
    <admin-drawer />
    <q-page-container>
      <q-page class="q-pa-md flex flex-center">
          <q-card name="categorias">
            <q-card class="q-pa-md shadow-2 q-mx-auto" style="width: 100%; min-height: 600px">
              <div class="row justify-between items-center q-mb-md">
                <div class="text-h5 text-weight-bold">🗂️ Lista de Categorías</div>
                <div
                  class="row q-mb-md items-center q-gutter-md"
                  style="display: flex; align-items: flex-start"
                >
                  <q-input
                    filled
                    dense
                    debounce="300"
                    v-model="searchCategory"
                    label="Buscar categoría"
                    clearable
                    prepend-inner-icon="search"
                    class="search"
                    @clear="searchCategory = ''"
                  />
                  <q-btn
                    label="Crear Categoría"
                    color="primary"
                    icon="add"
                    @click="categoryDialog = true"
                    class="col-auto"
                  />
                </div>
              </div>

              <q-table
                :rows="categories"
                :columns="categoryColumns"
                row-key="name"
                flat
                bordered
                wrap-cells
                class="bg-white my-sticky-table"
                :filter="searchCategory"
                style="max-height: 400px"
                separator="cell"
              >
                <template v-slot:body-cell-acciones="props">
                  <q-td :props="props" class="q-table--cell-center">
                    <q-btn icon="edit" flat dense color="warning" @click="editarCategoria(props.row)" class="q-ml-sm" />
                    <q-btn icon="delete" flat dense color="negative" @click="eliminarCategoria(props.row)" class="q-ml-sm" />
                  </q-td>
                </template>
                
                <template v-slot:body-cell-caracteristicas="props">
                  <q-td :props="props" class="q-table--cell-center">
                    <q-chip v-for="(caracteristica, index) in props.row.characteristics" :key="index">
                      {{ caracteristica }}
                    </q-chip>
                  </q-td>
                </template>
              </q-table>
            </q-card>
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
          <q-input v-model="dataProduct.description" label="Descripción" type="textarea" />
          <q-input v-model="dataProduct.price" label="Precio" type="number" />
          <q-select
              filled
              dense
              v-model="dataProduct.category"
              :options="categories"
              option-label="name"
              map-options
              label="Seleccionar Categoria"
              clearable
              class="col"
              @clear="selectedCategory = null"
            />
            <q-card-section>
              <q-input v-for="element of dataProduct?.category?.characteristics" v-model="dataProduct.details[element]" :label="element"></q-input>
            </q-card-section>
            <q-input v-model="dataProduct.stock" label="Cantidad"></q-input>
            <q-select v-model="dataProduct.acceptReturns" :options="acceptReturns" label="Permite Devoluciones" ></q-select>
        </q-card-section>

        <!-- Archivos -->
        <div class="q-pa-md">
          <q-file v-model="files" label="Seleccionar imágenes" multiple accept="image/*"
            @update:model-value="handleFiles" style="max-width: 300px">
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
          </q-file>

          <div class="q-mt-md row q-gutter-sm">
            <q-img v-for="(image, index) in previewImages" :key="index" :src="image" style="height: 100px; width: 100px"
              class="rounded-borders">
              <q-btn dense round icon="close" color="negative" class="absolute-top-right" @click="removeImage(index)" />
            </q-img>
          </div>
        </div>

        <q-card-actions style="display: flex; justify-content: flex-end;">
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
          <q-input v-model="newCategory.description" label="Descripción" type="textarea" />
          <q-card-section class="flex flex-center">
          <q-input label="Agregar caracteristica" v-model="characteristic" ></q-input>
          <q-btn icon="check" @click="addCharacteristic()"></q-btn>
          </q-card-section>
          <q-card-section class="q-gutter-md flex flex-center">
            <q-chip v-for="(element, index) in newCategory?.characteristics" :key="index" removable @remove="removeCharacteristic(index)">
              {{ element }}
            </q-chip>
          </q-card-section>
        </q-card-section>
        <hr>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="secondary" v-close-popup />
          <q-btn flat label="Guardar" color="primary" @click="saveCategory" :loading="loading" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, toRaw } from "vue";
import { Notify } from "quasar";
import { getData, postData } from "../service/service.js";
import adminDrawer from "../components/adminDrawer.vue";

const files = ref([]);
const dataProduct = ref({
  details:{}
});
const loading = ref(false)
const previewImages = ref([]);
const search = ref("");
const searchCategory = ref("");
const tab = ref("productos");
const characteristic = ref(null)
// Diálogos
const productDialog = ref(false);
const categoryDialog = ref(false);

// Categorías
const categories = ref([]);
const selectedCategory = ref(null);
const newCategory = ref({
  characteristics:[]
});

// Columnas para la tabla de categorías
const categoryColumns = [
  { name: "nombre", label: "Nombre", field: "name", align: "center" },
  { name: "descripcion", label: "Descripción", field: "description", align: "center" },
  { name: "caracteristicas", label: "Características", align: "center" },
  { name: "acciones", label: "Acciones", align: "center" }
];

onMounted(() => {
  getAllCategories();
  getAllProducts();
});

async function saveCategory() {
  loading.value = true;
  try {
    if (!newCategory.value.name?.trim() || !newCategory.value.description?.trim()) {
      Notify.create({ type: 'negative', message: 'Completa los datos.' });
      return;
    }

    const catResp = await postData('/categories', { data: newCategory.value });
    if (!catResp.data){
      console.log("id de cateogria al crearla" , catResp.data._id);
      Notify.create({ type: 'negative', message: 'Error al crear categoría.' });
      return;
    }

    Notify.create({ type: 'positive', message: `Categoría creada.`});
    newCategory.value = { name: '', description: '', characteristics: [] };
    getAllCategories();
  } catch (error) {
    const msg = error?.response?.data?.error === 'Duplicate key' ? 'Categoría existente.' : 'Error al guardar.';
    Notify.create({ type: 'negative', message: msg });
  } finally {
    loading.value = false;
    categoryDialog.value = false;
  }
}

async function getAllProducts() {
  try {
    const response = await getData("/product");
    if (response.success) {
      dataProducts.value = response;
    }
    console.log("productos en admin", toRaw(dataProducts.value));
  } catch (error) {
    console.error("Error al traer datos de productos", dataProducts.value);
  }
}

async function getAllCategories() {
  try {
    const response = await getData("/categories");
    if (response.data.length > 0) {
      categories.value = response.data;
      console.log("data categorias" ,categories.value);
    } else {
      return console.log("no hay categorias", response.data);
    }
  } catch (error) {
    console.error(error);
  }
}


function editarCategoria(categoria) {
  // Lógica para editar categoría
}

function eliminarCategoria(categoria) {
  // Lógica para eliminar categoría
}
</script>

<style scoped>
@import url(../style/Admin.css);
</style>