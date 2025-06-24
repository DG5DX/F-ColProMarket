<template>
  <q-layout view="hHh lpR fFf" id="body">
    <admin-drawer />
    <q-page-container>
      <q-page class="q-pa-md flex flex-center">
        <template v-if="loading">
          <q-card class="q-pa-md shadow-2 q-mx-auto" style="width: 100%; background-color: white">
            <div class="text-h5 text-weight-bold" style="display: grid; justify-items: center; padding: 10px">
              <q-skeleton type="text" width="200px" />
            </div>
            <div class="row q-mb-md q-gutter-md">
              <q-card v-for="n in 3" :key="n" class="col metric-card">
                <q-card-section>
                  <div class="text-h6">
                    <q-skeleton type="text" width="120px" />
                  </div>
                  <q-skeleton type="QAvatar" size="md" class="metric-icon" />
                  <q-label class="text-h2">
                    <q-skeleton type="text" width="80px" height="60px" />
                  </q-label>
                </q-card-section>
              </q-card>
            </div>
          </q-card>
        </template>

        <template v-else>
          <q-card class="q-pa-md shadow-2 q-mx-auto" style="width: 100%; background-color: white">
            <div class="text-h5 text-weight-bold" style="display: grid; justify-items: center; padding: 10px">
              📦 Movimientos de Inventario
            </div>
            <div class="row q-mb-md q-gutter-md">

              <q-card class="col metric-card bg-orange-1">
                <q-card-section>
                  <div class="text-h6">Movimientos totales</div>
                  <q-icon name="update" size="md" class="metric-icon" />
                  <q-label class="text-h2">{{ inventoryData.count || 0 }}</q-label>
                </q-card-section>
              </q-card>


              <q-card class="col metric-card bg-blue-1">
                <q-card-section>
                  <div class="text-h6">Entradas Totales</div>
                  <q-icon name="input" size="md" class="metric-icon" />
                  <q-label class="text-h2">{{ inventoryData.incomingsCount || 0 }}</q-label>
                </q-card-section>
              </q-card>

              <q-card class="col metric-card bg-green-1">
                <q-card-section>
                  <div class="text-h6">Salidas Totales</div>
                  <q-icon name="output" size="md" class="metric-icon" />
                  <q-label class="text-h2">{{ inventoryData.outboundsCount || 0 }}</q-label>
                </q-card-section>
              </q-card>

              <q-card class="col metric-card bg-orange-1">
                <q-card-section>
                  <div class="text-h6">Movimientos Hoy</div>
                  <q-icon name="update" size="md" class="metric-icon" />
                  <q-label class="text-h2">{{ inventoryData.movementsToday || 0 }}</q-label>
                </q-card-section>
              </q-card>


            </div>
          </q-card>
        </template>

        <q-card class="q-pa-md shadow-2 q-mx-auto q-mt-md"
          style="width: 100%; background-color: #f5f5f5; margin-bottom: 16px">
          <div class="text-h6 text-weight-bold q-mb-md">
            🔍 Filtros Avanzados de Inventario
          </div>

          <div class="row q-gutter-md items-center" style="display: flex; align-items: center">
            <q-btn label="Cargar salidas" color="primary" icon="outbox" @click="loadOutbounds"></q-btn>
            <q-btn label="Cargar entradas" color="primary" icon="move_to_inbox" @click="loadIncomings"></q-btn>

            <q-input filled dense v-model="filters.startDate" label="Fecha de inicio" type="date" clearable class="col"
              style="min-width: 150px" />

            <q-input filled dense v-model="filters.endDate" label="Fecha final" type="date" clearable class="col"
              style="min-width: 150px" />


            <div class="row q-gutter-sm" style="margin-top: 0%">
              <q-btn label="Aplicar Filtros" color="primary" dense style="height: 40px" @click="applyFilters"
                :loading="loading" />
              <q-btn label="Limpiar Filtros" color="negative" outline dense style="height: 40px" @click="clearFilters"
                :disable="loading" />
            </div>
          </div>
        </q-card>

        <template v-if="loading">
          <q-card class="q-pa-md shadow-2 q-mx-auto" style="width: 100%; min-height: 600px">
            <div class="row justify-between items-center q-mb-md">
              <div class="text-h5 text-weight-bold">
                <q-skeleton type="text" width="200px" />
              </div>
              <div class="row q-mb-md items-center q-gutter-md">
                <q-skeleton type="text" width="300px" height="40px" />
              </div>
            </div>

            <q-table flat bordered :rows="[]" :columns="movementColumns" row-key="id" hide-pagination>
              <template v-slot:body="props">
                <q-tr v-for="n in 5" :key="n">
                  <q-td v-for="col in movementColumns" :key="col.name">
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
              <h5 class="q-my-md">
                Lista de
                <q-badge :color="tableMovements.type === 'inbounds' ? 'positive' : 'negative'"
                  :label="tableMovements.type === 'inbounds' ? 'entradas' : 'salidas'" class="q-px-sm q-py-xs text-bold"
                  style="font-size: 1em;" />
              </h5>
              <div class="row q-mb-md items-center q-gutter-md">

              </div>
            </div>

            <q-table :rows="tableMovements.data" :columns="movementColumns" row-key="id" flat bordered wrap-cells
              class="bg-white my-sticky-table" :filter="search" style="max-height: 400px" separator="cell"
              :loading="loading" :pagination="pagination">
              <template v-slot:body-cell-tipo="props">
                <q-td :props="props" class="q-table--cell-center">
                  <q-badge :color="props.row.type === 'inbound' ? 'positive' : 'negative'">
                    {{ props.row.type === 'inbound' ? 'Entrada' : 'Salida' }}
                  </q-badge>
                </q-td>
              </template>

              <template v-slot:body-cell-detalles="props">
                <q-td :props="props" class="q-table--cell-center">
                  <q-btn icon="visibility" flat dense color="info" @click="seeMovementDetails(props.row)"
                    :disable="loading" />
                </q-td>
              </template>
            </q-table>
          </q-card>
        </template>
      </q-page>
    </q-page-container>

    <q-dialog v-model="movementDetailDialog" persistent>
      <q-card class="modern-dialog" style="min-width: 600px; max-width: 900px; max-height: 90vh;">
        <q-card-section class="dialog-header text-white">
          <div class="text-h5 flex items-center">
            <q-icon name="receipt_long" class="q-mr-sm" size="md" />
            Detalle de Movimiento #{{ selectedMovement._id }}
          </div>
        </q-card-section>

        <q-card-section class="dialog-content scroll" style="max-height: calc(90vh - 160px);">

          <div class="info-card q-mb-lg">
            <div class="card-title">
              <q-icon name="info" class="q-mr-sm" />
              Información del Movimiento
            </div>
            <div class="card-content">
              <div class="row q-col-gutter-md">
                <div class="col-xs-12 col-sm-6">
                  <div class="info-item">
                    <span class="info-label">Fecha:</span>
                    <span class="info-value">{{ formatISODateToSpanish(selectedMovement.date) }}</span>
                  </div>
                </div>
                <div class="col-xs-12 col-sm-6">
                  <div class="info-item">
                    <span class="info-label">Tipo:</span>
                    <q-badge :color="selectedMovement.type === 'inbound' ? 'positive' : 'negative'"
                      class="movement-badge">
                      {{ selectedMovement.type === 'inbound' ? 'Entrada' : 'Salida' }}
                    </q-badge>
                  </div>
                </div>
                <div class="col-xs-12 col-sm-6">
                  <div class="info-item">
                    <span class="info-label">Cantidad:</span>
                    <span class="info-value quantity">{{ selectedMovement.quantity }}</span>
                  </div>
                </div>
                <div class="col-xs-12 col-sm-6">
                  <div class="info-item">
                    <span class="info-label">Motivo/Razón:</span>
                    <span class="info-value">{{ selectedMovement.reason || 'N/A' }}</span>
                  </div>
                </div>
                <div class="col-xs-12 col-sm-6">
                  <div class="info-item">
                    <span class="info-label">Fecha de Creación:</span>
                    <span class="info-value">{{ formatISODateToSpanish(selectedMovement.createdAt) }}</span>
                  </div>
                </div>
                <div class="col-xs-12 col-sm-6">
                  <div class="info-item">
                    <span class="info-label">Última Actualización:</span>
                    <span class="info-value">{{ formatISODateToSpanish(selectedMovement.updatedAt) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="info-card q-mb-lg">
            <div class="card-title">
              <q-icon name="inventory_2" class="q-mr-sm" />
              Detalles del Producto
            </div>
            <div class="card-content">
              <div v-if="selectedMovement.productId">
                <div class="row q-col-gutter-md q-mb-md">
                  <div class="col-xs-12 col-sm-6">
                    <div class="info-item">
                      <span class="info-label">Nombre Producto:</span>
                      <span class="info-value product-name">{{ selectedMovement.productId.name }}</span>
                    </div>
                  </div>
                  <div class="col-xs-12 col-sm-6">
                    <div class="info-item">
                      <span class="info-label">Marca:</span>
                      <span class="info-value">{{ selectedMovement.productId.brand || 'N/A' }}</span>
                    </div>
                  </div>
                  <div class="col-xs-12 col-sm-6">
                    <div class="info-item">
                      <span class="info-label">Precio:</span>
                      <span class="info-value price">
                        ${{ selectedMovement.productId.price ? selectedMovement.productId.price.toLocaleString('es-CO')
                        :
                        'N/A' }}
                      </span>
                    </div>
                  </div>
                  <div class="col-xs-12 col-sm-6">
                    <div class="info-item">
                      <span class="info-label">Stock Actual:</span>
                      <span class="info-value stock">{{ selectedMovement.productId.stock || 'N/A' }}</span>
                    </div>
                  </div>
                  <div class="col-xs-12">
                    <div class="info-item">
                      <span class="info-label">Descripción:</span>
                      <p class="info-value description">{{ selectedMovement.productId.description || 'Sin descripción'
                        }}
                      </p>
                    </div>
                  </div>
                </div>

                <div v-if="selectedMovement.productId.details" class="specifications q-mb-md">
                  <h6 class="spec-title">Especificaciones:</h6>
                  <div class="spec-list">
                    <div v-for="(value, key) in selectedMovement.productId.details" :key="key" class="spec-item">
                      <span class="spec-key">{{ key }}:</span>
                      <span class="spec-value">{{ value }}</span>
                    </div>
                  </div>
                </div>

                <div v-if="selectedMovement.productId.images && selectedMovement.productId.images.length > 0"
                  class="images-section">
                  <h6 class="images-title">Imágenes:</h6>
                  <div class="images-grid">
                    <div v-for="image in selectedMovement.productId.images" :key="image.publicId"
                      class="image-container">
                      <q-img :src="image.urlImage" spinner-color="primary" class="product-image" />
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="no-data">
                <q-icon name="info" class="q-mr-sm" />
                No se encontró información del producto asociado.
              </div>
            </div>
          </div>

          <div class="info-card">
            <div class="card-title">
              <q-icon name="person" class="q-mr-sm" />
              Información del Cliente
            </div>
            <div class="card-content">
              <div v-if="selectedMovement.userId">
                <div class="row q-col-gutter-md">
                  <div class="col-xs-12 col-sm-6">
                    <div class="info-item">
                      <span class="info-label">Nombre Completo:</span>
                      <span class="info-value user-name">{{ selectedMovement.userId.name }} {{
                        selectedMovement.userId.lastName }}</span>
                    </div>
                  </div>
                  <div class="col-xs-12 col-sm-6">
                    <div class="info-item">
                      <span class="info-label">Email:</span>
                      <span class="info-value">{{ selectedMovement.userId.email }}</span>
                    </div>
                  </div>
                  <div class="col-xs-12 col-sm-6">
                    <div class="info-item">
                      <span class="info-label">Teléfono:</span>
                      <span class="info-value">{{ selectedMovement.userId.phone || 'N/A' }}</span>
                    </div>
                  </div>
                  <div class="col-xs-12 col-sm-6">
                    <div class="info-item">
                      <span class="info-label">Rol:</span>
                      <q-badge :color="selectedMovement.userId.role === 0 ? 'primary' : 'secondary'">
                        {{ selectedMovement.userId.role === 0 ? 'Administrador' : 'Usuario' }}
                      </q-badge>
                    </div>
                  </div>
                  <div v-if="selectedMovement.userId.shippingAddress" class="col-xs-12">
                    <div class="info-item">
                      <span class="info-label">Dirección:</span>
                      <span class="info-value address">
                        {{ selectedMovement.userId.shippingAddress.street }},
                        {{ selectedMovement.userId.shippingAddress.city }},
                        {{ selectedMovement.userId.shippingAddress.state }},
                        {{ selectedMovement.userId.shippingAddress.country }} -
                        {{ selectedMovement.userId.shippingAddress.zipCode }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="no-data">
                <q-icon name="info" class="q-mr-sm" />
                No se encontró información del usuario.
              </div>
            </div>
          </div>

        </q-card-section>

        <q-card-actions class="dialog-footer">
          <q-btn label="Cerrar" color="primary" unelevated class="close-btn" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { Notify } from "quasar";
import { getData } from "../service/service.js";
import adminDrawer from "../components/adminDrawer.vue";
import { formatISODateToSpanish, showNotification } from "../utils/utils.js";

const search = ref("");
const inventoryData = ref({});
const tableMovements = ref({
  type: 'outbounds', // Por defecto, mostramos las salidas al cargar
  data: []
});
const loading = ref(false);
const products = ref([]);
const movementTypes = ['Entrada', 'Salida'];

onMounted(() => {
  loadInventoryData();
});

// Filtros
const filters = ref({
  product: null,
  type: null,
  startDate: "",
  endDate: "", // Agregamos un filtro para la fecha final
});

// Paginación
const pagination = ref({
  sortBy: 'date',
  descending: true,
  page: 1,
  rowsPerPage: 10
});

// Columnas de la tabla de movimientos
const movementColumns = [
  {
    name: "fecha",
    label: "Fecha",
    field: row => formatISODateToSpanish(row.date),
    align: "center",
    sortable: true
  },
  {
    name: "producto",
    label: "Producto",
    field: row => row.productId?.name || 'N/A',
    align: "center"
  },
  {
    name: "tipo",
    label: "Tipo",
    field: "type",
    align: "center"
  },
  {
    name: "cantidad",
    label: "Cantidad",
    field: "quantity",
    align: "center"
  },
  {
    name: "responsable",
    label: "Responsable",
    field: row => row.userId ? `${row.userId.name} ${row.userId.lastName}` : 'Sistema', // Ajustado para el responsable
    align: "center"
  },
  {
    name: "referencia",
    label: "Referencia",
    field: row => row._id || 'N/A',
    align: "center"
  },
  {
    name: "detalles",
    label: "Detalles",
    align: "center"
  },
];

// Diálogos
const movementDetailDialog = ref(false);
const selectedMovement = ref({});

// Data original de los movimientos (sin filtrar)
const rawIncomings = ref([]);
const rawOutbounds = ref([]);

async function loadInventoryData() {
  try {
    loading.value = true;
    const response = await getData("/inventory/movements");
    inventoryData.value = response.data;
    rawIncomings.value = response.data.incomings; // Guardamos las entradas originales
    rawOutbounds.value = response.data.outbounds; // Guardamos las salidas originales

    // Inicialmente mostramos las salidas y aplicamos los filtros si ya existen
    tableMovements.value.data = applyFiltersToData(rawOutbounds.value, 'outbounds');
    tableMovements.value.type = 'outbounds';

    showNotification('positive', 'Datos de inventario cargados');
  } catch (error) {
    console.error("[loadInventoryData]", error);
    showNotification('negative', 'Error cargando datos de inventario');
  } finally {
    loading.value = false;
  }
}

// Función para aplicar los filtros a un conjunto de datos
function applyFiltersToData(data, type) {
  let filteredData = [...data]; // Hacemos una copia para no modificar el original

  // Filtrar por fecha de inicio
  if (filters.value.startDate) {
    const startDate = new Date(filters.value.startDate);
    startDate.setHours(0, 0, 0, 0); // Establecer la hora al inicio del día
    filteredData = filteredData.filter(movement => {
      const movementDate = new Date(movement.date);
      movementDate.setHours(0, 0, 0, 0); // Establecer la hora al inicio del día
      return movementDate >= startDate;
    });
  }

  // Filtrar por fecha de fin
  if (filters.value.endDate) {
    const endDate = new Date(filters.value.endDate);
    endDate.setHours(23, 59, 59, 999); // Establecer la hora al final del día
    filteredData = filteredData.filter(movement => {
      const movementDate = new Date(movement.date);
      movementDate.setHours(0, 0, 0, 0); // Establecer la hora al inicio del día
      return movementDate <= endDate;
    });
  }

  // Puedes agregar más filtros aquí (producto, tipo de movimiento, etc.)
  // Por ejemplo, para filtrar por tipo (aunque ya se maneja con los botones de "cargar salidas/entradas"):
  if (filters.value.type && type !== 'all') { // 'all' sería si tuvieras un solo arreglo de movimientos
     filteredData = filteredData.filter(movement => movement.type === filters.value.type.toLowerCase());
  }

  return filteredData;
}

// Función que se llama al hacer clic en "Aplicar Filtros"
function applyFilters() {
  loading.value = true;
  // Aplicamos los filtros al tipo de datos que se está mostrando actualmente
  if (tableMovements.value.type === 'inbounds') {
    tableMovements.value.data = applyFiltersToData(rawIncomings.value, 'inbounds');
  } else if (tableMovements.value.type === 'outbounds') {
    tableMovements.value.data = applyFiltersToData(rawOutbounds.value, 'outbounds');
  } else {
    // Si no hay un tipo seleccionado, podrías cargar un arreglo combinado o el predeterminado
    tableMovements.value.data = applyFiltersToData(rawOutbounds.value, 'outbounds');
  }

  setTimeout(() => {
    loading.value = false;
    showNotification('info', 'Filtros aplicados');
  }, 500);
}

// Función para cargar salidas con filtros aplicados
function loadOutbounds() {
  tableMovements.value.data = applyFiltersToData(rawOutbounds.value, 'outbounds');
  tableMovements.value.type = 'outbounds';
}

// Función para cargar entradas con filtros aplicados
function loadIncomings() {
  tableMovements.value.data = applyFiltersToData(rawIncomings.value, 'inbounds');
  tableMovements.value.type = 'inbounds';
}

function clearFilters() {
  filters.value = {
    product: null,
    type: null,
    startDate: "",
    endDate: "", // Limpiar también la fecha final
  };
  // Volver a cargar los datos originales sin filtrar para el tipo actual
  if (tableMovements.value.type === 'inbounds') {
    tableMovements.value.data = [...rawIncomings.value];
  } else {
    tableMovements.value.data = [...rawOutbounds.value];
  }
  showNotification('info', 'Filtros limpiados');
}

function seeMovementDetails(movement) {
  selectedMovement.value = { ...movement };
  movementDetailDialog.value = true;
}
</script>

<style scoped>
@import url(../style/Admin.css);


.modern-dialog {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  background: var(--one-color--);
}

.dialog-header {
  background: var(--five-color--);
  padding: 20px 24px;
  margin: 0;
}

.dialog-content {
  padding: 24px;
  background: var(--one-color--);
}

.info-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--border-color);
  overflow: hidden;
}

.card-title {
  background: var(--two-color--);
  padding: 16px 20px;
  font-weight: 600;
  font-size: 16px;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
}

.card-content {
  padding: 20px;
}

.info-item {
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-weight: 600;
  color: var(--text-secondary);
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 15px;
  color: var(--text-primary);
  font-weight: 500;
}

.info-value.product-name {
  color: var(--fiv-color--);
  font-weight: 600;
}

.info-value.price {
  color: #2e7d32;
  font-weight: 600;
}

.info-value.quantity,
.info-value.stock {
  background: var(--six-color--);
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
  font-weight: 600;
}

.info-value.user-name {
  color: var(--cambio--);
  font-weight: 600;
}

.info-value.description {
  margin: 0;
  line-height: 1.5;
  color: var(--text-secondary);
}

.info-value.address {
  line-height: 1.5;
  color: var(--text-secondary);
}

.movement-badge {
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 6px;
}

.specifications {
  border-top: 1px solid var(--border-color);
  padding-top: 16px;
}

.spec-title {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.spec-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 8px;
}

.spec-item {
  background: var(--background);
  padding: 8px 12px;
  border-radius: 6px;
  display: flex;
  gap: 8px;
}

.spec-key {
  font-weight: 600;
  color: var(--text-secondary);
  min-width: 80px;
}

.spec-value {
  color: var(--text-primary);
}

.images-section {
  border-top: 1px solid var(--border-color);
  padding-top: 16px;
}

.images-title {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.images-grid {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.image-container {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.product-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
}

.no-data {
  color: var(--text-secondary);
  font-style: italic;
  padding: 20px;
  text-align: center;
  background: var(--background);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog-footer {
  background: var(--background);
  padding: 16px 24px;
  justify-content: flex-end;
  border-top: 1px solid var(--border-color);
}

.close-btn {
  padding: 10px 24px;
  border-radius: 6px;
  font-weight: 600;
  background: var(--fiv-color--);
}

.close-btn:hover {
  background: var(--primary-button-hover);
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .modern-dialog {
    margin: 16px;
    min-width: calc(100vw - 32px);
  }

  .dialog-content {
    padding: 16px;
  }

  .card-content {
    padding: 16px;
  }

  .images-grid {
    justify-content: center;
  }

  .spec-list {
    grid-template-columns: 1fr;
  }
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

.metric-card {
  min-width: 200px;
  flex: 1 1 auto;
}

/* Estilos específicos para los badges de tipo */
.q-badge.positive {
  background-color: #4CAF50;
}

.q-badge.negative {
  background-color: #F44336;
}
</style>