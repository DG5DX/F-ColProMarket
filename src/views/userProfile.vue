<template>
  <!-- Envuelve todo en QLayout -->
  <q-layout view="hHh Lpr lff">
    <!-- Barra de herramientas opcional -->
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat round dense icon="arrow_back" @click="$router.go(-1)" />
        <q-toolbar-title>Perfil de Usuario</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <!-- Drawer lateral -->
    <q-drawer
      v-model="leftDrawerOpen"
      :width="300"
      :breakpoint="700"
      bordered
      class="bg-grey-3"
      :mini="miniState"
      @mouseover="miniState = false"
      @mouseout="miniState = true"
    >
      <q-scroll-area class="fit">
        <q-list padding>
          <q-item 
            clickable 
            v-ripple
            :active="activeTab === 'profile'"
            @click="activeTab = 'profile'"
          >
            <q-item-section avatar>
              <q-icon name="person" />
            </q-item-section>
            <q-item-section>
              Perfil
            </q-item-section>
          </q-item>

          <q-item 
            clickable 
            v-ripple
            :active="activeTab === 'movements'"
            @click="activeTab = 'movements'"
          >
            <q-item-section avatar>
              <q-icon name="receipt" />
            </q-item-section>
            <q-item-section>
              Movimientos
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <!-- Contenido de la página -->
    <q-page-container>
      <q-page class="profile-page">
        <!-- Header con imagen de fondo -->
        <div class="profile-header bg-primary text-white">
          <q-parallax :height="200" :speed="0.5">
            <template v-slot:media>
              <img src="https://www.channelengine.com/hubfs/Blogs/2023-07/Marketplace%20strategy.jpg">
            </template>

            <div class="header-content absolute-full flex flex-center">
              <div class="header-overlay flex items-center q-px-lg" style="max-width: 1200px; width: 100%;">
                <!-- Avatar -->
                <q-avatar size="120px" class="q-mr-md">
                  <img :src="user.profilePicture !== 'N/A' ? user.profilePicture : 'https://ostermancron.com/wp-content/uploads/2016/02/blank-profile-picture-973460_640.png'">
                </q-avatar>

                <!-- Información básica -->
                <div class="text-white">
                  <h1 class="text-h4 q-mb-xs">{{ fullName }}</h1>
                  <div class="text-subtitle1 q-mb-sm">{{ user.email }}</div>
                  <div class="flex items-center q-gutter-sm">
                    <q-badge :color="user.state === 1 ? 'positive' : 'negative'">
                      {{ user.state === 1 ? 'Activo' : 'Inactivo' }}
                    </q-badge>
                    <q-badge :color="roleBadgeColor" class="text-white">
                      {{ roleName }}
                    </q-badge>
                  </div>
                </div>
              </div>
            </div>
          </q-parallax>
        </div>

        <!-- Contenido principal basado en pestaña activa -->
        <template v-if="activeTab === 'profile'">
          <div class="profile-content q-pa-lg">
            <div class="row q-col-gutter-lg">
              <!-- Columna izquierda - Información personal -->
              <div class="col-12 col-md-6">
                <q-card class="my-card">
                  <q-card-section class="bg-primary text-white flex justify-between items-center">
                    <div class="text-h6">Información Personal</div>
                    <q-btn 
                      icon="edit" 
                      flat 
                      round 
                      dense 
                      color="white" 
                      @click="openPersonalEditDialog"
                      title="Editar información personal"
                    />
                  </q-card-section>

                  <q-separator/>

                  <q-card-section>
                    <q-list bordered separator>
                      <q-item>
                        <q-item-section>
                          <q-item-label caption>Nombre completo</q-item-label>
                          <q-item-label>{{ fullName }}</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item>
                        <q-item-section>
                          <q-item-label caption>Correo electrónico</q-item-label>
                          <q-item-label>{{ user.email }}</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item>
                        <q-item-section>
                          <q-item-label caption>Teléfono</q-item-label>
                          <q-item-label>{{ user.phone !== 'N/A' ? user.phone : 'No especificado' }}</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item>
                        <q-item-section>
                          <q-item-label caption>Fecha de nacimiento</q-item-label>
                          <q-item-label>{{ user.dateOfBirth ? formatDate(user.dateOfBirth) : 'No especificada' }}</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item>
                        <q-item-section>
                          <q-item-label caption>Género</q-item-label>
                          <q-item-label>{{ user.gender !== 'No especificado' ? user.gender : 'No especificado' }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-card-section>
                </q-card>
              </div>

              <!-- Columna derecha - Dirección y detalles de cuenta -->
              <div class="col-12 col-md-6">
                <!-- Tarjeta de dirección -->
                <q-card class="my-card q-mb-md">
                  <q-card-section class="bg-primary text-white flex justify-between items-center">
                    <div class="text-h6">Dirección de Envío</div>
                    <q-btn 
                      icon="edit" 
                      flat 
                      round 
                      dense 
                      color="white" 
                      @click="openAddressEditDialog"
                      title="Editar dirección"
                    />
                  </q-card-section>

                  <q-separator/>

                  <q-card-section>
                    <q-list bordered separator>
                      <q-item>
                        <q-item-section>
                          <q-item-label caption>Calle</q-item-label>
                          <q-item-label>{{ user.shippingAddress.street }}</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item>
                        <q-item-section>
                          <q-item-label caption>Ciudad</q-item-label>
                          <q-item-label>{{ user.shippingAddress.city }}</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item>
                        <q-item-section>
                          <q-item-label caption>Estado/Provincia</q-item-label>
                          <q-item-label>{{ user.shippingAddress.state }}</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item>
                        <q-item-section>
                          <q-item-label caption>Código Postal</q-item-label>
                          <q-item-label>{{ user.shippingAddress.zipCode !== 'N/A' ? user.shippingAddress.zipCode : 'No especificado' }}</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item>
                        <q-item-section>
                          <q-item-label caption>País</q-item-label>
                          <q-item-label>{{ user.shippingAddress.country }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-card-section>
                </q-card>

                <!-- Tarjeta de detalles de cuenta -->
                <q-card class="my-card">
                  <q-card-section class="bg-primary text-white">
                    <div class="text-h6">Detalles de la Cuenta</div>
                  </q-card-section>

                  <q-separator/>

                  <q-card-section>
                    <q-list bordered separator>
                      <q-item>
                        <q-item-section>
                          <q-item-label caption>ID de Usuario</q-item-label>
                          <q-item-label>{{ user._id }}</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item>
                        <q-item-section>
                          <q-item-label caption>Fecha de Creación</q-item-label>
                          <q-item-label>{{ formatDate(user.createdAt) }}</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item>
                        <q-item-section>
                          <q-item-label caption>Última Actualización</q-item-label>
                          <q-item-label>{{ formatDate(user.updatedAt) }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </div>
        </template>

        <!-- Contenido para movimientos -->
        <template v-else-if="activeTab === 'movements'">
          <div class="movements-content q-pa-lg">
            <q-card>
              <q-card-section class="bg-primary text-white">
                <div class="text-h6">Movimientos del Usuario</div>
              </q-card-section>
              
              <q-separator />
              
              <q-card-section>
                <!-- Aquí puedes agregar el contenido de los movimientos del usuario -->
                <div class="text-center q-pa-lg">
                  <q-icon name="receipt" size="xl" color="grey-5" />
                  <div class="text-grey-5 q-mt-md">No hay movimientos registrados</div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </template>

        <!-- Botón flotante solo para cambiar contraseña -->
        <q-page-sticky position="bottom-right" :offset="[18, 18]">
          <q-btn
            color="primary"
            icon="lock"
            round
            @click="changePassword"
            title="Cambiar contraseña"
          />
        </q-page-sticky>

        <!-- Diálogo de edición de datos personales -->
        <q-dialog v-model="personalEditDialog" persistent>
          <q-card style="min-width: 70vw;">
            <q-toolbar class="bg-primary text-white">
              <q-toolbar-title>Editar Datos Personales</q-toolbar-title>
              <q-btn flat round dense icon="close" v-close-popup />
            </q-toolbar>

            <q-card-section>
              <q-form @submit="savePersonalInfo">
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-sm-6">
                    <q-input
                      v-model="editForm.name"
                      label="Nombre"
                      outlined
                      lazy-rules
                      :rules="[
                        val => !!val || 'El nombre es requerido',
                        val => val.length >= 2 || 'Mínimo 2 caracteres',
                        val => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(val) || 'Solo letras y espacios'
                      ]"
                    />
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-input
                      v-model="editForm.lastName"
                      label="Apellido"
                      outlined
                      :rules="[
                        val => !val || val.length >= 2 || 'Mínimo 2 caracteres',
                        val => !val || /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(val) || 'Solo letras y espacios'
                      ]"
                    />
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-input
                      v-model="editForm.email"
                      label="Correo electrónico"
                      type="email"
                      outlined
                      lazy-rules
                      :rules="[
                        val => !!val || 'El correo es requerido',
                        val => /.+@.+\..+/.test(val) || 'Correo no válido',
                        val => val.length <= 100 || 'Máximo 100 caracteres'
                      ]"
                    />
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-input
                      v-model="editForm.phone"
                      label="Teléfono"
                      outlined
                      mask="(+57) ### #######"
                      unmasked-value
                      hint="Formato: (+57) XXX XXXXXX"
                      :rules="[
                        val => !!val || 'El teléfono es requerido',
                        val => !val || val.length === 10 || 'Deben ser 10 dígitos',
                        val => !val || /^[0-9]+$/.test(val) || 'Solo números permitidos'
                      ]"
                    />
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-input
                      v-model="editForm.dateOfBirth"
                      label="Fecha de nacimiento"
                      outlined
                      type="date"
                      :rules="[
                        val => !!val || 'Debes poner tu fecha de nacimiento',
                        val => !val || isValidDate(val) || 'Fecha inválida',
                        val => !val || isAdult(val) || 'Debes ser mayor de 18 años',
                        val => !val || !isTooOld(val) || 'Fecha no válida'
                      ]"
                    />
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-select
                      v-model="editForm.gender"
                      :options="genderOptions"
                      label="Género"
                      outlined
                      :rules="[
                        val => !!val || 'Por favor diligencie su genero',
                        val => !val || genderOptions.includes(val) || 'Seleccione una opción válida'
                      ]"
                    />
                  </div>
                </div>

                <div class="q-mt-lg flex justify-end">
                  <q-btn label="Cancelar" color="negative" flat v-close-popup class="q-mr-sm" />
                  <q-btn label="Guardar" type="submit" color="primary" />
                </div>
              </q-form>
            </q-card-section>
          </q-card>
        </q-dialog>

        <!-- Diálogo de edición de dirección -->
        <q-dialog v-model="addressEditDialog" persistent>
          <q-card style="min-width: 70vw;">
            <q-toolbar class="bg-primary text-white">
              <q-toolbar-title>Editar Dirección</q-toolbar-title>
              <q-btn flat round dense icon="close" v-close-popup />
            </q-toolbar>

            <q-card-section>
              <q-form @submit="saveAddressInfo">
                <div class="row q-col-gutter-md">
                  <div class="col-12">
                    <q-input
                      v-model="editForm.shippingAddress.street"
                      label="Dirección (Calle, número, apartamento)"
                      outlined
                      lazy-rules
                      :rules="[
                        val => !!val || 'La dirección es requerida',
                        val => val.length >= 5 || 'Mínimo 5 caracteres',
                        val => val.length <= 100 || 'Máximo 100 caracteres'
                      ]"
                    />
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-select
                      v-model="editForm.shippingAddress.state"
                      :options="colombianStates"
                      label="Departamento"
                      outlined
                      use-input
                      @filter="filterStates"
                      :rules="[
                        val => !!val || 'El departamento es requerido',
                        val => allColombianStates.includes(val) || 'Seleccione un departamento válido'
                      ]"
                    />
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-select
                      v-model="editForm.shippingAddress.city"
                      :options="filteredCities"
                      label="Ciudad"
                      outlined
                      use-input
                      @filter="filterCities"
                      :rules="[
                        val => !!val || 'La ciudad es requerida',
                        val => allColombianCities.includes(val) || 'Seleccione una ciudad válida'
                      ]"
                    />
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-input
                      v-model="editForm.shippingAddress.zipCode"
                      label="Código Postal"
                      outlined
                      mask="######"
                      unmasked-value
                      hint="Código postal de 6 dígitos"
                      :rules="[
                        val => !!val || 'Por favor ingrese su código postal',
                        val => !val || val.length === 6 || 'Deben ser 6 dígitos',
                        val => !val || /^[0-9]+$/.test(val) || 'Solo números permitidos'
                      ]"
                    />
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-input
                      v-model="editForm.shippingAddress.country"
                      label="País"
                      outlined
                      readonly
                      value="Colombia"
                    />
                  </div>
                </div>

                <div class="q-mt-lg flex justify-end">
                  <q-btn label="Cancelar" color="negative" flat v-close-popup class="q-mr-sm" />
                  <q-btn label="Guardar" type="submit" color="primary" />
                </div>
              </q-form>
            </q-card-section>
          </q-card>
        </q-dialog>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import { useStore } from '../stores/store';
import { putData } from '../service/service';
import { showNotification } from '../utils/utils';
const store = useStore();
const $q = useQuasar();

// Datos estáticos del usuario
const user = ref(store.userInformation);


// Estado del drawer
const leftDrawerOpen = ref(true);
const miniState = ref(true);
const activeTab = ref('profile');

// Datos de Colombia
const allColombianStates = [
  'Amazonas', 'Antioquia', 'Arauca', 'Atlántico', 'Bolívar', 
  'Boyacá', 'Caldas', 'Caquetá', 'Casanare', 'Cauca', 
  'Cesar', 'Chocó', 'Córdoba', 'Cundinamarca', 'Guainía', 
  'Guaviare', 'Huila', 'La Guajira', 'Magdalena', 'Meta', 
  'Nariño', 'Norte de Santander', 'Putumayo', 'Quindío', 
  'Risaralda', 'San Andrés y Providencia', 'Santander', 'Sucre', 
  'Tolima', 'Valle del Cauca', 'Vaupés', 'Vichada'
];

const allColombianCities = [
  // Ciudades principales por departamento
  // Amazonas
  'Leticia', 'Puerto Nariño',
  // Antioquia
  'Medellín', 'Bello', 'Itagüí', 'Envigado', 'Rionegro',
  // Atlántico
  'Barranquilla', 'Soledad', 'Malambo', 'Sabanalarga',
  // Bogotá (especial)
  'Bogotá D.C.',
  // Bolívar
  'Cartagena', 'Magangué', 'Turbaco',
  // Boyacá
  'Tunja', 'Duitama', 'Sogamoso',
  // Caldas
  'Manizales', 'La Dorada', 'Chinchiná',
  // Valle del Cauca
  'Cali', 'Palmira', 'Buenaventura', 'Tuluá', 'Cartago'
];

const colombianStates = ref([...allColombianStates]);
const filteredCities = ref([...allColombianCities]);

// Estado de los diálogos de edición
const personalEditDialog = ref(false);
const addressEditDialog = ref(false);

// Formulario de edición
const editForm = ref({
  name: '',
  lastName: '',
  email: '',
  phone: '',
  dateOfBirth: null,
  gender: '',
  shippingAddress: {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Colombia'
  }
});

// Opciones para el selector de género
const genderOptions = [
  'Masculino', 'Femenino', 'Otro', 'Prefiero no decir'
];

// Computed properties
const fullName = computed(() => {
  return `${user.value.name} ${user.value.lastName !== 'No especificado' ? user.value.lastName : ''}`.trim();
});

const roleName = computed(() => {
  const roles = {
    1: "Usuario Estándar",
    2: "Administrador",
    3: "Moderador"
  };
  return roles[user.value.role] || "Usuario";
});

const roleBadgeColor = computed(() => {
  const colors = {
    1: "blue",
    2: "red",
    3: "orange"
  };
  return colors[user.value.role] || "blue";
});

// Métodos
const formatDate = (dateString) => {
  if (!dateString) return 'No especificada';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Filtrar departamentos
const filterStates = (val, update) => {
  update(() => {
    const needle = val.toLowerCase();
    colombianStates.value = allColombianStates.filter(
      v => v.toLowerCase().indexOf(needle) > -1
    );
  });
};

// Filtrar ciudades basado en departamento seleccionado
const filterCities = (val, update) => {
  update(() => {
    const needle = val.toLowerCase();
    if (editForm.value.shippingAddress.state) {
      // En un caso real, aquí deberías filtrar las ciudades del departamento seleccionado
      filteredCities.value = allColombianCities.filter(
        v => v.toLowerCase().indexOf(needle) > -1
      );
    } else {
      filteredCities.value = allColombianCities.filter(
        v => v.toLowerCase().indexOf(needle) > -1
      );
    }
  });
};

// Validación de fecha
const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

const isAdult = (dateString) => {
  const birthDate = new Date(dateString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age >= 18;
};

const isTooOld = (dateString) => {
  const birthDate = new Date(dateString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  return age > 120;
};

const openPersonalEditDialog = () => {
  // Copiar los datos actuales del usuario al formulario de edición
  editForm.value = {
    name: user.value.name,
    lastName: user.value.lastName,
    email: user.value.email,
    phone: user.value.phone !== 'N/A' ? user.value.phone : '',
    dateOfBirth: user.value.dateOfBirth ? formatDateForInput(user.value.dateOfBirth) : null,
    gender: user.value.gender !== 'No especificado' ? user.value.gender : '',
    shippingAddress: {
      street: user.value.shippingAddress.street,
      city: user.value.shippingAddress.city,
      state: user.value.shippingAddress.state,
      zipCode: user.value.shippingAddress.zipCode,
      country: user.value.shippingAddress.country
    }
  };
  
  personalEditDialog.value = true;
};

const openAddressEditDialog = () => {
  // Copiar los datos actuales de dirección al formulario de edición
  editForm.value.shippingAddress = {
    street: user.value.shippingAddress.street !== 'No especificado' ? user.value.shippingAddress.street : '',
    city: user.value.shippingAddress.city !== 'No especificada' ? user.value.shippingAddress.city : '',
    state: user.value.shippingAddress.state !== 'No especificado' ? user.value.shippingAddress.state : '',
    zipCode: user.value.shippingAddress.zipCode !== 'N/A' ? user.value.shippingAddress.zipCode : '',
    country: 'Colombia'
  };
  
  addressEditDialog.value = true;
};

const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

const savePersonalInfo =async () => {
  // Actualizar los datos del usuario
  user.value.name = editForm.value.name;
  user.value.lastName = editForm.value.lastName || 'No especificado';
  user.value.email = editForm.value.email;
  user.value.phone = editForm.value.phone || 'N/A';
  user.value.dateOfBirth = editForm.value.dateOfBirth || null;
  user.value.gender = editForm.value.gender || 'No especificado';
  user.value.updatedAt = new Date().toISOString();
  
  const response = await putData(`/users/${user.value._id}`,{
      data:editForm.value
    })
  $q.notify({
    type: 'positive',
    message: 'Datos personales actualizados correctamente',
    position: 'top'
  });
  personalEditDialog.value = false;
};

const saveAddressInfo = () => {
  // Actualizar la dirección del usuario
  user.value.shippingAddress.street = editForm.value.shippingAddress.street || 'No especificado';
  user.value.shippingAddress.city = editForm.value.shippingAddress.city || 'No especificada';
  user.value.shippingAddress.state = editForm.value.shippingAddress.state || 'No especificado';
  user.value.shippingAddress.zipCode = editForm.value.shippingAddress.zipCode || 'N/A';
  user.value.shippingAddress.country = 'Colombia';
  
  // Actualizar la fecha de modificación
  user.value.updatedAt = new Date().toISOString();
  
  // Mostrar notificación de éxito
  $q.notify({
    type: 'positive',
    message: 'Dirección actualizada correctamente',
    position: 'top'
  });
  
  // Cerrar el diálogo
  addressEditDialog.value = false;
};

const changePassword = () => {
  console.log("Cambiar contraseña");
  // Lógica para cambiar contraseña
};
</script>

<style lang="scss" scoped>
@import url("../style/userProfile.css");

.profile-content, .movements-content {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.q-drawer {
  background-color: #f5f5f5;
}

.q-item {
  border-radius: 8px;
  margin: 4px 8px;
  
  &--active {
    background-color: #e0e0e0;
    color: #1976d2;
    font-weight: 500;
    
    .q-icon {
      color: #1976d2;
    }
  }
}

.q-page-container {
  padding-left: 300px;
  transition: padding-left 0.3s ease;
  
  @media (max-width: 700px) {
    padding-left: 0;
  }
}

.q-drawer--mini {
  width: 60px !important;
  
  .q-item__section--avatar {
    min-width: 0;
  }
  
  .q-item__section--main {
    display: none;
  }
}
</style>