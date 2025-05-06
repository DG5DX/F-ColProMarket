<template>
    <q-layout view="hHh lpR fFf" id="body">
      <!-- Drawer -->
      <q-drawer
        v-model="rightDrawerOpen"
        side="right"
        :show-if-above="false"
        :breakpoint="900"
        bordered
        class="custom-drawer"
      >
        <div class="drawer-header q-pa-md flex items-center">
          <img
            src="../assets/MiniLogo.jpeg"
            alt="Logo"
            class="mini-logo q-mr-md"
          />
          <h3 class="text-h6 q-ma-none">Menú</h3>
        </div>
        <q-separator />
        <q-list>
          <!-- Menú de navegación -->
          <q-item clickable v-ripple class="drawer-item">
            <q-item-section avatar>
              <q-icon name="shopping_bag" />
            </q-item-section>
            <q-item-section>Productos</q-item-section>
          </q-item>
          <q-item clickable v-ripple class="drawer-item">
            <q-item-section avatar>
              <q-icon name="groups" />
            </q-item-section>
            <q-item-section>Comunidad</q-item-section>
          </q-item>
          <q-item clickable v-ripple class="drawer-item">
            <q-item-section avatar>
              <q-icon name="local_offer" />
            </q-item-section>
            <q-item-section>Rebajas</q-item-section>
          </q-item>
          <q-item clickable v-ripple class="drawer-item">
            <q-item-section avatar>
              <q-icon name="contact_mail" />
            </q-item-section>
            <q-item-section>Contacto</q-item-section>
          </q-item>
  
          <q-separator class="q-my-sm" />
  
          <!-- Información adicional -->
          <q-item clickable v-ripple class="drawer-item">
            <q-item-section avatar>
              <q-icon name="help_outline" />
            </q-item-section>
            <q-item-section>Ayuda</q-item-section>
          </q-item>
          <q-item clickable v-ripple class="drawer-item">
            <q-item-section avatar>
              <q-icon name="wallet" />
            </q-item-section>
            <q-item-section>Metodo De Pago</q-item-section>
          </q-item>
          <q-item clickable v-ripple class="drawer-item">
            <q-item-section avatar>
              <q-icon name="shopping_cart" />
            </q-item-section>
            <q-item-section>Carrito</q-item-section>
          </q-item>
          <hr>
          <q-item clickable v-ripple class="drawer-item" style="color: red;">
            <q-item-section avatar>
              <q-icon name="logout" />
            </q-item-section>
            <q-item-section>Cerrar Sesión</q-item-section>
          </q-item>
        </q-list>
      </q-drawer>
  
      <!-- Header -->
      <q-header elevated>
        <div id="app">
          <router-link to="/" id="logo" style="text-decoration: none">
            <img src="../assets/Logo ColProMarket.jpeg" alt="logo" />
          </router-link>
          <div id="search">
            <q-input v-model="search" filled type="search" placeholder="Buscar">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <div id="menu">
            <q-btn
              color="dark"
              icon="menu"
              @click="rightDrawerOpen = !rightDrawerOpen"
              flat
              round
            />
          </div>
        </div>
      </q-header>
  
      <!-- Contenido principal -->
      <q-page-container>
        <router-view />
      </q-page-container>
    </q-layout>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const rightDrawerOpen = ref(false)
  const search = ref("")
  
  function Dialog(action) {
    switch (action) {
      case "openLogin":
        // Lógica para abrir el diálogo de Login
        break
      case "openRegister":
        // Lógica para abrir el diálogo de Registro
        break
      case "closeLogin":
        // Lógica para cerrar el diálogo de Login
        break
      case "closeRegister":
        // Lógica para cerrar el diálogo de Registro
        break
    }
  }
  </script>
  
  <style scoped>
  #body {
    background: linear-gradient(
      to right,
      rgba(255, 255, 0, 0.5),
      rgba(0, 0, 255, 0.5),
      rgba(255, 0, 0, 0.5)
    );
  }
  
  #app {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    align-items: center;
    padding: 5px;
    gap: 10px;
    background-color: #FFFFFF;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  #logo img {
    max-height: 10vh;
    object-fit: contain;
  }
  
  #search {
    flex: 1;
    min-width: 200px;
    max-width: 400px;
    display: flex;
    justify-content: center;
  }
  
  #nav-buttons {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    justify-content: center;
    align-items: center;
  }
  
  #menu {
    margin-left: auto;
  }
  
  .custom-drawer {
    background: linear-gradient(to bottom, #ffffff, #f9f9f9);
    box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  }
  
  .drawer-header {
    background-color: #f1f1f1;
    padding: 5px;
    border-bottom: 1px solid #ddd;
  }
  
  .drawer-item {
    padding: 10px 16px;
    font-size: 15px;
    border-radius: 8px;
    margin: 4px 8px;
    transition: background-color 0.2s ease;
  }
  
  .drawer-item:hover {
    background-color: #f5f5f5;
  }
  
  .drawer-item:active {
    background-color: #e0e0e0;
  }
  
  #footer {
    background-color: #f9f9f9;
  }
  
  .mini-logo {
    height: 40px;
    object-fit: contain;
    border-radius: 4px;
  }
  
  .q-btn-group {
    display: flex;
    justify-content: space-around;
  }
  
  .q-btn {
    margin-top: 10px;
  }
  
  .q-input {
    width: 100%;
  }
  
  @media (max-width: 990px) {
    #nav-buttons {
      margin: 0%;
    }
  
    #menu {
      display: block;
    }
  }
  
  @media (max-width: 960px) {
    #nav-buttons {
      display: none;
    }
  }
  
  @media (max-width: 500px) {
    #logo img {
      max-height: 6vh;
    }
  }
  
  @media (max-width: 550px) {
    .especial .especial-card {
      min-width: 90%;
    }
  }
  </style>
  