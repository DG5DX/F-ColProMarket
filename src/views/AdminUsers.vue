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
                <q-label class="text-h2">{{ dataUsers.activeUsers || 0 }}</q-label>
              </q-card-section>
            </q-card>

            <!-- Usuarios Inactivos -->
            <q-card class="col metric-card bg-orange-1">
              <q-card-section>
                <div class="text-h6">Usuarios Inactivos</div>
                <q-icon name="pause_circle" size="md" class="metric-icon" />
                <q-label class="text-h2">{{ dataUsers.inactiveUsers || 0 }}</q-label>
              </q-card-section>
            </q-card>

            <!-- Administradores -->
            <q-card class="col metric-card bg-purple-1">
              <q-card-section>
                <div class="text-h6">Administradores</div>
                <q-icon name="admin_panel_settings" size="md" class="metric-icon" />
                <q-label class="text-h2">{{ dataUsers.administrators || 0 }}</q-label>
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
              v-model="statusFilter"
              :options="['Activos', 'Inactivos', 'Administradores', 'Clientes']"
              label="Filtrar por estado"
              clearable
              class="col"
              style="min-width: 200px"
            />

            <q-input
              filled
              dense
              v-model="dateFrom"
              label="Fecha desde"
              type="date"
              class="col"
              style="min-width: 150px"
            />

            <q-input
              filled
              dense
              v-model="dateTo"
              label="Fecha hasta"
              type="date"
              class="col"
              style="min-width: 150px"
            />

            <q-select
              filled
              dense
              v-model="sortBy"
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
            :rows="dataUsers.users || []"
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
                <q-badge :color="props.row.state ? 'positive' : 'negative'">
                  {{ props.row.state ? 'Activo' : 'Inactivo' }}
                </q-badge>
              </q-td>
            </template>

            <template v-slot:body-cell-acciones="props">
              <q-td :props="props" class="q-table--cell-center">
                <q-btn icon="visibility" flat dense color="primary" @click="seeDetail(props.row)" />
                <q-btn icon="edit" flat dense color="warning" @click="dialogVisible = true ; editedUser = props.row" class="q-ml-sm" />
                <q-btn v-if="props.row.state === 0" 
                  icon="check_circle" 
                  flat dense 
                  title="Activar usuario"
                  color="positive" 
                  @click="changeUserStatus(props.row._id)" 
                  class="q-ml-sm" 
                />

                <q-btn v-if="props.row.state === 1" 
                  :icon="props.row.state ? 'close' : 'check'"
                  flat dense 
                  title="Desactivar usuario"
                  color="negative" 
                  @click="changeUserStatus(props.row._id)" 
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
              <q-img src="/src/assets/userImage.avif" class="rounded-borders" />
            </q-avatar>
          </div>
          <div>
            <div><strong>Nombre:</strong> {{ selectedUser.name }}</div>
            <div><strong>Email:</strong> {{ selectedUser.email }}</div>
            <div><strong>Teléfono:</strong> {{ selectedUser.phone || 'No registrado' }}</div>
            <div><strong>Rol:</strong> {{ selectedUser.role === 'admin' ? 'Administrador' : 'Cliente' }}</div>
            <div><strong>Estado:</strong> 
              <q-badge :color="selectedUser.state ? 'positive' : 'negative'">
                {{ selectedUser.state ? 'Activo' : 'Inactivo' }}
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


    <!--Dialogo para editar usuario-->
    

    <q-dialog v-model="dialogVisible" >
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Editar Información de Usuario</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="saveChanges">
            <q-input
              v-model="editedUser.name"
              label="Nombre"
              class="q-mb-md"
              filled
              dense
            />
            <q-input
              v-model="editedUser.lastName"
              label="Apellido"
              class="q-mb-md"
              filled
              dense
            />
            <q-input
              v-model="editedUser.email"
              label="Email"
              type="email"
              class="q-mb-md"
              filled
              dense
              disable
              hint="El email no puede ser modificado directamente aquí."
            />
            <q-input
              v-model="editedUser.phone"
              label="Telefono"
              class="q-mb-md"
              filled
              dense
            />
            <q-input
              v-model="editedUser.dateOfBirth"
              label="Fecha de Nacimiento"
              type="date"
              stack-label
              class="q-mb-md"
              filled
              dense
            />
            <q-select
              v-model="editedUser.gender"
              :options="genderOptions"
              label="Género"
              class="q-mb-md"
              filled
              dense
            />

            <q-separator class="q-my-md" />

            <div class="text-subtitle1 q-mb-sm">Dirección de Envío</div>
            <q-input
              v-model="editedUser.shippingAddress.street"
              label="Calle y Número"
              class="q-mb-md"
              filled
              dense
            />
            <q-input
              v-model="editedUser.shippingAddress.city"
              label="Ciudad"
              class="q-mb-md"
              filled
              dense
            />
            <q-input
              v-model="editedUser.shippingAddress.state"
              label="Departamento/Estado"
              class="q-mb-md"
              filled
              dense
            />
            <q-input
              v-model="editedUser.shippingAddress.zipCode"
              label="Código Postal"
              class="q-mb-md"
              filled
              dense
            />
            <q-input
              v-model="editedUser.shippingAddress.country"
              label="País"
              class="q-mb-md"
              filled
              dense
            />

            <q-card-actions align="right" class="q-mt-md">
              <q-btn flat label="Cancelar" color="negative" v-close-popup />
              <q-btn label="Guardar Cambios" @click="editUser()" color="primary" type="submit" />
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>



  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { getData, putData} from "../service/service.js";
import adminDrawer from "../components/adminDrawer.vue";
import { showNotification } from "../utils/utils.js";

const search = ref("");
const roles = [
  { label: 'Administrador', value: 'admin' },
  { label: 'Cliente', value: 'client' }
];

// Filtros
const statusFilter = ref(null);
const dateFrom = ref(null);
const dateTo = ref(null);
const sortBy = ref(null);
const appliedFilters = ref(false);

// Función para aplicar los filtros
const applyFilters = () => {
  appliedFilters.value = true;
  GetDataUsers(); // Vuelve a cargar los usuarios con los filtros aplicados
};

// Función para limpiar los filtros
const clearFilters = () => {
  statusFilter.value = null;
  dateFrom.value = null;
  dateTo.value = null;
  sortBy.value = null;
  appliedFilters.value = false;
  GetDataUsers(); // Vuelve a cargar los usuarios sin filtros
};

// Función para filtrar los usuarios localmente (opcional)
const filteredUsers = computed(() => {
  if (!appliedFilters.value) return dataUsers.value.users || [];
  
  return (dataUsers.value.users || []).filter(user => {
    // Filtro por estado
    if (statusFilter.value === 'Activos' && !user.state) {
      return false;
    }
    if (statusFilter.value === 'Inactivos' && user.state) {
      return false;
    }
    if (statusFilter.value === 'Administradores' && user.role !== 0) {
      return false;
    }
    if (statusFilter.value === 'Clientes' && user.role !== 1) {
      return false;
    }
    
    // Filtro por fecha
    if (dateFrom.value) {
      const userDate = new Date(user.createdAt);
      const fromDate = new Date(dateFrom.value);
      if (userDate < fromDate) {
        return false;
      }
    }
    
    if (dateTo.value) {
      const userDate = new Date(user.createdAt);
      const toDate = new Date(dateTo.value);
      if (userDate > toDate) {
        return false;
      }
    }
    
    return true;
  }).sort((a, b) => {
    // Ordenar los resultados
    if (!sortBy.value) return 0;
    
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    
    switch (sortBy.value) {
      case 'Más recientes':
        return dateB - dateA;
      case 'Más antiguos':
        return dateA - dateB;
      case 'Nombre (A-Z)':
        return a.name.localeCompare(b.name);
      case 'Nombre (Z-A)':
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });
});

// Diálogos
const detailDialog = ref(false);

// Datos
const dataUsers = ref({});
const selectedUser = ref({});

//editar
const editedUser = ref({
  shippingAddress:{}
});
const dialogVisible = ref(false);

async function changeUserStatus(userId){
  try {
    const response = await putData(`/users/state/${userId}`)
    GetDataUsers()
    showNotification('positive','El estado del usuario ha sido actualizado')
  } catch (error) {
    showNotification('negative','Error al editar usuario')
    console.log("[changeUserStatus]", error);
  }
}

async function editUser(){
  try {
    const response = await putData(`/users/${editedUser.value._id}`,{
      data:editedUser.value
    })
    return showNotification('positive','Usuario editado');
  } catch (error) {
    showNotification('negative','Error al editar usuario')
    console.log("[editUser]", error);
  }
}


// Columnas de la tabla
const columns = [
  { name: "name", label: "Nombre", field: "name", align: "left", sortable: true },
  { name: "email", label: "Correo", field: "email", align: "left" },
  { name: "role", label: "Rol", field:(user) => user.role === 0 ? 'Administrador' : 'Cliente' , align: "center"},
  { name: "estado", label: "Estado", field:(user)=> user.state === 1 ? 'Activo' :'Inactivo'  , align: "center" },
  { name: "createdAt", label: "Fecha Registro", field: "createdAt", align: "center", 
    format: (val) => formatDate(val) 
  },
  { name: "acciones", label: "Acciones", align: "center" }
];

onMounted(() => {
  GetDataUsers();
/*   getAllCategories(); */
});

async function GetDataUsers() {
  try {
    let url = "/users";
    const params = [];
    
    if (appliedFilters.value) {
      if (statusFilter.value === 'Activos') {
        params.push(`state=1`);
      } else if (statusFilter.value === 'Inactivos') {
        params.push(`state=0`);
      } else if (statusFilter.value === 'Administradores') {
        params.push(`role=0`);
      } else if (statusFilter.value === 'Clientes') {
        params.push(`role=1`);
      }
      
      if (dateFrom.value) {
        params.push(`dateFrom=${dateFrom.value}`);
      }
      if (dateTo.value) {
        params.push(`dateTo=${dateTo.value}`);
      }
      
      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }
    }
    
    const response = await getData(url);
    dataUsers.value = response;
    
    // Aplicar ordenamiento local si es necesario
    if (appliedFilters.value && sortBy.value) {
      dataUsers.value.users = dataUsers.value.users.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        
        switch (sortBy.value) {
          case 'Más recientes':
            return dateB - dateA;
          case 'Más antiguos':
            return dateA - dateB;
          case 'Nombre (A-Z)':
            return a.name.localeCompare(b.name);
          case 'Nombre (Z-A)':
            return b.name.localeCompare(a.name);
          default:
            return 0;
        }
      });
    }
  } catch (error) {
    showNotification('negative','Error cargando informacion de usuarios');
    console.log("[dataUsers]",error);
  }
}



/* async function getAllCategories() {
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
} */

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