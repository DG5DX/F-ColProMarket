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
          <q-input v-model="searchQuery" dense standout bg-color="white" placeholder="Buscar..." class="search-input"
            input-class="text-black" @keyup.enter="productsSearch()">
            <template v-slot:prepend>
            </template>
            <template v-slot:append>
              <q-btn flat round dense icon="search" @click="productsSearch()" class="search-btn" style="color: black;"/>
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
                        <img
                          :src="store.profilePicture || 'https://ostermancron.com/wp-content/uploads/2016/02/blank-profile-picture-973460_640.png'">
                      </q-avatar>
                      <div class="text-caption text-grey-7 text-center q-mb-md">{{ store.userInformation.email ||
                        'test@gmail.com' }}
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
            <q-btn flat class="full-width" icon="favorite" style="box-shadow: 0%;" @click="goToFavorites()">
              <q-badge v-if="store.dataFavorites?.length > 0" color="red" floating rounded>
                {{ store.dataFavorites?.length }}
              </q-badge>
            </q-btn>

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
                      <img
                        :src="store.profilePicture || 'https://ostermancron.com/wp-content/uploads/2016/02/blank-profile-picture-973460_640.png'">
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
            <q-route-tab label="REBAJAS" to="/sales" exact />
            <q-route-tab label="CONTACTO" to="/contact" exact />

          </q-tabs>
        </div>
      </q-toolbar>
    </q-header>

    <!--modal register-->
    <q-dialog class="form-container" v-model="store.showRegisterDialog">
  <q-card class="q-pa-md" style=" max-width: 600px; width: 500px;">
    <q-card-section class="q-pb-none">
      <p class="title">Registrate</p>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <form class="form q-gutter-md" @submit.prevent="registerUser">
        <div class="input-group">
          <q-input v-model="user.name" label="Nombre" type="text":rules="[val => !!val || 'El nombre es obligatorio']" />
          <q-input v-model="user.email" label="Correo Electronico" type="text" :rules="[val => !!val || 'El correo es obligatorio', val => /.+@.+\..+/.test(val) || 'Debe ser un correo válido']"/>
          <q-input v-model="user.phone" label="Telefono" type="tel" :rules="[val => !!val || 'El teléfono es obligatorio', val => /^[0-9]{10,15}$/.test(val) || 'Teléfono no válido (10-15 dígitos)']" @keydown="onlyNumbers"/>
          <q-input v-model="user.password" label="Contraseña" type="password" :rules="[val => !!val || 'La contraseña es requerida', val => val.length >= 6 || 'Mínimo 6 caracteres']" lazy-rules />
          <q-input v-model="user.ConfirmPassword" label="Confirmar contraseña" type="password" :rules="[val => !!val || 'Confirma tu contraseña', val => val === user.password || 'Las contraseñas no coinciden']" lazy-rules />
        </div>
        <q-btn class="sign q-mt-md" label="Registrarse" style="background-color: var(--fiv-color--);" @click="registerUser" :disable="!isRegisterFormValid" type="submit"/>
        
        <!-- Enlace para cambiar a login -->
        <div class="text-center q-mt-md">
          <p class="text-caption">¿Ya tienes una cuenta? 
            <a href="#" class="text-primary" @click.prevent="toggleAuthModals">Inicia sesión aquí</a>
          </p>
        </div>
      </form>
    </q-card-section>
  </q-card>
</q-dialog>


<!--modal para loguearse-->
<q-dialog class="form-container" v-model="store.showLoginDialog">
  <q-card class="q-pa-md" style=" max-width: 600px; width: 500px;">
    <q-card-section class="q-pb-none">
      <p class="title">Entra a tu cuenta</p>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <form class="form q-gutter-md" @submit.prevent="login">
        <div class="input-group">
          <q-input v-model="user.email" label="Correo Electronico" type="text" :rules="[val => !!val || 'El email es requerido', val => /.+@.+\..+/.test(val) || 'Email no válido']" lazy-rules/>
          <q-input v-model="user.password" label="Contraseña" type="password" :rules="[val => !!val || 'La contraseña es requerida', val => val.length >= 6 || 'Mínimo 6 caracteres']" lazy-rules />
        </div>
        <q-btn class="sign q-mt-md" label="Entrar" :loading="loading" style="background-color: var(--fiv-color--);" @click="login" :disable="!isLoginFormValid" type="submit"/>
        
        <div>
        <!-- Cambiar contraseña-->
          <div class="text-center q-mt-md">
            <p class="text-caption"> 
              <a href="#" class="text-primary" @click.prevent="handlePasswordRecovery">Perdí mi contraseña</a>
            </p>
          </div>

          <!-- Enlace para cambiar a registro -->
          <div class="text-center q-mt-md">
            <p class="text-caption">¿No tienes una cuenta? 
              <a href="#" class="text-primary" @click.prevent="toggleAuthModals">Regístrate aquí</a>
            </p>
          </div>
        </div>
      </form>
    </q-card-section>
  </q-card>
</q-dialog>

  </q-layout>
</template>

<script setup>
import { router } from '../routes/routes';
import { useStore } from '../stores/store.js';
import { postData, getData } from '../service/service.js';
import { showNotification, validateToken } from '../utils/utils.js';
import { ref, computed } from 'vue';
import { Notify } from 'quasar';
const store = useStore();
const mobileMenuOpen = ref(false);
const searchQuery = ref('');
const user = ref({});
const loading = ref(false);

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value;
}

async function goToFavorites() {
  const canProceed = await validateToken()
  if (!canProceed) return
  router.push('/favorite')
}

function productsSearch() {
  const query = searchQuery.value.trim();
  if (query) {
    router.push({
      path: "/search",
      query: { data: query }
    });
  } else {
    showNotification('warning', 'Por favor ingresa un término de búsqueda');
  }
}

function closeSession() {
  store.token = null;
  store.userId = null;
  store.showRegister = true;
  store.cart = {
    items: [],
    total: 0
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

const onlyNumbers = (e) => {
  // Permitir: teclas de control, números y teclado numérico
  if (
    ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key) ||
    (e.key >= '0' && e.key <= '9') ||
    (e.key >= 'NumPad0' && e.key <= 'NumPad9')
  ) {
    return; // Permitir la entrada
  }
  e.preventDefault(); // Bloquear otros caracteres
};


// Validación para el formulario de login
const isLoginFormValid = computed(() => {
  return (
    user.value.email && 
    user.value.password && 
    /.+@.+\..+/.test(user.value.email) && 
    user.value.password.length >= 6
  );
});

// Validación para el formulario de registro (ahora incluye teléfono)
const isRegisterFormValid = computed(() => {
  return (
    user.value.name &&
    user.value.email && 
    user.value.phone &&
    user.value.password && 
    user.value.ConfirmPassword && 
    /.+@.+\..+/.test(user.value.email) &&
    /^[0-9]{10,15}$/.test(user.value.phone) &&
    user.value.password.length >= 6 &&
    user.value.password === user.value.ConfirmPassword
  );
});



// Función para registrar usuario
async function registerUser() {
  try {
    if(user.value.password !== user.value.ConfirmPassword){
      Notify.create({
        type:'negative',
        message:'Las contraseñas deben ser iguales'
      })
      throw new Error ('Contraseñas deben ser iguales')
    }

    const response = await postData("/users",{
      data:toRaw(user.value)
    })

    if(response.success == true){
      Notify.create({
        type:'positive',
        message:'¡Cuenta creada con éxito! Inicia sesión para continuar.'
      });

      await postData("/email/welcome",{
        to:response.user.email,
        subject:'!Bienvenido a ColproMarket',
        templateFile:'welcome.ejs',
        data:{
          userName:response.user.name,
          dashboardLink:"https://backend-proyectofinal-vrso.onrender.com/userProfile",
          currentYear:2025
        }
      })
    }

    store.showRegister = false;
    store.showRegisterDialog = false

    console.log(response);
    Dialog('closeRegister');

  }catch (error) {
    console.log(error.message);
  }
}


async function login() {
  try {
    loading.value = true
    const response = await postData("users/login",{
      user:user.value.email,
      password:String(user.value.password)
    })

    store.save_Token(response.data.token)
    if(response.data.user.role === 0){
      router.push('/admin')
      showNotification('positive', `Hola ${response.data.user.name} ¡Bienvenido al panel de administración! Gestiona la tienda y las ventas.`)
    }else{
    showNotification('positive', `Bienvenido/a ${response.data.user.name} Explora nuestra amplia selección de electrodomésticos`)
    }
    user.value = {}
    await getUserInformation()
  } catch (error) {
    showNotification('negative', 'Inicio de sesion fallido')
    user.value = {}
    console.log(error);
  }
  finally{
    loading.value = false
    store.showLoginDialog = false
  }
}

async function getUserInformation(){
  try {
    const response = await getData(`/users/${store.userId}`)
    store.userInformation = response.user
    console.log("informacion de usuario encontrada", store.userInformation);
  } catch (error) {
    console.error('error getting user information',error)
    store.userInformation = false
  }
}



const handlePasswordRecovery = () => {
  // Cierra el modal
  store.showLoginDialog = false;
  
  // Pequeño delay para asegurar que el modal se cierre antes de la navegación
  setTimeout(() => {
    router.push('/password')
      .then(() => console.log('Redirección exitosa a /password'))
      .catch(err => {
        console.error('Error en redirección:', err);
        // Fallback por si hay error en la navegación programática
        window.location.href = '/password';
      });
  }, 100);
};

// Funcion para abrir modales en modales
const toggleAuthModals = () => {
  store.showLoginDialog = !store.showLoginDialog;
  store.showRegisterDialog = !store.showRegisterDialog;
};



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