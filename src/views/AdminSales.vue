<template>
  <q-layout view="hHh lpR fFf" id="body">
    <admin-drawer />
    <q-page-container>
      <q-page class="q-pa-md flex flex-center">
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
              <q-card-section>
                <div class="text-h6">Ingresos Totales</div>
                <div class="text-h4 text-weight-bold"></div>
                <q-icon name="attach_money" size="md" class="metric-icon" />
                <q-label class="text-h2">${{ formatNum(salesData.totalIncome) || 0 }}</q-label>
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

            <!-- Clientes Nuevos -->
    <!--         <q-card class="col metric-card bg-purple-1">
              <q-card-section>
                <div class="text-h6">Clientes Nuevos</div>
                <div class="text-h4 text-weight-bold"></div>
                <q-icon name="person_add" size="md" class="metric-icon" />
                <q-label class="text-h2">{{ salesData.newCustomers || 0 }}</q-label>
              </q-card-section>
            </q-card> -->
          </div>
        </q-card>

        <!-- Filtros de Búsqueda -->
        <q-card
          class="q-pa-md shadow-2 q-mx-auto q-mt-md"
          style="width: 100%; background-color: #f5f5f5; margin-bottom: 16px"
        >
          <div class="text-h6 text-weight-bold q-mb-md">
            🔍 Filtros Avanzados de Ventas
          </div>

          <div
            class="row q-gutter-md items-center"
            style="display: flex; align-items: center"
          >
            <q-input
              filled
              dense
              label="Fecha inicial"
              type="date"
              class="col"
              style="min-width: 180px"
              v-model="filters.startDate"
            />

            <q-input
              filled
              dense
              label="Fecha final"
              type="date"
              class="col"
              style="min-width: 180px"
              v-model="filters.endDate"
            />

            <q-select
              filled
              dense
              label="Estado de venta"
              class="col"
              style="min-width: 200px"
              :options="['Completada', 'Pendiente', 'Cancelada']"
              v-model="filters.status"
            />

            <q-select
              filled
              dense
              :options="customers"
              option-label="name"
              label="Filtrar por cliente"
              clearable
              class="col"
              style="min-width: 200px"
              v-model="filters.customer"
            />

            <div class="row q-gutter-sm" style="margin-top: 0%">
              <q-btn
                label="Aplicar Filtros"
                color="primary"
                dense
                class="q-ml-sm"
                style="height: 40px"
                @click="applyFilters"
              />
              <q-btn
                label="Limpiar Filtros"
                color="negative"
                outline
                dense
                style="height: 40px"
                @click="clearFilters"
              />
            </div>
          </div>
        </q-card>

        <q-card class="q-pa-md shadow-2 q-mx-auto" style="width: 100%; min-height: 600px">
          <div class="row justify-between items-center q-mb-md">
            <div class="text-h5 text-weight-bold">📊 Historial de Ventas</div>
            <div
              class="row q-mb-md items-center q-gutter-md"
              style="display: flex; align-items: flex-start"
            >
              <q-input
                filled
                dense
                debounce="300"
                v-model="search"
                label="Buscar venta"
                clearable
                prepend-inner-icon="search"
                class="search"
                @clear="search = ''"
              />
              <q-btn
                label="Exportar"
                color="secondary"
                icon="file_download"
                @click="exportSales"
                class="col-auto"
              />
            </div>
          </div>

          <!-- Barra de estadísticas -->
          <div
            class="row q-mb-md items-center q-gutter-md"
            style="display: flex; align-items: flex-start"
          >
            <q-select
              filled
              dense
              v-model="selectedPeriod"
              :options="periodOptions"
              label="Periodo de tiempo"
              class="col"
              @update:model-value="changePeriod"
            />
            <q-btn
              label="Generar Reporte"
              color="primary"
              icon="assessment"
              @click="generateReport"
              class="col-auto"
            />
          </div>

          <q-table
            :rows="salesData.data || []"
            :columns="salesColumns"
            row-key="id"
            flat
            bordered
            wrap-cells
            class="bg-white my-sticky-table"
            :filter="search"
            style="max-height: 400px"
            separator="cell"
          >
            <template v-slot:body-cell-detalles="props">
              <q-td :props="props" class="q-table--cell-center">
                <q-btn icon="receipt" flat dense color="info" @click="seeSaleDetails(props.row)" />
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
                <q-btn icon="print" flat dense color="grey" @click="printInvoice(props.row)" />
              </q-td>
            </template>
          </q-table>
        </q-card>
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
            <!-- <div><strong>Subtotal:</strong> ${{ selectedSale.subtotal }}</div> -->
            <!-- <div><strong>Descuentos:</strong> ${{ selectedSale.descuentos || 0 }}</div> -->
            <div><strong>IVA:</strong> {{ selectedSale?.iva || 'No aplica' }}</div>
            <div class="text-h6"><strong>Total:</strong> ${{ formatNum(selectedSale.total) }}</div>
          </div>
        </q-card-section>
        
        <q-card-actions align="right">
          <q-btn label="Imprimir Factura" color="secondary" icon="print" @click="printInvoice(selectedSale)" />
          <q-btn label="Cerrar" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Diálogo Editar Venta -->
    <q-dialog v-model="editSaleDialog" persistent>
      <q-card style="min-width: 500px">
        <q-card-section class="text-h6 text-warning">Editar Venta #{{ saleToEdit._id }}</q-card-section>
        <q-separator />
        
        <q-card-section class="q-gutter-md">
          <q-select
            filled
            v-model="saleToEdit.state"
            :options="['Completada', 'Pendiente', 'Cancelada']"
            label="Estado"
          />
          
<!--           <q-select
            filled
            v-model="saleToEdit.metodoPago"
            :options="['Efectivo', 'Tarjeta', 'Transferencia', 'Otro']"
            label="Método de Pago"
          /> -->
          
  <!--         <q-input
            filled
            v-model="saleToEdit.notas"
            label="Notas adicionales"
            type="textarea"
          /> -->
        </q-card-section>
        
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="secondary" v-close-popup />
          <q-btn flat label="Guardar Cambios" color="primary" @click="saveSaleChanges" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Notify } from "quasar";
import { getData, postData } from "../service/service.js";
import adminDrawer from "../components/adminDrawer.vue";
import { formatISODateToSpanish, formatNum, showNotification } from "../utils/utils.js";

const search = ref("");
const salesData = ref({
});

const filters = ref({
  startDate: "",
  endDate: "",
  status: "",
  customer: null
});


const selectedPeriod = ref("Este mes");
const periodOptions = ["Hoy", "Esta semana", "Este mes", "Este año", "Personalizado"];

// Columnas de la tabla de ventas
const salesColumns = [
  { name: "fecha", label: "Fecha", field:(sale)=>formatISODateToSpanish(sale.createdAt), align: "center" },
  { name: "cliente", label: "Cliente", field: (sale)=> sale.userId?.name || 'User', align: "center" },
  { name: "productos", label: "Productos", field: row => row.products.length, align: "center" },
  { name: "total", label: "Total", field: (sale)=> formatNum(sale.total), align: "center", format: val => `$${val}` },
  { name: "metodoPago", label: "Método Pago", field: (sale)=> 'Paypal', align: "center" },
  { name: "detalles", label: "Detalles", align: "center" },
  { name: "acciones", label: "Acciones", align: "center" }
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
const editSaleDialog = ref(false);
const selectedSale = ref({});
const saleToEdit = ref({});

onMounted(() => {
  loadSalesData();
});

//salesData
async function loadSalesData() {
  try {
    const response = await getData("/orders");
    salesData.value = response;
    return showNotification('positive','Datos de ventas cargados')
  } catch (error) {
    console.log("[loadSalesData]", error);
    return showNotification('negative','Error cargando datos de ventas')
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

function editSale(sale) {
  saleToEdit.value = { ...sale };
  editSaleDialog.value = true;
}

function saveSaleChanges() {
  const index = salesData.value.data.findIndex(s => s.id === saleToEdit.value.id);
  if (index !== -1) {
    salesData.value.data[index] = { ...saleToEdit.value };
    Notify.create({
      type: "positive",
      message: "Venta actualizada correctamente"
    });
    editSaleDialog.value = false;
  }
}

function cancelSale(sale) {
  const index = salesData.value.data.findIndex(s => s.id === sale.id);
  if (index !== -1) {
    salesData.value.data[index].estado = "Cancelada";
    Notify.create({
      type: "warning",
      message: "Venta cancelada"
    });
  }
}

function printInvoice(sale) {
  Notify.create({
    type: "info",
    message: `Imprimiendo factura ${sale.id}...`
  });
}

function applyFilters() {
  Notify.create({
    type: "info",
    message: "Filtros aplicados"
  });
  // Aquí iría la lógica para filtrar los datos
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

function changePeriod() {
  Notify.create({
    type: "info",
    message: `Periodo cambiado a ${selectedPeriod.value}`
  });
  // Aquí iría la lógica para cambiar el periodo
}

function generateReport() {
  Notify.create({
    type: "positive",
    message: "Reporte generado con éxito"
  });
}

function exportSales() {
  Notify.create({
    type: "positive",
    message: "Datos exportados correctamente"
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
</style>