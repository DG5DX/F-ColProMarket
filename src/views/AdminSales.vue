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
              💰 Detalles de Ventas
            </div>
            <!-- Rectángulos de métricas -->
            <div class="row q-mb-md q-gutter-md">
              <!-- Ventas Totales -->
              <q-card class="col metric-card bg-blue-1">
                <q-card-section>
                  <div class="text-h6">Ventas Totales</div>
                  <div class="text-h4 text-weight-bold"></div>
                  <q-icon name="paid" size="md" class="metric-icon" />
                  <q-label class="text-h2">{{ salesData.count || 0 }}</q-label>
                </q-card-section>
              </q-card>

              <!-- Ingresos Totales -->
              <q-card class="col metric-card bg-green-1">
                <q-card-section style="position: relative; padding: 25px 30px;">
                  <div class="text-h6 q-mb-sm">Ingresos Totales</div>
                  <q-icon name="attach_money" size="md" class="metric-icon" />
                  <div class="total-income-value">
                    ${{ formatNum(salesData.totalIncome) || 0 }}
                  </div>
                </q-card-section>
              </q-card>

              <!-- Ventas Hoy -->
              <q-card class="col metric-card bg-orange-1">
                <q-card-section>
                  <div class="text-h6">Ventas Hoy</div>
                  <div class="text-h4 text-weight-bold"></div>
                  <q-icon name="today" size="md" class="metric-icon" />
                  <q-label class="text-h2">{{ salesData.salesToday || 0 }}</q-label>
                </q-card-section>
              </q-card>
            </div>
          </q-card>
        </template>

        <!-- Filtros de Búsqueda -->
        <q-card class="q-pa-md shadow-2 q-mx-auto q-mt-md" style="width: 100%; background-color: #f5f5f5; margin-bottom: 16px">
          <div class="text-h6 text-weight-bold q-mb-md">
            🔍 Filtros Avanzados de Ventas
          </div>

          <div class="row q-gutter-md items-center" style="display: flex; align-items: center">
            <q-select
              filled
              dense
              v-model="filters.customer"
              :options="customers"
              option-label="name"
              label="Filtrar por cliente"
              clearable
              class="col"
              style="min-width: 200px"
              :loading="loading"
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

        <!-- Skeleton para la tabla de ventas -->
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
              :columns="salesColumns"
              row-key="id"
              hide-pagination
            >
              <template v-slot:body="props">
                <q-tr v-for="n in 5" :key="n">
                  <q-td v-for="col in salesColumns" :key="col.name">
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
              <div class="text-h5 text-weight-bold">📊 Historial de Ventas</div>
              <div
                class="row q-mb-md items-center q-gutter-md"
                style="display: flex; align-items: flex-start"
              >
              </div>
            </div>

            <!-- Barra de estadísticas -->
            <div
              class="row q-mb-md items-center q-gutter-md"
              style="display: flex; align-items: flex-start"
            >
            </div>

            <q-table
              :rows="filteredSales"
              :columns="salesColumns"
              row-key="id"
              flat
              bordered
              wrap-cells
              class="bg-white my-sticky-table"
              :filter="search"
              style="max-height: 400px"
              separator="cell"
              :loading="loading"
            >
              <template v-slot:body-cell-detalles="props">
                <q-td :props="props" class="q-table--cell-center">
                  <q-btn icon="receipt" flat dense color="info" @click="seeSaleDetails(props.row)" :disable="loading" />
                </q-td>
              </template>

              <template v-slot:body-cell-estado="props">
                <q-td :props="props" class="q-table--cell-center">
                  <q-badge :color="getStatusColor(props.row.state)">
                    {{ props.row.state }}
                  </q-badge>
                </q-td>
              </template>

              <template v-slot:body-cell-acciones="props">
                <q-td :props="props" class="q-table--cell-center">
                  <q-btn icon="print" flat dense color="grey" @click="printInvoice(props.row)" :disable="loading" />
                </q-td>
              </template>
            </q-table>
          </q-card>
        </template>
      </q-page>
    </q-page-container>

    <!-- Diálogo Detalles de Venta -->
    <q-dialog v-model="saleDetailDialog" persistent>
      <q-card class="q-pa-md" style="min-width: 500px; max-width: 700px">
        <q-card-section class="text-h6 text-primary">Detalle de Venta #{{ selectedSale._id }}</q-card-section>
        <q-separator />
        
        <q-card-section>
          <div class="row q-mb-sm">
            <div class="col-6"><strong>Fecha:</strong> {{ formatISODateToSpanish(selectedSale.createdAt) }}</div>
          </div>
          
          <div class="row q-mb-sm">
            <div class="col-6"><strong>Cliente:</strong> {{ selectedSale?.userId?.name }}</div>
            <div class="col-6"><strong>Método de Pago:</strong>Paypal</div>
          </div>
          
          <div class="q-mt-md">
            <strong>Productos:</strong>
            <q-table
              :rows="selectedSale.products"
              :columns="productColumns"
              row-key="id"
              flat
              bordered
              dense
              hide-pagination
              class="q-mt-sm"
            />
          </div>
          
          <div class="text-right q-mt-md">
            <div><strong>IVA:</strong> {{ selectedSale?.iva || 'No aplica' }}</div>
            <div class="text-h6"><strong>Total:</strong> ${{ formatNum(selectedSale.total) }}</div>
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
const salesData = ref({});
const loading = ref(false);
const customers = ref([]);

// Filtros
const filters = ref({
  customer: null,
  startDate: "",
  endDate: ""
});


// Columnas de la tabla de ventas
const salesColumns = [
  { name: "fecha", label: "Fecha", field:(sale)=>formatISODateToSpanish(sale.createdAt), align: "center" },
  { name: "cliente", label: "Cliente", field: (sale)=> sale.userId?.name || 'User', align: "center" },
  { name: "productos", label: "Productos", field: row => row.products.length, align: "center" },
  { name: "total", label: "Total", field: (sale)=> formatNum(sale.total), align: "center", format: val => `$${val}` },
  { name: "metodoPago", label: "Método Pago", field: (sale)=> 'Paypal', align: "center" },
  { name: "detalles", label: "Detalles", align: "center" },
];

// Columnas para los productos en el detalle
const productColumns = [
  { name: "nombre", label: "Producto", field: "name", align: "left" },
  { name: "cantidad", label: "Cantidad", field: "quantity", align: "center" },
  { name: "precio", label: "Precio Unit.", field: (product)=> formatNum(product.price), align: "right", format: val => `$${val}` },
  { name: "subtotal", label: "Subtotal", field: row => formatNum(row.quantity * row.price), align: "right", format: val => `$${val}` }
];

// Diálogos
const saleDetailDialog = ref(false);
const selectedSale = ref({});
const saleToEdit = ref({});

const filteredSales = computed(() => {
  if (!salesData.value.data) return [];
  
  let filtered = [...salesData.value.data];
  
  // Filtrar por cliente
  if (filters.value.customer) {
    filtered = filtered.filter(sale => 
      sale.userId?._id === filters.value.customer._id
    );
  }
  
  // Filtrar por rango de fechas
  if (filters.value.startDate) {
    const startDate = new Date(filters.value.startDate);
    filtered = filtered.filter(sale => 
      new Date(sale.createdAt) >= startDate
    );
  }
  
  if (filters.value.endDate) {
    const endDate = new Date(filters.value.endDate);
    // Ajustamos la fecha final para incluir todo el día
    endDate.setHours(23, 59, 59, 999);
    filtered = filtered.filter(sale => 
      new Date(sale.createdAt) <= endDate
    );
  }
  
  return filtered;
});

onMounted(() => {
  loadSalesData();
  loadCustomers();
});

async function loadCustomers() {
  try {
    const response = await getData("/users");
    customers.value = response.filter(user => user.role === 'customer');
  } catch (error) {
    console.error("Error loading customers:", error);
  }
}

//salesData
async function loadSalesData() {
  try {
    loading.value = true;
    const response = await getData("/orders");
    salesData.value = response;
    showNotification('positive','Datos de ventas cargados');
  } catch (error) {
    console.log("[loadSalesData]", error);
    showNotification('negative','Error cargando datos de ventas');
  } finally {
    loading.value = false;
  }
}

function getStatusColor(status) {
  switch(status) {
    case 'Completada': return 'positive';
    case 'Pendiente': return 'warning';
    case 'Cancelada': return 'negative';
    default: return 'grey';
  }
}

function seeSaleDetails(sale) {
  selectedSale.value = { ...sale };
  saleDetailDialog.value = true;
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
    startDate: "",
    endDate: "",
    status: "",
    customer: null
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

/* Agrega esto en tu sección de estilos */
.total-income-value {
  font-size: 2rem;
  font-weight: bold;
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

@media (max-width: 600px) {
  .total-income-value {
    font-size: 1.5rem;
  }
}

.metric-card {
  min-width: 200px; /* Ancho mínimo para mantener legibilidad */
  flex: 1 1 auto; /* Permite que las tarjetas crezcan según necesidad */
}
</style>