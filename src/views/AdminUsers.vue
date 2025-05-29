<template>
  <q-layout view="hHh lpR fFf" id="body">
    <admin-drawer />
    <q-page-container>
      <q-page class="q-pa-md flex flex-center">
        <q-card class="q-pa-md shadow-2 q-mx-auto" style="width: 100%; background-color: white">
          <div class="text-h5 text-weight-bold" style="display: grid; justify-items: center; padding: 10px">
            👥 Gestión de Usuarios
          </div>
          <!-- Rectángulos de métricas -->
          <div class="row q-mb-md q-gutter-md">
            <!-- Total de Usuarios -->
            <q-card class="col metric-card bg-blue-1">
              <q-card-section>
                <div class="text-h6">Total de Usuarios</div>
                <q-icon name="people" size="md" class="metric-icon" />
                <q-label class="text-h2">{{ dataUsers.count || 0 }}</q-label>
              </q-card-section>
            </q-card>

            <!-- Usuarios Activos -->
            <q-card class="col metric-card bg-green-1">
              <q-card-section>
                <div class="text-h6">Usuarios Activos</div>
                <q-icon name="check_circle" size="md" class="metric-icon" />
                <q-label class="text-h2">{{ dataUsers.active || 0 }}</q-label>
              </q-card-section>
            </q-card>

            <!-- Usuarios Inactivos -->
            <q-card class="col metric-card bg-orange-1">
              <q-card-section>
                <div class="text-h6">Usuarios Inactivos</div>
                <q-icon name="pause_circle" size="md" class="metric-icon" />
                <q-label class="text-h2">{{ dataUsers.inactive || 0 }}</q-label>
              </q-card-section>
            </q-card>

            <!-- Administradores -->
            <q-card class="col metric-card bg-purple-1">
              <q-card-section>
                <div class="text-h6">Administradores</div>
                <q-icon name="admin_panel_settings" size="md" class="metric-icon" />
                <q-label class="text-h2">{{ dataUsers.admins || 0 }}</q-label>
              </q-card-section>
            </q-card>
          </div>
        </q-card>

        <!-- Filtros de Búsqueda -->
        <q-card
          class="q-pa-md shadow-2 q-mx-auto q-mt-md"
          style="width: 100%; background-color: #f5f5f5; margin-bottom: 16px"
        >
          <div class="text-h6 text-weight-bold q-mb-md">
            🔍 Filtros Avanzados
          </div>

          <div
            class="row q-gutter-md items-center"
            style="display: flex; align-items: center"
          >
            <q-select
              filled
              dense
              :options="['Activos', 'Inactivos', 'Administradores', 'Clientes']"
              label="Filtrar por estado"
              clearable
              class="col"
              style="min-width: 200px"
            />

            <q-input
              filled
              dense
              label="Fecha desde"
              type="date"
              class="col"
              style="min-width: 150px"
            />

            <q-input
              filled
              dense
              label="Fecha hasta"
              type="date"
              class="col"
              style="min-width: 150px"
            />

            <q-select
              filled
              dense
              label="Ordenar por"
              class="col"
              style="min-width: 200px"
              :options="['Más recientes', 'Más antiguos', 'Nombre (A-Z)', 'Nombre (Z-A)']"
            />

            <div class="row q-gutter-sm" style="margin-top: 0%">
              <q-btn
                label="Aplicar Filtros"
                color="primary"
                dense
                class="q-ml-sm"
                style="height: 40px"
              />
              <q-btn
                label="Limpiar Filtros"
                color="negative"
                outline
                dense
                style="height: 40px"
              />
            </div>
          </div>
        </q-card>

        <q-card class="q-pa-md shadow-2 q-mx-auto" style="width: 100%; min-height: 600px">
          <div class="row justify-between items-center q-mb-md">
            <div class="text-h5 text-weight-bold">👤 Lista de Usuarios</div>
            <div
              class="row q-mb-md items-center q-gutter-md"
              style="display: flex; align-items: flex-start"
            >
              <q-input
                filled
                dense
                debounce="300"
                v-model="search"
                label="Buscar usuario"
                clearable
                prepend-inner-icon="search"
                class="search"
                @clear="search = ''"
              />
            </div>
          </div>

          <q-table
            :rows="dataUsers.data || []"
            :columns="columns"
            row-key="id"
            flat
            bordered
            wrap-cells
            class="bg-white my-sticky-table"
            :filter="search"
            style="max-height: 400px"
            separator="cell"
          >
            <template v-slot:body-cell-imagen="props">
              <q-td :props="props" class="q-table--cell-center">
                <q-avatar>
                  <q-img :src="props.row.avatar || 'default-avatar.png'" contain style="width: 50px; height: 50px" />
                </q-avatar>
              </q-td>
            </template>

            <template v-slot:body-cell-estado="props">
              <q-td :props="props" class="q-table--cell-center">
                <q-badge :color="props.row.active ? 'positive' : 'negative'">
                  {{ props.row.active ? 'Activo' : 'Inactivo' }}
                </q-badge>
              </q-td>
            </template>

            <template v-slot:body-cell-acciones="props">
              <q-td :props="props" class="q-table--cell-center">
                <q-btn icon="visibility" flat dense color="primary" @click="seeDetail(props.row)" />
                <q-btn icon="edit" flat dense color="warning" @click="editarUsuario(props.row)" class="q-ml-sm" />
                <q-btn 
                  icon="delete" 
                  flat dense 
                  color="negative" 
                  @click="toggleUserStatus(props.row)" 
                  class="q-ml-sm" 
                />
              </q-td>
            </template>
          </q-table>
        </q-card>
      </q-page>
    </q-page-container>

    <!-- Diálogo Detalle Usuario -->
    <q-dialog v-model="detailDialog" persistent>
      <q-card class="q-pa-md" style="min-width: 400px; max-width: 600px">
        <q-card-section class="text-h6 text-primary">Detalle del Usuario</q-card-section>
        <q-separator />
        <q-card-section class="q-gutter-md">
          <div class="flex flex-center">
            <q-avatar size="120px">
              <q-img :src="selectedUser.avatar || 'default-avatar.png'" class="rounded-borders" />
            </q-avatar>
          </div>
          <div>
            <div><strong>Nombre:</strong> {{ selectedUser.name }}</div>
            <div><strong>Email:</strong> {{ selectedUser.email }}</div>
            <div><strong>Teléfono:</strong> {{ selectedUser.phone || 'No registrado' }}</div>
            <div><strong>Rol:</strong> {{ selectedUser.role === 'admin' ? 'Administrador' : 'Cliente' }}</div>
            <div><strong>Estado:</strong> 
              <q-badge :color="selectedUser.active ? 'positive' : 'negative'">
                {{ selectedUser.active ? 'Activo' : 'Inactivo' }}
              </q-badge>
            </div>
            <div><strong>Registrado el:</strong> {{ formatDate(selectedUser.createdAt) }}</div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cerrar" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Notify } from "quasar";
import { getData, putData} from "../service/service.js";
import adminDrawer from "../components/adminDrawer.vue";

const search = ref("");
const roles = [
  { label: 'Administrador', value: 'admin' },
  { label: 'Cliente', value: 'client' }
];

// Diálogos
const detailDialog = ref(false);

// Datos
const dataUsers = ref([]);
const selectedUser = ref({});

// Columnas de la tabla
const columns = [
  { name: "name", label: "Nombre", field: "name", align: "left", sortable: true },
  { name: "email", label: "Correo", field: "email", align: "left" },
  { name: "role", label: "Rol", field: "role", align: "center", 
    format: (val) => val === 'admin' ? 'Administrador' : 'Cliente' 
  },
  { name: "estado", label: "Estado", field: "active", align: "center" },
  { name: "createdAt", label: "Fecha Registro", field: "createdAt", align: "center", 
    format: (val) => formatDate(val) 
  },
  { name: "acciones", label: "Acciones", align: "center" }
];

onMounted(() => {
  getAllUsers();
});

//Get usuarios
async function getAllUsers() {
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

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
}

// Ver detalles del usuario
function seeDetail(user) {
  selectedUser.value = { ...user };
  detailDialog.value = true;
}

</script>

<style scoped>
@import url(../style/Admin.css);

.metric-card {
  min-width: 200px;
  border-radius: 10px;
  transition: transform 0.3s;
}

.metric-card:hover {
  transform: translateY(-5px);
}

.metric-icon {
  position: absolute;
  right: 15px;
  top: 15px;
  opacity: 0.3;
}
</style>