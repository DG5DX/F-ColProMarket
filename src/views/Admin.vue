<template>
    <q-layout view="hHh lpR fFf" id="body">
      <!-- Drawer -->
      <q-drawer
        v-model="rightDrawerOpen"
        side="right"
        :show-if-above="false"
        :breakpoint="900"
        bordered
        class="custom-drawer"
      >
        <div class="drawer-header q-pa-md flex items-center">
          <img
            src="../assets/MiniLogo.jpeg"
            alt="Logo"
            class="mini-logo q-mr-md"
          />
          <h3 class="text-h6 q-ma-none">Menú</h3>
        </div>
        <q-separator />
        <q-list>
          <q-item clickable v-ripple class="drawer-item">
            <q-item-section avatar>
              <q-icon name="shopping_bag" />
            </q-item-section>
            <q-item-section>Productos</q-item-section>
          </q-item>
          <q-item clickable v-ripple class="drawer-item">
            <q-item-section avatar>
              <q-icon name="groups" />
            </q-item-section>
            <q-item-section>Comunidad</q-item-section>
          </q-item>
          <q-item clickable v-ripple class="drawer-item">
            <q-item-section avatar>
              <q-icon name="local_offer" />
            </q-item-section>
            <q-item-section>Rebajas</q-item-section>
          </q-item>
          <q-item clickable v-ripple class="drawer-item">
            <q-item-section avatar>
              <q-icon name="contact_mail" />
            </q-item-section>
            <q-item-section>Contacto</q-item-section>
          </q-item>
          <q-separator class="q-my-sm" />
          <q-item clickable v-ripple class="drawer-item">
            <q-item-section avatar>
              <q-icon name="help_outline" />
            </q-item-section>
            <q-item-section>Ayuda</q-item-section>
          </q-item>
          <q-item clickable v-ripple class="drawer-item">
            <q-item-section avatar>
              <q-icon name="wallet" />
            </q-item-section>
            <q-item-section>Metodo De Pago</q-item-section>
          </q-item>
          <q-item clickable v-ripple class="drawer-item">
            <q-item-section avatar>
              <q-icon name="shopping_cart" />
            </q-item-section>
            <q-item-section>Carrito</q-item-section>
          </q-item>
          <q-separator class="q-my-sm" />
          <q-item clickable v-ripple class="drawer-item">
            <q-item-section avatar>
              <q-icon name="logout" color="red" />
            </q-item-section>
            <q-item-section style="color: red;">Cerrar Sesión</q-item-section>
          </q-item>
          <q-separator class="q-my-sm" />
        </q-list>
      </q-drawer>
  
      <!-- Header -->
      <q-header elevated>
        <div id="app">
          <router-link to="/" id="logo" style="text-decoration: none">
            <img src="../assets/Logo ColProMarket.jpeg" alt="logo" />
          </router-link>
          <div id="search">
            <q-input v-model="search" filled type="search" placeholder="Buscar">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <div id="nav-buttons">
            <q-btn-group push>
              <q-btn push label="Productos" color="grey" />
              <q-btn push label="Comunidad" color="grey" />
              <q-btn push label="Rebajas" color="grey" />
              <q-btn push label="Contacto" color="grey" />
            </q-btn-group>
          </div>
          <div id="menu">
            <q-btn
              color="dark"
              icon="menu"
              @click="rightDrawerOpen = !rightDrawerOpen"
              flat
              round
            />
          </div>
        </div>
      </q-header>
  
      <!-- Contenido principal -->
      <q-page-container>
        <q-page class="q-pa-md flex flex-center">
          <q-card
            class="q-pa-md shadow-2 q-mx-auto"
            style="max-width: 1000px; width: 100%"
          >
            <div class="row justify-between items-center q-mb-md">
              <div class="text-h6">Lista de Productos</div>
              <q-btn
                label="Crear Producto"
                color="primary"
                icon="add"
                @click="productDialog = true"
              />
            </div>
  
            <q-table
              :rows="productos"
              :columns="columns"
              row-key="nombre"
              flat
              bordered
              wrap-cells
              class="bg-white"
            >
              <template v-slot:body-cell-imagen="props">
                <q-td :props="props">
                  <q-img
                    :src="props.row.imagen"
                    contain
                    style="width: 60px; height: 60px"
                  />
                </q-td>
              </template>
  
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
  
      <!-- Footer -->
      <div
        class="row justify-around items-start q-gutter-md full-width"
        id="footer"
      >
        <!-- Footer content omitted for brevity -->
      </div>
  
      <!-- Modal Crear Producto -->
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
            <q-input
              v-model="dataProduct.price"
              label="Precio"
              type="number"
            />
          </q-card-section>

    <!-- Input para múltiples imágenes -->


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

    <!-- Vista previa de imágenes seleccionadas -->
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

    <!-- Botón para subir las imágenes -->

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
  <!-- Modal Detalle del Producto -->
  <q-dialog v-model="detalleDialog" persistent>
    <q-card class="q-pa-md" style="min-width: 400px; max-width: 600px;">
      <q-card-section class="text-h6 text-primary">Detalle del Producto</q-card-section>
      <q-separator />
      <q-card-section class="q-gutter-md">
        <q-img
          :src="productoSeleccionado.imagen"
          style="width: 100%; height: 250px"
          class="rounded-borders"
          contain
        />
        <div>
          <div><strong>Nombre:</strong> {{ productoSeleccionado.nombre }}</div>
          <div><strong>Descripción:</strong> {{ productoSeleccionado.descripcion }}</div>
          <div><strong>Precio:</strong> ${{ productoSeleccionado.precio }}</div>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cerrar" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <!-- Modal Editar Producto -->
  <q-dialog v-model="editarDialog" persistent>
    <q-card style="min-width: 400px">
      <q-card-section class="text-h6 text-warning">Editar Producto</q-card-section>
      <q-separator />
      <q-card-section class="q-gutter-md">
        <q-input v-model="productoEditado.nombre" label="Nombre del Producto" />
        <q-input v-model="productoEditado.descripcion" label="Descripción" type="textarea" />
        <q-input v-model="productoEditado.precio" label="Precio" type="number" />
        <q-input v-model="productoEditado.imagen" label="URL de Imagen" />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancelar" color="secondary" v-close-popup />
        <q-btn flat label="Guardar Cambios" color="primary" @click="actualizarProducto" />
      </q-card-actions>
    </q-card>
  </q-dialog>
    </q-layout>
  </template>
    
  <script setup>
  import { ref } from 'vue'
  import { Notify } from 'quasar'
import { postData } from '../service/service';
const files = ref([]);
const dataProduct = ref({
  categoryId:"64bfc6a3e9e6f3a8d1e55c21",
  stock:12,
  user:"64bfc6a3e9e6f3a8d1e55c22"
});
const previewImages = ref([]);
  // Estado de interfaz
  const rightDrawerOpen = ref(false)
  const search = ref('')
  
  // Diálogos
  const productDialog = ref(false)
  const detalleDialog = ref(false)
  const editarDialog = ref(false)



const handleFiles = (selectedFiles) => {
  previewImages.value = [];
  
  if (!selectedFiles) return;
  
  Array.from(selectedFiles).forEach(file => {
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
      formData.append('images', file);
    });

    formData.append('data', JSON.stringify(dataProduct.value))
    const response = await postData("/product", formData);

    
    if(response){
      Notify.create({
        type: "positive",
        message: "producto creado correctamente"
      })
    }
    
    files.value = [];
    previewImages.value = [];
    
  } catch (error) {
    Notify.create({
        type: "positive",
        message: "Error al crear producto"
      })
    console.error('Error uploading images:', error);
  }
};

  
  // Lista de productos
  const productos = ref([
    {
      nombre: "Producto A",
      descripcion: "Descripción del producto A.",
      precio: 19.99,
      imagen: "https://www.pcware.com.co/wp-content/uploads/2018/05/delloptiplexaio.jpg"
    },
    {
      nombre: "Producto B",
      descripcion: "Descripción del producto B.",
      precio: 29.99,
      imagen: "https://centraldesuministrosgs.com/wp-content/uploads/2022/02/totto-morral-con-porta-pc-ribbon-negro-negro-black-negro-negro-black_1-1.jpg"
    }
  ])
  
  // Nuevos datos para crear producto

  
  // Datos para ver o editar
  const productoSeleccionado = ref({})
  const productoEditado = ref({})
  
  // Columnas de la tabla
  const columns = [
    { name: "nombre", label: "Nombre", field: "nombre", align: "left" },
    { name: "descripcion", label: "Descripción", field: "descripcion", align: "left" },
    { name: "precio", label: "Precio", field: "precio", align: "left" },
    { name: "imagen", label: "Imagen", field: "imagen", align: "center" },
    { name: "acciones", label: "Acciones", field: "acciones", align: "center" }
  ]
  
  // Ver detalles del producto
  function verDetalle(producto) {
    productoSeleccionado.value = { ...producto }
    detalleDialog.value = true
  }
  
  // Crear producto
  function guardarProducto() {
    if (
      !nuevoProducto.value.nombre ||
      !nuevoProducto.value.descripcion ||
      !nuevoProducto.value.precio ||
      !nuevoProducto.value.imagen
    ) {
      Notify.create({
        type: "negative",
        message: "Por favor completa todos los campos"
      })
      return
    }
  
    productos.value.push({ ...nuevoProducto.value })
  
    Notify.create({
      type: "positive",
      message: "Producto agregado exitosamente"
    })
  
    // Limpiar y cerrar
    nuevoProducto.value = { nombre: "", descripcion: "", precio: null, imagen: "" }
    productDialog.value = false
  }
  
  // Abrir modal para editar
  function editarProducto(producto) {
    productoEditado.value = { ...producto }
    editarDialog.value = true
  }
  
  // Guardar cambios al editar
  function actualizarProducto() {
    const index = productos.value.findIndex(p => p.nombre === productoEditado.value.nombre)
  
    if (index !== -1) {
      productos.value[index] = { ...productoEditado.value }
  
      Notify.create({
        type: "positive",
        message: "Producto actualizado correctamente"
      })
      editarDialog.value = false
    } else {
      Notify.create({
        type: "negative",
        message: "Error al actualizar el producto"
      })
    }
  }
  
  // Eliminar producto
  function eliminarProducto(producto) {
    const index = productos.value.indexOf(producto)
  
    if (index !== -1) {
      productos.value.splice(index, 1)
      Notify.create({
        type: "warning",
        message: "Producto eliminado"
      })
    }
  }
  </script>
  
    
    <style scoped>
  #body {
    background: linear-gradient(
      to right,
      rgba(255, 255, 0, 0.5),
      rgba(0, 0, 255, 0.5),
      rgba(255, 0, 0, 0.5)
    );
  }
  #app {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    align-items: center;
    padding: 5px;
    gap: 10px;
    background-color: #f9f9f9;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  #logo img {
    max-height: 10vh;
    object-fit: contain;
  }
  
  #footer {
    background-color: #f9f9f9;
  }
  
  .mini-logo {
    height: 40px;
    object-fit: contain;
    border-radius: 4px;
  }
  
  #search {
    flex: 1;
    min-width: 200px;
    max-width: 400px;
    display: flex;
    justify-content: center;
  }
  
  #nav-buttons {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    justify-content: center;
    align-items: center;
    margin-left: 7vh;
  }
  
  #menu {
    margin-left: auto;
  }
  
  #header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }
  
  .custom-drawer {
    background: linear-gradient(to bottom, #ffffff, #f9f9f9);
    box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  }
  
  .drawer-header {
    background-color: #f1f1f1;
    padding: 16px;
    border-bottom: 1px solid #ddd;
  }
  
  .drawer-item {
    padding: 10px 16px;
    font-size: 15px;
    border-radius: 8px;
    margin: 4px 8px;
    transition: background-color 0.2s ease;
  }
  
  .drawer-item:hover {
    background-color: #f5f5f5;
  }
  
  .drawer-item:active {
    background-color: #e0e0e0;
  }
  
  .productos-wrapper {
    background-color: #f0f0f0;
    overflow-x: auto;
    margin-top: 3vh;
    margin-bottom: 5vh;
  }
  
  .productos {
    flex-wrap: wrap;
    overflow-x: auto;
    display: flex;
    white-space: nowrap;
    justify-content: space-evenly;
  }
  
  .my-card {
    flex: 0 0 auto;
    width: 250px;
    text-align: center;
  }
  
  .productos .q-btn {
    margin: 10px;
  }
  
  .q-carousel-slide {
    max-height: 500px;
  }
  
  .q-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-bottom: 1px solid #ccc;
  }
  
  @media (max-width: 990px) {
    #nav-buttons {
      margin: 0%;
    }
    #menu {
      display: block;
    }
  }
  
  @media (max-width: 900px) {
    #nav-buttons {
      display: none;
    }
  }
  
  @media (max-width: 500px) {
    #logo img {
      max-height: 6vh;
    }
  }
  </style>