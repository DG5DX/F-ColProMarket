<template>
  <q-layout style="min-height: 1px" view="hHh Lpr lff">
    <q-header bordered class="header-tech">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
          class="q-mr-sm"
        />

        <q-space />

        <div class="row items-center q-mr-sm">
          <q-toolbar-title class="tech-title">
            ColProductMarket
          </q-toolbar-title>
          <q-avatar circle size="md">
            <img src="../assets/MiniLogo.jpeg" />
          </q-avatar>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      :width="250"
      :breakpoint="768"
      bordered
      class="drawer-admin bg-grey-2"
    >
      <!-- Encabezado detallado del admin -->
      <div class="admin-profile-header column items-center q-pa-md">
        <q-avatar size="72px" class="q-mb-sm">
          <q-icon name="person" size="48px" />
        </q-avatar>
        <div class="text-h6 text-white">Nombre Administrador</div>
        <div class="text-subtitle2 text-white q-mb-sm">
          admin@colproductmarket.com
        </div>
        <q-chip color="primary" text-color="white" icon="admin_panel_settings">
          Administrador
        </q-chip>
      </div>

      <q-separator />

      <!-- Menú de navegación -->
      <q-list padding class="menu-list">
        <q-item clickable v-ripple to="/admin" exact>
          <q-item-section avatar>
            <q-icon name="inventory" />
          </q-item-section>
          <q-item-section> Productos </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/admincategories">
          <q-item-section avatar>
            <q-icon name="category" />
          </q-item-section>
          <q-item-section> Categorías </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/adminusers">
          <q-item-section avatar>
            <q-icon name="people" />
          </q-item-section>
          <q-item-section> Usuarios </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/adminmoves">
          <q-item-section avatar>
            <q-icon name="shopping_bag" />
          </q-item-section>
          <q-item-section> Movimientos </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/adminsales">
          <q-item-section avatar>
            <q-icon name="point_of_sale" />
          </q-item-section>
          <q-item-section> Ventas </q-item-section>
        </q-item>
        
        <q-separator/>
        
        <q-item clickable v-ripple @click="closeSession()" class="logout-item">
          <q-item-section avatar>
            <q-icon name="logout" />
          </q-item-section>
          <q-item-section> Cerrar Sesión </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";
import { useStore } from "../stores/store.js";
const store = useStore();
import { Notify } from "quasar";
import { router } from "../routes/routes";

const leftDrawerOpen = ref(false);
const adminDialog = ref(false);

function toggleAdminDialog() {
  adminDialog.value = !adminDialog.value;
}

function closeSession() {
  store.token = null;
  store.userId = null;
  Notify.create({
    type: "positive",
    message: "Cierre de sesion exitoso",
  });
  router.replace("/");
}
</script>

<style scoped>
.header-tech {
  background: linear-gradient(135deg, #1976d2 0%, #0d47a1 100%);
}

.tech-title {
  font-family: "Roboto Condensed", sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 10px;
}

.admin-profile-header {
  background: linear-gradient(135deg, #1976d2 0%, #0d47a1 100%);
  padding: 20px;
}

.menu-list .q-item {
  border-radius: 8px;
  margin: 4px 8px;
  transition: all 0.3s ease;
}

.menu-list .q-item--active {
  background-color: #1976d2;
  color: white;
}

.logout-item {
  color: red;
}

.logout-item .q-icon {
  color: red;
}

.logout-item:hover {
  background-color: rgba(255, 0, 0, 0.1) !important;
}

/* Estilos para móvil */
@media (max-width: 768px) {
  .tech-title {
    max-width: 120px;
    font-size: 1.2rem;
  }
  
  .admin-profile-header {
    padding: 15px;
  }
  
  .admin-profile-header .text-h6 {
    font-size: 1.1rem;
    text-align: center;
  }
  
  .admin-profile-header .text-subtitle2 {
    font-size: 0.8rem;
    text-align: center;
  }
  
  .menu-list .q-item {
    padding: 8px 16px;
  }
  
  .menu-list .q-item__section--avatar {
    min-width: 36px;
  }
  
  .q-drawer {
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  }
}
</style>