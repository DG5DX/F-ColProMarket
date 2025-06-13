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
              <q-card v-for="n in 3" :key="n" class="col metric-card">
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
              📦 Movimientos de Inventario
            </div>
            <!-- Rectángulos de métricas -->
            <div class="row q-mb-md q-gutter-md">
              <!-- Entradas Totales -->
              <q-card class="col metric-card bg-blue-1">
                <q-card-section>
                  <div class="text-h6">Entradas Totales</div>
                  <q-icon name="input" size="md" class="metric-icon" />
                  <q-label class="text-h2">{{ inventoryData.totalEntries || 0 }}</q-label>
                </q-card-section>
              </q-card>

              <!-- Salidas Totales -->
              <q-card class="col metric-card bg-green-1">
                <q-card-section>
                  <div class="text-h6">Salidas Totales</div>
                  <q-icon name="output" size="md" class="metric-icon" />
                  <q-label class="text-h2">{{ inventoryData.totalOutputs || 0 }}</q-label>
                </q-card-section>
              </q-card>

              <!-- Movimientos Hoy -->
              <q-card class="col metric-card bg-orange-1">
                <q-card-section>
                  <div class="text-h6">Movimientos Hoy</div>
                  <q-icon name="update" size="md" class="metric-icon" />
                  <q-label class="text-h2">{{ inventoryData.todayMovements || 0 }}</q-label>
                </q-card-section>
              </q-card>
            </div>
          </q-card>
        </template>

        <!-- Filtros de Búsqueda -->
        <q-card class="q-pa-md shadow-2 q-mx-auto q-mt-md" style="width: 100%; background-color: #f5f5f5; margin-bottom: 16px">
          <div class="text-h6 text-weight-bold q-mb-md">
            🔍 Filtros Avanzados de Inventario
          </div>

          <div class="row q-gutter-md items-center" style="display: flex; align-items: center">
            <q-select
              filled
              dense
              v-model="filters.product"
              :options="products"
              option-label="name"
              label="Filtrar por producto"
              clearable
              class="col"
              style="min-width: 200px"
              :loading="loading"
            />

            <q-select
              filled
              dense
              v-model="filters.type"
              :options="movementTypes"
              label="Tipo de movimiento"
              clearable
              class="col"
              style="min-width: 150px"
            />

            <q-input
              filled
              dense
              v-model="filters.startDate"
              label="Fecha inicial"
              type="date"
              clearable
              class="col"
              style="min-width: 150px"
            />

            <q-input
              filled
              dense
              v-model="filters.endDate"
              label="Fecha final"
              type="date"
              clearable
              class="col"
              style="min-width: 150px"
            />

            <div class="row q-gutter-sm" style="margin-top: 0%">
              <q-btn
                label="Aplicar Filtros"
                color="primary"
                dense
                style="height: 40px"
                @click="applyFilters"
                :loading="loading"
              />
              <q-btn
                label="Limpiar Filtros"
                color="negative"
                outline
                dense
                style="height: 40px"
                @click="clearFilters"
                :disable="loading"
              />
            </div>
          </div>
        </q-card>

        <!-- Skeleton para la tabla de movimientos -->
        <template v-if="loading">
          <q-card class="q-pa-md shadow-2 q-mx-auto" style="width: 100%; min-height: 600px">
            <div class="row justify-between items-center q-mb-md">
              <div class="text-h5 text-weight-bold"><q-skeleton type="text" width="200px" /></div>
              <div class="row q-mb-md items-center q-gutter-md">
                <q-skeleton type="text" width="300px" height="40px" />
              </div>
            </div>
            
            <q-table
              flat
              bordered
              :rows="[]"
              :columns="movementColumns"
              row-key="id"
              hide-pagination
            >
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
              <div class="text-h5 text-weight-bold">📋 Historial de Movimientos</div>
              <div class="row q-mb-md items-center q-gutter-md">
                <q-input
                  v-model="search"
                  outlined
                  dense
                  placeholder="Buscar..."
                  clearable
                  class="col"
                >
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
            </div>

            <q-table
              :rows="filteredMovements"
              :columns="movementColumns"
              row-key="id"
              flat
              bordered
              wrap-cells
              class="bg-white my-sticky-table"
              :filter="search"
              style="max-height: 400px"
              separator="cell"
              :loading="loading"
              :pagination="pagination"
            >
              <template v-slot:body-cell-tipo="props">
                <q-td :props="props" class="q-table--cell-center">
                  <q-badge :color="props.row.type === 'Entrada' ? 'positive' : 'negative'">
                    {{ props.row.type }}
                  </q-badge>
                </q-td>
              </template>

              <template v-slot:body-cell-detalles="props">
                <q-td :props="props" class="q-table--cell-center">
                  <q-btn 
                    icon="visibility" 
                    flat 
                    dense 
                    color="info" 
                    @click="seeMovementDetails(props.row)" 
                    :disable="loading" 
                  />
                </q-td>
              </template>
            </q-table>
          </q-card>
        </template>
      </q-page>
    </q-page-container>

    <!-- Diálogo Detalles de Movimiento -->
    <q-dialog v-model="movementDetailDialog" persistent>
      <q-card class="q-pa-md" style="min-width: 500px; max-width: 700px">
        <q-card-section class="text-h6 text-primary">
          Detalle de Movimiento #{{ selectedMovement._id }}
        </q-card-section>
        <q-separator />
        
        <q-card-section>
          <div class="row q-mb-sm">
            <div class="col-6"><strong>Fecha:</strong> {{ formatISODateToSpanish(selectedMovement.date) }}</div>
            <div class="col-6">
              <strong>Tipo:</strong> 
              <q-badge :color="selectedMovement.type === 'Entrada' ? 'positive' : 'negative'">
                {{ selectedMovement.type }}
              </q-badge>
            </div>
          </div>
          
          <div class="row q-mb-sm">
            <div class="col-6"><strong>Producto:</strong> {{ selectedMovement.product?.name }}</div>
            <div class="col-6"><strong>Cantidad:</strong> {{ selectedMovement.quantity }}</div>
          </div>
          
          <div class="row q-mb-sm">
            <div class="col-6"><strong>Responsable:</strong> {{ selectedMovement.user?.name || 'Sistema' }}</div>
            <div class="col-6"><strong>Referencia:</strong> {{ selectedMovement.reference || 'N/A' }}</div>
          </div>
          
          <div class="q-mt-md">
            <strong>Detalles adicionales:</strong>
            <q-input
              v-model="selectedMovement.notes"
              type="textarea"
              readonly
              outlined
              dense
              class="q-mt-sm"
            />
          </div>
        </q-card-section>
        
        <q-card-actions align="right">
          <q-btn label="Cerrar" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { Notify } from "quasar";
import { getData, postData } from "../service/service.js";
import adminDrawer from "../components/adminDrawer.vue";
import { formatISODateToSpanish, formatNum, showNotification } from "../utils/utils.js";

const search = ref("");
const inventoryData = ref({});
const loading = ref(false);
const products = ref([]);
const movementTypes = ['Entrada', 'Salida'];

// Filtros
const filters = ref({
  product: null,
  type: null,
  startDate: "",
  endDate: ""
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
    field: row => row.product?.name || 'N/A', 
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
    field: row => row.user?.name || 'Sistema', 
    align: "center" 
  },
  { 
    name: "referencia", 
    label: "Referencia", 
    field: "reference", 
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

const filteredMovements = computed(() => {
  if (!inventoryData.value.movements) return [];
  
  let filtered = [...inventoryData.value.movements];
  
  // Filtrar por producto
  if (filters.value.product) {
    filtered = filtered.filter(movement => 
      movement.product?._id === filters.value.product._id
    );
  }
  
  // Filtrar por tipo de movimiento
  if (filters.value.type) {
    filtered = filtered.filter(movement => 
      movement.type === filters.value.type
    );
  }
  
  // Filtrar por rango de fechas
  if (filters.value.startDate) {
    const startDate = new Date(filters.value.startDate);
    filtered = filtered.filter(movement => 
      new Date(movement.date) >= startDate
    );
  }
  
  if (filters.value.endDate) {
    const endDate = new Date(filters.value.endDate);
    // Ajustamos la fecha final para incluir todo el día
    endDate.setHours(23, 59, 59, 999);
    filtered = filtered.filter(movement => 
      new Date(movement.date) <= endDate
    );
  }
  
  return filtered;
});

onMounted(() => {
  loadInventoryData();
  loadProducts();
});

async function loadProducts() {
  try {
    const response = await getData("/products");
    products.value = response;
  } catch (error) {
    console.error("Error loading products:", error);
    showNotification('negative', 'Error cargando productos');
  }
}

async function loadInventoryData() {
  try {
    loading.value = true;
    const response = await getData("/inventory/movements");
    inventoryData.value = response;
    showNotification('positive', 'Datos de inventario cargados');
  } catch (error) {
    console.error("[loadInventoryData]", error);
    showNotification('negative', 'Error cargando datos de inventario');
  } finally {
    loading.value = false;
  }
}

function seeMovementDetails(movement) {
  selectedMovement.value = { ...movement };
  movementDetailDialog.value = true;
}

function applyFilters() {
  loading.value = true;
  // Simulamos un pequeño delay para mostrar el loading
  setTimeout(() => {
    loading.value = false;
    Notify.create({
      type: "info",
      message: "Filtros aplicados"
    });
  }, 500);
}

function clearFilters() {
  filters.value = {
    product: null,
    type: null,
    startDate: "",
    endDate: ""
  };
  Notify.create({
    type: "info",
    message: "Filtros limpiados"
  });
}
</script>

<style scoped>
@import url(../style/Admin.css);

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