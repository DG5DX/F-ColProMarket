<template>
  <q-layout view="hHh LpR fFf">
    <q-header bordered class="header-tech">
      <q-toolbar>
        <div class="row items-center">
          <q-btn 
            dense 
            flat 
            round 
            icon="menu" 
            @click="toggleLeftDrawer"
            class="menu-btn q-mr-sm"
          />
          <q-avatar square size="md">
            <img src="../assets/MiniLogo.jpeg">
          </q-avatar>
          <q-toolbar-title class="tech-title">
            ColProductMarket
          </q-toolbar-title>
        </div>

        <div class="search-container">
          <q-input
            v-model="searchQuery"
            dense
            standout
            bg-color="white"
            placeholder="Buscar productos electrónicos..."
            class="search-input"
            input-class="text-black"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>

        <!-- Menú superior derecho -->
        <div class="row items-center menu-right">
          <q-btn flat label="Ingresar" to="/login" class="text-white" />
          <q-btn flat label="Registro" to="/register" class="text-white" />
          <q-btn flat round icon="shopping_cart" class="text-white">
            <q-badge color="orange" floating>3</q-badge>
          </q-btn>
        </div>
      </q-toolbar>

      <!-- Menú de categorías -->
      <q-tabs align="center" class="categories-tabs">
        <q-route-tab label="PRODUCTOS" to="/productos" />
        <q-route-tab label="COMUNIDAD" to="/comunidad" />
        <q-route-tab label="REBAJAS" to="/rebajas" />
        <q-route-tab label="CONTACTO" to="/contacto" />
      </q-tabs>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" side="left" bordered>
      <q-list>
        <q-item-label header>Menú</q-item-label>
        <q-item clickable to="/productos">
          <q-item-section avatar>
            <q-icon name="shopping_bag" />
          </q-item-section>
          <q-item-section>Productos</q-item-section>
        </q-item>
        <q-item clickable to="/comunidad">
          <q-item-section avatar>
            <q-icon name="groups" />
          </q-item-section>
          <q-item-section>Comunidad</q-item-section>
        </q-item>
        <q-item clickable to="/rebajas">
          <q-item-section avatar>
            <q-icon name="local_offer" />
          </q-item-section>
          <q-item-section>Rebajas</q-item-section>
        </q-item>
        <q-item clickable to="/contacto">
          <q-item-section avatar>
            <q-icon name="contact_mail" />
          </q-item-section>
          <q-item-section>Contacto</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    const leftDrawerOpen = ref(false)
    const searchQuery = ref('')

    return {
      leftDrawerOpen,
      searchQuery,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
}
</script>

<style scoped>
.header-tech {
  background: linear-gradient(to right, #1a2a6c, #204a87);
  height: 112px;
}

.tech-title {
  font-family: 'Roboto Condensed', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
}

.search-container {
  flex-grow: 1;
  max-width: 600px;
  margin: 0 20px;
}

.search-input {
  border-radius: 4px;
}

.categories-tabs {
  background: rgba(0,0,0,0.1);
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
  
  .search-container {
    order: 3;
    width: 100%;
    margin: 8px 0;
    max-width: 100%;
  }
  
  .menu-right .q-btn:not(:last-child) {
    display: none;
  }
  
  .categories-tabs .q-tab {
    padding: 0 8px;
    font-size: 0.8rem;
  }
}
</style>