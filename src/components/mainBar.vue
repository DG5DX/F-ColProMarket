<template>
  <q-layout style="min-height: 100px;">
    <q-header bordered class="header-tech">
      <!-- Barra principal -->
      <q-toolbar class="primary-toolbar">
        <!-- Logo y nombre - siempre visible -->
        <div class="logo-section">
          <q-avatar circle size="sm" @click="router.push('/')" class="cursor-pointer">
            <img src="../assets/MiniLogo.jpeg">
          </q-avatar>
          <q-toolbar-title class="tech-title">
            ColProductMarket
          </q-toolbar-title>
        </div>

        <!-- Búsqueda - se adapta según el espacio -->
        <div class="search-section">
          <q-input 
            v-model="searchQuery"
            dense
            standout
            bg-color="white"
            placeholder="Buscar..."
            class="search-input"
            input-class="text-black"
            @keyup.enter="productsSearch()"
          >
            <template v-slot:prepend>
              <q-icon name="search" class="cursor-pointer" />
            </template>
          </q-input>
        </div>

        <!-- Acciones de usuario - se adaptan dinámicamente -->
        <div class="user-actions">
          <!-- Versión completa -->
          <div class="full-actions">
            <template v-if="!store.userId">
              <q-btn flat label="Ingresar" @click="store.showLoginDialog = true"
                :class="['action-btn', { 'ingresar-animado': !store.showRegister }]" />
              <q-btn v-if="store.showRegister" flat label="Registro" @click="store.showRegisterDialog = true"
                class="action-btn" />
            </template>
            <template v-else>
              <q-btn flat round icon="person" class="action-btn">
                <q-menu>
                  <div class="user-profile-menu q-pa-md">
                    <div class="text-h6 text-center q-mt-sm">{{ store.userInformation.name || 'Usuario' }}</div>
                    <div class="column items-center q-mb-md">
                      <q-avatar size="70px" class="q-mb-sm">
                        <img :src="store.profilePicture || 'https://ostermancron.com/wp-content/uploads/2016/02/blank-profile-picture-973460_640.png'">
                      </q-avatar>
                      <div class="text-caption text-grey-7 text-center q-mb-md">{{ store.userInformation.email || 'test@gmail.com' }}
                      </div>
                    </div>

                    <q-btn flat label="Administrar cuenta" class="full-width" icon="manage_accounts"
                      style="color: #1976D2;" @click="router.push('/userProfile')" />

                    <q-separator class="q-my-sm" />

                    <q-btn flat label="Cerrar Sesión" icon="logout" class="full-width" style="color: #C10015;"
                      @click="closeSession" />
                  </div>
                </q-menu>
              </q-btn>
            </template>
            <q-btn flat   class="full-width" icon="favorite"
                    style="box-shadow: 0%;" @click="goToFavorites()" />
            <q-btn flat round icon="shopping_cart" class="cart-btn" @click="cart()">
  <q-badge v-if="store.cart.items?.length > 0" color="red" floating rounded>
    {{ store.cart.items.length }}
  </q-badge>
            </q-btn>
            
          </div>

          <!-- Versión compacta -->
          <div class="compact-actions">
            <q-btn flat round icon="person" class="action-btn" v-if="!store.userId"
              @click="store.showLoginDialog = true" />
            <q-btn flat round icon="person" class="action-btn" v-else>
              <q-menu>
                <div class="user-profile-menu q-pa-md">
                  <div class="text-h6 text-center q-mt-sm">{{ store.userInformation.name || 'Usuario' }}</div>
                  <div class="column items-center q-mb-md">
                    <q-avatar size="70px" class="q-mb-sm">
                      <img :src="store.profilePicture || 'https://ostermancron.com/wp-content/uploads/2016/02/blank-profile-picture-973460_640.png'">
                    </q-avatar>
                    <div class="text-caption text-grey-7 text-center q-mb-md">{{ store.email || 'test@gmail.com' }}
                    </div>
                  </div>
                  <q-btn flat label="Administrar cuenta" class="full-width" icon="manage_accounts"
                    style="color: #1976D2;" @click="router.push('/userProfile')" />
                    

                  <q-separator class="q-my-sm" />

                  <q-btn flat label="Cerrar Sesión" icon="logout" class="full-width" style="color: #C10015;"
                    @click="closeSession" />
                </div>
              </q-menu>
            </q-btn>



            <q-btn flat round icon="shopping_cart" class="cart-btn" @click="cart()">
              <q-badge v-if="store.cart.items?.length > 0" color="red" floating rounded>
                {{ store.cart.items.length }}
              </q-badge>
            </q-btn>
          </div>
        </div>

        <!-- Menú hamburguesa solo para móviles -->
        <q-btn flat round dense icon="menu" class="mobile-menu-btn" @click="toggleMobileMenu" />
      </q-toolbar>

      <!-- Categorías - responsive avanzado -->
      <q-toolbar class="categories-toolbar" :class="{ 'mobile-menu-open': mobileMenuOpen }">
        <div class="categories-container">
          <q-tabs align="left" class="categories-tabs" :breakpoint="0">
            <q-route-tab label="PRODUCTOS" to="/" exact />
            <q-route-tab label="FACTURAS" to="/invoice" exact />
            <q-route-tab label="REBAJAS" to="/sales" exact />
            <q-route-tab label="CONTACTO" to="/contact" exact />

          </q-tabs>
        </div>
      </q-toolbar>
    </q-header>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { router } from '../routes/routes';

import { useStore } from '../stores/store.js';
import { showNotification, validateToken } from '../utils/utils.js';
import FAVORITE from '../views/FAVORITE.vue';
const store = useStore();

const mobileMenuOpen = ref(false);
const searchQuery = ref('');

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value;
}

async function goToFavorites(){
  const canProceed = await validateToken()
  if (!canProceed) return
  router.push('/favorite')
}

function productsSearch() {
  if (searchQuery.value.trim()) {
    router.push({
      path: "/search",
      query: { data: searchQuery.value }
    });
  }
}

function closeSession() {
  store.token = null;
  store.userId = null;
  store.showRegister = true;
  store.cart = {
    items:[],
    total:0
}
  showNotification('positive', 'Has cerrado tu sesión.')
  router.replace("/");
}
async function favorite() {
   router.push('/favorite');
}
async function cart() {
  const canProceed = await validateToken()
  if (!canProceed) return
  router.push('/cart'); 
}
</script>

<style scoped>
/* Variables y estilos base */
.header-tech {
  background: var(--five-color--);
  position: fixed;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

@keyframes pulse-ingresar {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 rgba(255, 255, 255, 0.4);
    /* Sombra sutil blanca */
  }

  50% {
    transform: scale(1.05);
    /* Ligeramente más grande */
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.7);
    /* Sombra más prominente */
  }

  100% {
    transform: scale(1);
    box-shadow: 0 0 0 rgba(255, 255, 255, 0.4);
  }
}

/* Aplicar la animación al botón de ingresar */
.ingresar-animado {
  animation: pulse-ingresar 2s infinite ease-in-out;
  /* 2 segundos de duración, loop infinito, aceleración/desaceleración */
}

.primary-toolbar {
  height: 60px;
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  align-items: center;
  padding: 0 12px;
  gap: 12px;
}

/* Sección del logo */
.logo-section {
  display: flex;
  align-items: center;
  min-width: max-content;
}

.tech-title {
  font-family: 'Roboto Condensed', sans-serif;
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
  margin-left: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Búsqueda adaptable */
.search-section {
  width: 100%;
  min-width: 120px;
}

.search-input {
  border-radius: 20px;
  background: white;
}

.search-input :deep(.q-field__control) {
  height: 36px;
}

/* Acciones de usuario inteligentes */
.user-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.full-actions {
  display: flex;
  gap: 8px;
}

.compact-actions {
  display: none;
  gap: 8px;
}

.action-btn {
  color: white;
  font-weight: 500;
  padding: 6px 10px;
}

.cart-btn {
  position: relative;
  color: white;
}

/* Categorías optimizadas */
.categories-toolbar {
  height: 48px;
  background: var(--header-bg-gradient);
  transition: all 0.3s ease;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
}

.categories-container {
  min-width: max-content;
}

.categories-tabs {
  height: 100%;
  min-width: max-content;
}

.categories-tabs .q-tab {
  color: white;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 0 16px;
  min-width: auto;
  font-size: 0.85rem;
}

.categories-tabs .q-tab--active {
  color: var(--six-color--);
  font-weight: 600;
}

/* Menú móvil avanzado */
.mobile-menu-btn {
  display: none;
  margin-left: 8px;
}

/*Perfil de usuario */
.user-profile-menu {
  text-align: center;
}

.user-profile-menu .q-avatar {
  position: relative;
}

.user-profile-menu .absolute-bottom-right {
  position: absolute;
  bottom: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.8);
}

/* Sistema de breakpoints inteligentes */
@media (max-width: 1024px) {
  .primary-toolbar {
    grid-template-columns: auto 1fr auto;
    padding: 0 10px;
  }

  .tech-title {
    font-size: 1.1rem;
  }

  .categories-tabs .q-tab {
    padding: 0 12px;
    font-size: 0.8rem;
  }
}

@media (max-width: 768px) {
  .primary-toolbar {
    grid-template-columns: auto 1fr auto auto;
  }

  .full-actions {
    display: none;
  }

  .compact-actions {
    display: flex;
  }

  .search-section {
    min-width: 0;
  }

  .categories-toolbar {
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    max-height: 0;
    height: auto;
    overflow: hidden;
    background: var(--five-color--);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .categories-toolbar.mobile-menu-open {
    max-height: calc(100vh - 60px);
    padding: 8px 0;
  }

  .categories-tabs {
    flex-direction: column;
    align-items: stretch;
    min-width: 100%;
  }

  .categories-tabs .q-tab {
    justify-content: flex-start;
    padding: 10px 20px;
    font-size: 0.9rem;
  }

  .mobile-menu-btn {
    display: block;
  }
}

@media (max-width: 580px) and (min-width: 361px) {
  .primary-toolbar {
    height: 56px;
    grid-template-columns: auto 1fr auto auto;
    padding: 0 10px;
    gap: 10px;
  }

  .tech-title {
    font-size: 1.1rem;
    max-width: 120px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
  }

  .search-section {
    min-width: 120px;
    margin-left: 8px;
  }

  .search-input :deep(.q-field__control) {
    height: 34px;
  }

  .search-input :deep(input) {
    font-size: 0.9rem;
  }

  .user-actions {
    gap: 6px;
  }

  .action-btn,
  .cart-btn {
    width: 38px;
    height: 38px;
    min-width: 38px;
  }

  .mobile-menu-btn {
    margin-left: 4px;
  }

  .categories-toolbar {
    top: 56px;
  }

  .categories-tabs .q-tab {
    padding: 10px 16px;
    font-size: 0.85rem;
  }
}

/* Ajustes adicionales para mejor fluidez */
@media (max-width: 420px) {
  .tech-title {
    font-size: 1rem;
    max-width: 100px;
  }

  .search-section {
    min-width: 100px;
  }
}

@media (max-width: 360px) {
  .primary-toolbar {
    grid-template-columns: auto 1fr auto auto;
    padding: 0 8px;
    gap: 6px;
  }

  .tech-title {
    display: none;
  }

  .logo-section .q-avatar {
    width: 32px;
    height: 32px;
  }

  .search-section {
    margin-left: 4px;
    min-width: 80px;
  }
}

@media (max-width: 480px) {
  .primary-toolbar {
    height: 56px;
    grid-template-columns: auto 1fr auto auto;
    padding: 0 8px;
    gap: 8px;
  }

  .tech-title {
    font-size: 1rem;
    margin-left: 6px;
  }

  .logo-section .q-avatar {
    width: 32px;
    height: 32px;
  }

  .action-btn,
  .cart-btn {
    width: 36px;
    height: 36px;
    min-width: 36px;
  }

  .search-input {
    min-width: 0;
  }

  .search-input :deep(.q-field__control) {
    height: 32px;
  }

  .categories-toolbar {
    top: 56px;
  }
}

@media (max-width: 360px) {
  .tech-title {
    display: none;
  }

  .search-section {
    margin-left: 4px;
  }
}
</style>