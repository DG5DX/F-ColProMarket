<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex flex-center bg-grey-2">
        <q-card style="width: 150vh;">
          <q-card-section class="bg-primary text-white">
            <div class="text-h6 text-center">Verificación por Teléfono</div>
          </q-card-section>

          <q-card-section class="q-pt-md">
            <q-stepper
              v-model="step"
              animated
              flat
              class="no-padding"
            >
              <q-step
                :name="1"
                title="Ingresar Teléfono"
                icon="mdi-phone"
                :done="step > 1"
                :header-nav="step > 1"
              >
                <div class="q-mb-md">
                  Por favor, ingresa tu número de teléfono para recibir un código de verificación por SMS.
                </div>
                
                <q-input
                  v-model="phoneNumber"
                  label="Número de Teléfono (ej: +573101234567)"
                  outlined
                  dense
                  type="tel"
                  class="q-mb-md"
                  :rules="[val => (val && val.length > 0 && val.startsWith('+')) || 'Formato: +CódigoPaísNúmero']"
                />

                <div id="recaptcha-container" class="q-mt-md flex flex-center"></div>

                <q-stepper-navigation>
                  <q-btn
                    @click="sendVerificationCode"
                    color="primary"
                    label="Enviar Código SMS"
                    :disable="!phoneNumber || !recaptchaRendered || loading"
                    :loading="loading"
                  />
                </q-stepper-navigation>
              </q-step>

              <q-step
                :name="2"
                title="Ingresar Código"
                icon="mdi-numeric"
                :done="step > 2"
                :header-nav="step > 2"
              >
                <div class="q-mb-md">
                  Hemos enviado un código de verificación de 6 dígitos a tu número de teléfono. Por favor, ingrésalo a continuación.
                </div>
                <q-input
                  v-model="verificationCode"
                  label="Código de Verificación"
                  outlined
                  dense
                  type="text"
                  input-class="text-center"
                  maxlength="6"
                  :rules="[val => (val && val.length === 6) || 'El código debe tener 6 dígitos']"
                />

                <q-stepper-navigation class="row q-gutter-sm">
                  <q-btn
                    @click="verifyCode"
                    color="primary"
                    label="Verificar Código"
                    :disable="!verificationCode || verificationCode.length !== 6 || loading"
                    :loading="loading"
                  />
                  <q-btn
                    flat
                    @click="goToStep1"
                    color="primary"
                    label="Regresar"
                    class="q-ml-sm"
                    :disable="loading"
                  />
                  <q-btn
                    flat
                    @click="resendCode"
                    color="info"
                    label="Reenviar Código"
                    class="q-ml-sm"
                    :disable="loading"
                  />
                </q-stepper-navigation>
              </q-step>

              <q-step
                :name="3"
                title="Verificación Exitosa"
                icon="mdi-check-circle-outline"
                :header-nav="false"
              >
                <div class="q-mb-md text-center text-h6 text-positive">
                  ¡Tu número de teléfono ha sido verificado con éxito!
                </div>
                <div class="q-mb-md text-center">
                  Puedes continuar con el proceso de tu aplicación.
                </div>
                <q-stepper-navigation>
                  <q-btn
                    @click="step = 4"
                    color="primary"
                    label="Continuar"
                    class="full-width"
                  />
                </q-stepper-navigation>
              </q-step>

              <q-step
                :name="4"
                title="Establecer contraseña"
                icon="mdi-check-circle-outline"
                :header-nav="false"
              >
                <div class="q-mb-md text-center text-h6 text-positive">
                  Aqui podras crear tu nueva contraseña
                </div>
                <div class="q-mb-md text-center">


                <p>{{ userEmailFound }}</p>

                  <q-input
                  v-model="infoNewPassword.newPassword"
                  label="Nueva contraseña"
                  outlined
                  dense
                  type="text"
                  input-class="text-center"
                  maxlength="8"
                  :rules="[val => (val && val.length >= 8) || 'La contraseña debe tener al menos 8 caracteres']"
                />

                <q-input
                  v-model="infoNewPassword.confirmPassword"
                  label="Confirmar contraseña"
                  outlined
                  dense
                  type="text"
                  input-class="text-center"
                  maxlength="8"
                  :rules="[val => (val && val.length >= 8) || 'La contraseña debe tener al menos 8 caracteres']"
                />

                </div>
                <q-stepper-navigation>
                  <q-btn
                  :loading="passwordLoading"
                    @click="updatePassword"
                    color="primary"
                    label="Guardar"
                    class="full-width"
                  />
                </q-stepper-navigation>
              </q-step>


              <q-step
                :name="5"
                title="Actualización Exitosa"
                icon="mdi-check-circle-outline"
                :header-nav="false"
              >
                <div class="q-mb-md text-center text-h6 text-positive">
                  ¡Tu Contraseña ha sido actualizadacon éxito!
                </div>
                <div class="q-mb-md text-center">
                Ahora puedes iniciar sesion .
                </div>
                <q-stepper-navigation>
                  <q-btn
                    @click="router.push('/'); store.showLoginDialog = true"
                    color="primary"
                    label="Iniciar Sesion"
                    class="full-width"
                  />
                </q-stepper-navigation>
              </q-step>

              
            </q-stepper>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue';
import { useQuasar } from 'quasar';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'; // Solo importamos lo necesario para SMS
import { useRouter } from 'vue-router';
import { showNotification } from '../utils/utils';
import { getData, putData } from '../service/service';
import { useStore } from '../stores/store';
const store = useStore();

const $q = useQuasar();
const router = useRouter();

//contraseñas
const passwordLoading = ref(false);
const infoNewPassword = ref({
  email:null,
  newPassword:null,
  confirmPassword:null
})

const userEmailFound = ref({})



async function updatePassword() {
  try {
    passwordLoading.value = true;
    if(infoNewPassword.value.newPassword !== infoNewPassword.value.confirmPassword){
      return showNotification('warning','Las contraseñas deben ser iguales')
    }
    const response = await putData('/users/password',{
      email:userEmailFound.value,
      password : infoNewPassword.value.confirmPassword 
    }) 
    if(response.success){
    step.value = 5
    }
  } catch (error) {
    console.log(error);
    showNotification('negative','La operacion fallo')
  }
  finally{
    passwordLoading.value = false
  }
}

// Inyecta la instancia de Firebase Auth que proporcionaste en main.js
const firebaseAuth = inject('firebaseAuth');

// --- Variables de estado del componente ---
const step = ref(1);
const phoneNumber = ref('');
const verificationCode = ref('');
const loading = ref(false);
const recaptchaRendered = ref(false); // Para saber si reCAPTCHA ya se renderizó

let recaptchaVerifier; // Variable para la instancia del reCAPTCHA
let confirmationResult; // Variable para almacenar el resultado de la confirmación (para SMS)

// --- Lógica de inicialización de reCAPTCHA ---
const initializeRecaptcha = () => {
  // Solo inicializa si firebaseAuth está disponible y no se ha inicializado antes
  if (firebaseAuth && !recaptchaVerifier) { 
    recaptchaVerifier = new RecaptchaVerifier(firebaseAuth, 'recaptcha-container', {
      'size': 'normal', // 'normal' o 'invisible'. 'normal' es más fácil de depurar.
      'callback': (response) => {
        recaptchaRendered.value = true;
      },
      'expired-callback': () => {
        console.warn('reCAPTCHA expirado.');
        showNotification('warning','reCAPTCHA expirado, por favor inténtalo de nuevo.')
        recaptchaRendered.value = false;
        if (recaptchaVerifier) { // Asegúrate de que recaptchaVerifier exista antes de intentar resetear
            recaptchaVerifier.render().then(function(widgetId) {
                grecaptcha.reset(widgetId);
            });
        }
      }
    });
    // Renderiza el reCAPTCHA al cargar el componente
    recaptchaVerifier.render().then(() => {
        recaptchaRendered.value = true;
    });
  } else if (recaptchaVerifier) {
      // Si ya existe, asegúrate de que esté visible y resetéalo por si acaso
      recaptchaVerifier.render().then(() => {
        recaptchaRendered.value = true;
      });
  }
};

// --- Lifecycle Hook: onMounted ---
onMounted(() => {
  // Inicializar reCAPTCHA cuando el componente se monta.
  // Esto asegura que el contenedor 'recaptcha-container' ya esté en el DOM.
  initializeRecaptcha();
});


// --- Métodos del Stepper y Verificación ---

const sendVerificationCode = async () => {
  loading.value = true;
  
  if (!phoneNumber.value || !phoneNumber.value.startsWith('+')) {
    $q.notify({ type: 'negative', message: 'Por favor, ingresa un número de teléfono válido con código de país (ej. +57...).' });
    loading.value = false;
    return;
  }
  if (!recaptchaVerifier || !recaptchaRendered.value) {
      $q.notify({ type: 'negative', message: 'reCAPTCHA no está listo. Por favor, espera.' });
      loading.value = false;
      return;
  }

  try {
    const userFound = await getData(`/users/check-phone/${phoneNumber.value}`)
    userEmailFound.value = userFound.email

    confirmationResult = await signInWithPhoneNumber(firebaseAuth, phoneNumber.value, recaptchaVerifier);
    $q.notify({
      color: 'positive',
      message: 'Código de verificación enviado por SMS.',
      icon: 'mdi-check-circle'
    });
    step.value = 2; // Avanza al paso de ingresar código
  } catch (error) {

    console.error("Error al enviar código SMS:", error);
    let errorMessage = `Error al enviar SMS: ${error.message}`;
    if (error.code === 'auth/invalid-phone-number') {
        errorMessage = 'El número de teléfono no es válido. Asegúrate de usar el formato internacional.';
    } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Hemos bloqueado todas las solicitudes de este dispositivo debido a actividad inusual. Intenta de nuevo más tarde.';
    } else if (error.code === 'auth/captcha-check-failed') {
        errorMessage = 'La verificación reCAPTCHA falló. Intenta de nuevo.';
    }else if (error.status === 404){
      return showNotification('negative','No hay una cuenta asociada a este numero')
    }
    $q.notify({
      color: 'negative',
      message: errorMessage,
      icon: 'mdi-alert'
    });
    
    // Reiniciar reCAPTCHA en caso de errores específicos
    if (recaptchaVerifier) {
      recaptchaVerifier.render().then(function(widgetId) {
          grecaptcha.reset(widgetId);
      });
    }
  } finally {
    loading.value = false;
  }
};

const verifyCode = async () => {
  loading.value = true;
  
  if (!confirmationResult) {
    $q.notify({ type: 'negative', message: 'Primero, por favor envía un código de verificación.' });
    loading.value = false;
    return;
  }
  if (!verificationCode.value || verificationCode.value.length !== 6) {
    $q.notify({ type: 'negative', message: 'Por favor, ingresa el código completo de 6 dígitos.' });
    loading.value = false;
    return;
  }

  try {
    const userCredential = await confirmationResult.confirm(verificationCode.value);
    console.log("SMS Verificación Exitosa:", userCredential.user);
    $q.notify({
      color: 'positive',
      message: 'Código SMS verificado correctamente.',
      icon: 'mdi-check-circle'
    });
    step.value = 3; 
    
  } catch (error) {
    console.error("Error al verificar el código SMS:", error);
    let errorMessage = `Código SMS incorrecto o expirado: ${error.message}`;
    if (error.code === 'auth/invalid-verification-code') {
        errorMessage = 'El código ingresado es incorrecto. Por favor, verifica e intenta de nuevo.';
    } else if (error.code === 'auth/code-expired') {
        errorMessage = 'El código ha expirado. Por favor, reenvía el código.';
    }
    $q.notify({
      color: 'negative',
      message: errorMessage,
      icon: 'mdi-alert'
    });
  } finally {
    loading.value = false;
  }
};

const resendCode = async () => {
  loading.value = true;
  
  if (!phoneNumber.value || !phoneNumber.value.startsWith('+')) {
    $q.notify({ type: 'negative', message: 'Número de teléfono no válido para reenviar.' });
    loading.value = false;
    return;
  }
  if (!recaptchaVerifier) {
      $q.notify({ type: 'negative', message: 'El sistema de verificación no está listo.' });
      loading.value = false;
      return;
  }

  try {
    // Reintentar el envío del SMS. Firebase maneja las tasas y la expiración.
    // Es buena práctica resetear el reCAPTCHA para un nuevo intento de envío
    if (recaptchaVerifier) {
        recaptchaVerifier.render().then(function(widgetId) {
            grecaptcha.reset(widgetId);
        });
        recaptchaRendered.value = false; // El reCAPTCHA debe resolverse de nuevo
    }

    confirmationResult = await signInWithPhoneNumber(firebaseAuth, phoneNumber.value, recaptchaVerifier);
    $q.notify({
      color: 'info',
      message: 'Se ha reenviado un nuevo código por SMS. Revisa tu teléfono.',
      icon: 'mdi-send'
    });
    // Limpiar el campo del código anterior
    verificationCode.value = '';
    // No cambiamos de paso, ya estamos en el paso 2
  } catch (error) {
    console.error("Error al reenviar código SMS:", error);
    let errorMessage = `Error al reenviar SMS: ${error.message}`;
    if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Demasiadas solicitudes de reenvío. Espera un momento antes de intentar de nuevo.';
    } else if (error.code === 'auth/captcha-check-failed') {
        errorMessage = 'La verificación reCAPTCHA falló. Intenta de nuevo.';
    }
    $q.notify({
      color: 'negative',
      message: errorMessage,
      icon: 'mdi-alert'
    });
    // En caso de error, resetea reCAPTCHA de nuevo
    if (recaptchaVerifier) {
      recaptchaVerifier.render().then(function(widgetId) {
          grecaptcha.reset(widgetId);
      });
    }
  } finally {
    loading.value = false;
  }
};

// --- Funciones de navegación del stepper ---
const goToStep1 = () => {
    step.value = 1;
    // Limpiar campos y resetear reCAPTCHA al volver al paso 1
    phoneNumber.value = '';
    verificationCode.value = '';
    recaptchaRendered.value = false; // El reCAPTCHA deberá resolverse de nuevo
    if (recaptchaVerifier) {
        recaptchaVerifier.render().then(function(widgetId) {
            grecaptcha.reset(widgetId);
        });
    }
};
</script>

<style scoped>
/* Asegúrate de que el contenedor reCAPTCHA tenga un tamaño adecuado si usas 'normal' */
#recaptcha-container {
  min-height: 78px; /* Altura estándar para el widget 'normal' */
  margin-top: 16px; /* Espacio superior */
}
/* Estilos adicionales si los tienes */
.my_card {
  /* Reemplazado con width: 80vh para que se vea bien en varios tamaños de pantalla */
  width: 80vh; 
  max-width: 500px; /* Un máximo para que no sea demasiado ancho en pantallas grandes */
}
</style>