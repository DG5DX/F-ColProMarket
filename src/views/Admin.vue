<template>
  <q-layout view="hHh lpR fFf" id="body">
    <q-page-container>
      <q-page class="q-pa-md">
        <q-card class="q-pa-lg shadow-2 q-mx-auto" style="max-width: 1100px; width: 100%; margin-top: 50px;">
          <div class="row items-center justify-between q-mb-md">
            <div class="text-h5 text-weight-bold" style="font-size: 4vh;">📦 Lista de Productos</div>
          </div>

          <!-- Buscador y Botón -->
          <div class="row q-mb-md items-center q-gutter-md">
            <q-input filled dense debounce="300" v-model="search" label="Buscar producto" clearable
              prepend-inner-icon="search" class="col" />
            <q-btn label="Crear Producto" color="primary" icon="add" @click="productDialog = true" class="col-auto" />
          </div>


          <!-- Tabla -->
          <q-table :rows="productosFiltrados" :columns="columns" row-key="nombre" flat bordered wrap-cells
            class="bg-white" separator="horizontal" no-data-label="No hay productos que coincidan con la búsqueda">
            <template v-slot:body-cell-imagen="props">
              <q-td :props="props">
                <q-img :src="props.row.imagen" contain style="max-width: 80px; max-height: 80px;" />
              </q-td>
            </template>

            <template v-slot:body-cell-estado="props">
              <q-td :props="props">
                <q-badge :color="props.row.estado === 'Disponible' ? 'green' : 'red'" text-color="white" class="q-pa-sm"
                  style="border-radius: 6px;">
                  {{ props.row.estado }}
                </q-badge>
              </q-td>
            </template>

            <template v-slot:body-cell-acciones="props">
              <q-td :props="props">
                <q-btn icon="visibility" flat dense color="primary" @click="verDetalle(props.row)" />
                <q-btn icon="edit" flat dense color="warning" @click="editarProducto(props.row)" />
                <q-btn icon="delete" flat dense color="negative" @click="eliminarProducto(props.row)" />
              </q-td>
            </template>
          </q-table>
        </q-card>
      </q-page>
    </q-page-container>

    <!-- Modal Crear Producto -->
    <q-dialog v-model="productDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Agregar Producto</div>
        </q-card-section>
        <q-card-section>
          <q-input v-model="nuevoProducto.nombre" label="Nombre del Producto" />
          <q-input v-model="nuevoProducto.descripcion" label="Descripción" type="textarea" />
          <q-select v-model="productoEditado.estado" label="Estado" :options="estados"></q-select>
          <q-input v-model="nuevoProducto.precio" label="Precio" type="number" />
          <q-input v-model="imagenUrl" label="Imagen URL" type="url">
            <template v-slot:append>
              <q-btn round dense icon="add_link" @click="agregarImagenUrl" />
            </template>
          </q-input>

          <q-uploader label="Subir Imágenes" accept="image/*" multiple auto-expand :auto-upload="false" :factory="null"
            @added="handleImageUpload" />

          <div class="row q-gutter-sm q-mt-sm">
            <div v-for="(img, index) in imagenesPreview" :key="index" class="relative-position">
              <q-img :src="img" style="width: 80px; height: 80px" class="rounded-borders" />
              <q-btn dense round flat icon="close" color="negative" size="sm" class="absolute-top-right"
                @click="eliminarImagen(index)" />
            </div>
          </div>
        </q-card-section>
        <q-card-actions>
          <q-btn label="Cerrar" color="negative" @click="productDialog = false" />
          <q-btn label="Guardar" color="primary" @click="guardarProducto" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- Modal Detalle del Producto -->
    <q-dialog v-model="detalleDialog" persistent>
      <q-card class="q-pa-md" style="min-width: 400px; max-width: 600px;">
        <q-card-section class="text-h6 text-primary"> {{ productoSeleccionado.nombre }}</q-card-section>
        <q-separator />
        <q-card-section class="q-gutter-md" id="detalle-producto">
          <q-img :src="productoSeleccionado.imagen" style="width: 100%; height: 250px" class="rounded-borders"
            contain />
          <div>
            <div style="display: grid; justify-content: center; color: red; font-size: 3vh;"><strong> ${{
              productoSeleccionado.precio }} </strong></div>
            <div><strong>Descripción:</strong> {{ productoSeleccionado.descripcion }}</div>
            <div style="display: grid; justify-content: center;">{{ productoSeleccionado.estado }}</div>
          </div>
        </q-card-section>
        <q-card-actions align="center">
          <q-btn label="Cerrar" color="negative" v-close-popup />
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
          <q-select v-model="productoEditado.estado" :options="estados"></q-select>
          <q-input v-model="productoEditado.precio" label="Precio" type="number" />
          <q-input v-model="imagenUrl" label="Imagen URL" type="url">
            <template v-slot:append>
              <q-btn round dense icon="add_link" @click="agregarImagenUrl" />
            </template>
          </q-input>

          <q-uploader label="Subir Imágenes" accept="image/*" multiple auto-expand :auto-upload="false" :factory="null"
            @added="handleImageUpload" />

          <div class="row q-gutter-sm q-mt-sm">
            <div v-for="(img, index) in imagenesPreview" :key="index" class="relative-position">
              <q-img :src="img" style="width: 80px; height: 80px" class="rounded-borders" />
              <q-btn dense round flat icon="close" color="negative" size="sm" class="absolute-top-right"
                @click="eliminarImagen(index)" />
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="left">
          <q-btn label="Cerrar" color="negative" v-close-popup />
          <q-btn label="Guardar Cambios" color="primary" @click="actualizarProducto" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Notify } from 'quasar'

// Estado del buscador
const search = ref('')

// Diálogos
const productDialog = ref(false)
const detalleDialog = ref(false)
const editarDialog = ref(false)

// Lista de productos
const productos = ref([
  {
    nombre: "Producto A",
    descripcion: "Descripción del producto A.",
    estado: "Disponible",
    precio: 19.99,
    imagen: "https://www.pcware.com.co/wp-content/uploads/2018/05/delloptiplexaio.jpg"
  },
  {
    nombre: "Producto B",
    descripcion: "Descripción del producto B.",
    estado: "Agotado",
    precio: 29.99,
    imagen: "https://centraldesuministrosgs.com/wp-content/uploads/2022/02/totto-morral-con-porta-pc-ribbon-negro-negro-black-negro-negro-black_1-1.jpg"
  }
])

// Filtro dinámico de productos
const productosFiltrados = computed(() => {
  const texto = search.value.trim().toLowerCase()
  if (!texto) return productos.value
  return productos.value.filter(p =>
    p.nombre.toLowerCase().includes(texto) ||
    p.descripcion.toLowerCase().includes(texto)
  )
})

// Columnas de la tabla
const columns = [
  { name: "nombre", label: "Nombre", field: "nombre", align: "center", sortable: true },
  { name: "descripcion", label: "Descripción", field: "descripcion", align: "center" },
  { name: "creación", label: "Fecha De Creación", field: "Creación", aling: "center" },
  { name: "estado", label: "Estado", field: "estado", align: "center", sortable: true },
  { name: "precio", label: "Precio", field: "precio", align: "center", sortable: true },
  { name: "imagen", label: "Imagen", field: "imagen", align: "center" },
  { name: "acciones", label: "Acciones", field: "acciones", align: "center" }
]

// Estado del nuevo producto
const nuevoProducto = ref({
  nombre: "",
  descripcion: "",
  precio: null,
  imagen: ""
})

// Estados disponibles
const estados = ["Disponible", "Agotado"]

// Vista previa de imágenes
const imagenesPreview = ref([])

// Producto seleccionado
const productoSeleccionado = ref({})
const productoEditado = ref({})

// Ver detalle
function verDetalle(producto) {
  productoSeleccionado.value = { ...producto }
  detalleDialog.value = true
}

// Guardar nuevo producto
function guardarProducto() {
  if (
    !nuevoProducto.value.nombre ||
    !nuevoProducto.value.descripcion ||
    !nuevoProducto.value.precio ||
    imagenesPreview.value.length === 0
  ) {
    Notify.create({
      type: "negative",
      message: "Por favor completa todos los campos e incluye al menos una imagen"
    })
    return
  }

  productos.value.push({
    ...nuevoProducto.value,
    imagen: imagenesPreview.value[0],
    estado: "Disponible"
  })

  Notify.create({
    type: "positive",
    message: "Producto agregado exitosamente"
  })

  nuevoProducto.value = { nombre: "", descripcion: "", precio: null, imagen: "" }
  imagenesPreview.value = []
  productDialog.value = false
}

// Editar producto
function editarProducto(producto) {
  productoEditado.value = { ...producto }
  imagenesPreview.value = [producto.imagen]
  editarDialog.value = true
}

// Actualizar producto
function actualizarProducto() {
  const index = productos.value.findIndex(p => p.nombre === productoEditado.value.nombre)
  if (index !== -1) {
    productos.value[index] = {
      ...productoEditado.value,
      imagen: imagenesPreview.value[0]
    }

    Notify.create({
      type: "positive",
      message: "Producto actualizado correctamente"
    })

    editarDialog.value = false
    imagenesPreview.value = []
  }
}

// Eliminar producto
function eliminarProducto(producto) {
  productos.value = productos.value.filter(p => p.nombre !== producto.nombre)

  Notify.create({
    type: "warning",
    message: "Producto eliminado"
  })
}

// Cargar imagen por URL
const imagenUrl = ref("")
function agregarImagenUrl() {
  if (imagenUrl.value) {
    imagenesPreview.value.push(imagenUrl.value)
    imagenUrl.value = ""
  }
}

// Cargar imagen desde uploader
function handleImageUpload(files) {
  Array.from(files).forEach(file => {
    const reader = new FileReader()
    reader.onload = e => {
      imagenesPreview.value.push(e.target.result)
    }
    reader.readAsDataURL(file)
  })
}

// Eliminar imagen individual
function eliminarImagen(index) {
  imagenesPreview.value.splice(index, 1)
}
</script>

<style scoped>
#body {
  background: linear-gradient(to right,
      rgba(255, 255, 0, 0.5),
      rgba(0, 0, 255, 0.5),
      rgba(255, 0, 0, 0.5));
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

#detalle-producto {
  display: grid;
  justify-content: center;
  justify-items: center;
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
</style>