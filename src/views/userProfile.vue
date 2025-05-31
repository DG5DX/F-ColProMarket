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

    <!-- Contenido de la página -->
    <q-page-container>
      <q-page class="profile-page">
        <!-- Header con imagen de fondo -->
        <div class="profile-header bg-primary text-white">
          <q-parallax :height="200" :speed="0.5">
            <template v-slot:media>
              <img src="https://cdn.quasar.dev/img/parallax2.jpg">
            </template>

            <div class="header-content absolute-full flex flex-center">
              <div class="header-overlay flex items-center q-px-lg" style="max-width: 1200px; width: 100%;">
                <!-- Avatar -->
                <q-avatar size="120px" class="q-mr-md">
                  <img :src="user.profilePicture !== 'N/A' ? user.profilePicture : 'https://cdn.quasar.dev/img/avatar.png'">
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

        <!-- Contenido principal -->
        <div class="profile-content q-pa-lg">
          <div class="row q-col-gutter-lg">
            <!-- Columna izquierda - Información personal -->
            <div class="col-12 col-md-6">
              <q-card class="my-card">
                <q-card-section class="bg-primary text-white">
                  <div class="text-h6">Información Personal</div>
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
                <q-card-section class="bg-primary text-white">
                  <div class="text-h6">Dirección de Envío</div>
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

        <!-- Botones flotantes de acción -->
        <q-page-sticky position="bottom-right" :offset="[18, 18]">
          <q-fab
            color="primary"
            icon="settings"
            direction="up"
            vertical-actions-align="right"
          >
            <q-fab-action color="primary" @click="editProfile" icon="edit" label="Editar perfil"/>
            <q-fab-action color="secondary" @click="changePassword" icon="lock" label="Cambiar contraseña"/>
          </q-fab>
        </q-page-sticky>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue';

// Datos estáticos del usuario
const user = ref({
  _id: "6839b32addd3364c6bc45fa8",
  name: "elias",
  email: "elias@gmail.com",
  password: "$2b$10$apZNdy7xxaVq2v7Q0LlJfO/./MZKpdWMqo8IIJ7aS.8gJZDZKTpnO",
  lastName: "No especificado",
  phone: "N/A",
  shippingAddress: {
    street: "No especificado",
    city: "No especificada",
    state: "No especificado",
    zipCode: "N/A",
    country: "No especificado"
  },
  dateOfBirth: null,
  gender: "No especificado",
  profilePicture: "N/A",
  role: 1,
  state: 1,
  createdAt: "2025-05-30T13:31:22.170+00:00",
  updatedAt: "2025-05-30T13:31:22.170+00:00",
  __v: 0
});

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

const editProfile = () => {
  console.log("Editar perfil");
  // Lógica para editar perfil
};

const changePassword = () => {
  console.log("Cambiar contraseña");
  // Lógica para cambiar contraseña
};
</script>

<style lang="scss" scoped>
.profile-page {
  padding: 0;
  background-color: var(--three-color--);
}

.profile-header {
  position: relative;
  height: 200px;
  overflow: hidden;

  .header-overlay {
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(2px);
  }
}

.profile-content {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.my-card {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: var(--card-shadow);
}

.q-item__label--caption {
  color: var(--text-secondary);
}

.q-item__label {
  color: var(--text-primary);
  font-weight: 500;
}
</style>