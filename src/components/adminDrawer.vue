<template>
  <q-layout style="min-height: 100px">
    <q-header bordered class="header-tech">
      <q-toolbar>
        <q-space />

        <div class="row items-center q-mr-sm">
          <q-toolbar-title class="tech-title">
            ColProductMarket
          </q-toolbar-title>
          <q-avatar circle size="md">
            <img src="../assets/MiniLogo.jpeg" />
          </q-avatar>
        </div>

          <q-btn flat round dense class="q-mr-sm">
            <q-icon name="keyboard_arrow_down" />
          </q-btn>

        <q-menu
          v-model="adminDialog"
          anchor="bottom right"
          self="top right"
          :offset="[10, 10]"
          class="admin-menu"
        >
          <q-card style="width: 320px">
            <q-card-section class="profile-header column items-center">
              <q-avatar size="72px" class="q-mb-sm">
                <q-icon name="person" size="48px" />
              </q-avatar>
              <div class="text-h6 text-white">Nombre Administrador</div>
              <div class="text-subtitle2 text-white">
                admin@colproductmarket.com
              </div>
            </q-card-section>

            <q-separator />

            <q-card-actions>
              <q-btn
                flat
                label="Cerrar sesión"
                icon="logout"
                color="negative"
                class="full-width"
                v-close-popup
              />
            </q-card-actions>
          </q-card>
        </q-menu>
      </q-toolbar>
    </q-header>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";

const adminDialog = ref(false);

function toggleAdminDialog() {
  adminDialog.value = !adminDialog.value;
}
</script>

<style scoped>
.header-tech {
  background: #1a2a6c;
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

.profile-header {
  background: linear-gradient(to right, #1a2a6c, #204a87);
  padding: 20px;
}

.categories-tabs .q-tab {
  color: white;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 0 16px;
}

.menu-right {
  margin-left: auto;
}

@media (max-width: 768px) {
  .tech-title {
    max-width: 120px;
    font-size: 1.2rem;
  }

  .categories-tabs .q-tab {
    padding: 0 8px;
    font-size: 0.8rem;
  }
}

.admin-menu {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
}
</style>