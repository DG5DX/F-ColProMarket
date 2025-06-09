<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex flex-center bg-grey-2">
        <q-card style="width: 80vh;">
          <q-card-section class="bg-primary text-white">
            <div class="text-h6 text-center">Recuperar Contraseña</div>
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
                title="Verificar Cuenta"
                icon="mdi-account"
                :done="step > 1"
                :header-nav="step > 1"
              >
                <div class="q-mb-md">
                  Por favor, ingresa tu correo electrónico para verificar tu cuenta.
                </div>
                <q-input
                  v-model="email"
                  label="Correo Electrónico"
                  outlined
                  dense
                  type="email"
                  class="q-mb-md"
                  :rules="[val => (val && val.length > 0 && /.+@.+\..+/.test(val)) || 'Por favor, ingresa un correo válido']"
                />

                <div class="text-subtitle1 q-mb-sm">¿Cómo deseas recibir el código de verificación?</div>
                <q-option-group
                  v-model="verificationMethod"
                  :options="verificationOptions"
                  color="primary"
                  type="radio"
                  inline
                  class="q-mb-md"
                />

                <q-stepper-navigation>
                  <q-btn
                    @click="sendVerificationCode"
                    color="primary"
                    label="Enviar Código"
                    :disable="!email || !verificationMethod"
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
                  Hemos enviado un código de verificación a tu {{ verificationMethod === 'email' ? 'correo electrónico' : 'número de teléfono' }}. Por favor, ingrésalo a continuación.
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
                    :disable="!verificationCode || verificationCode.length !== 6"
                  />
                  <q-btn
                    flat
                    @click="step = 1"
                    color="primary"
                    label="Regresar"
                    class="q-ml-sm"
                  />
                  <q-btn
                    flat
                    @click="resendCode"
                    color="info"
                    label="Reenviar Código"
                    class="q-ml-sm"
                  />
                </q-stepper-navigation>
              </q-step>

              <q-step
                :name="3"
                title="Nueva Contraseña"
                icon="mdi-lock"
                :header-nav="false"
              >
                <div class="q-mb-md">
                  Ingresa tu nueva contraseña. Debe ser al menos de 8 caracteres.
                </div>
                <q-input
                  v-model="newPassword"
                  label="Nueva Contraseña"
                  outlined
                  dense
                  :type="showNewPassword ? 'text' : 'password'"
                  class="q-mb-sm"
                  :rules="[val => (val && val.length >= 8) || 'Mínimo 8 caracteres']"
                >
                  <template v-slot:append>
                    <q-icon
                      :name="showNewPassword ? 'mdi-eye-off' : 'mdi-eye'"
                      class="cursor-pointer"
                      @click="showNewPassword = !showNewPassword"
                    />
                  </template>
                </q-input>
                <q-input
                  v-model="confirmPassword"
                  label="Confirmar Contraseña"
                  outlined
                  dense
                  :type="showConfirmPassword ? 'text' : 'password'"
                  :rules="[
                    val => (val && val.length >= 8) || 'Mínimo 8 caracteres',
                    val => val === newPassword || 'Las contraseñas no coinciden'
                  ]"
                >
                  <template v-slot:append>
                    <q-icon
                      :name="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
                      class="cursor-pointer"
                      @click="showConfirmPassword = !showConfirmPassword"
                    />
                  </template>
                </q-input>

                <q-stepper-navigation>
                  <q-btn
                    @click="resetPassword"
                    color="primary"
                    label="Restablecer Contraseña"
                    :disable="!newPassword || !confirmPassword || newPassword !== confirmPassword || newPassword.length < 8"
                  />
                  <q-btn
                    flat
                    @click="step = 2"
                    color="primary"
                    label="Regresar"
                    class="q-ml-sm"
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

<script>
import { ref } from 'vue';
import { useQuasar } from 'quasar';

export default {
  setup() {
    const $q = useQuasar();

    const step = ref(1); // Controla el paso actual del stepper
    const email = ref('');
    const verificationMethod = ref(null); // 'email' o 'sms'
    const verificationCode = ref('');
    const newPassword = ref('');
    const confirmPassword = ref('');
    const showNewPassword = ref(false);
    const showConfirmPassword = ref(false);

    const verificationOptions = [
      { label: 'Correo Electrónico', value: 'email' },
      { label: 'SMS (Número de Teléfono)', value: 'sms' }
    ];

    const sendVerificationCode = () => {
      // Aquí iría la lógica real para enviar el código al backend
      // Simulación de envío exitoso:
      $q.notify({
        color: 'positive',
        message: `Código enviado a tu ${verificationMethod.value === 'email' ? 'correo electrónico' : 'número de teléfono'}.`,
        icon: 'mdi-check-circle'
      });
      step.value = 2; // Avanza al siguiente paso
      // En un caso real, aquí se llamaría a una API para enviar el código
    };

    const verifyCode = () => {
      // Aquí iría la lógica real para verificar el código con el backend
      // Simulación de verificación exitosa:
      if (verificationCode.value === '123456') { // Código de ejemplo
        $q.notify({
          color: 'positive',
          message: 'Código verificado correctamente.',
          icon: 'mdi-check-circle'
        });
        step.value = 3; // Avanza al paso de nueva contraseña
      } else {
        $q.notify({
          color: 'negative',
          message: 'Código incorrecto. Inténtalo de nuevo.',
          icon: 'mdi-alert'
        });
      }
      // En un caso real, aquí se llamaría a una API para verificar el código
    };

    const resendCode = () => {
      // Lógica para reenviar el código
      $q.notify({
        color: 'info',
        message: `Se ha reenviado el código a tu ${verificationMethod.value === 'email' ? 'correo electrónico' : 'número de teléfono'}.`,
        icon: 'mdi-send'
      });
      // En un caso real, aquí se llamaría a una API para reenviar el código
    };

    const resetPassword = () => {
      // Aquí iría la lógica real para restablecer la contraseña en el backend
      if (newPassword.value === confirmPassword.value) {
        $q.notify({
          color: 'positive',
          message: '¡Contraseña restablecida con éxito!',
          icon: 'mdi-lock-open'
        });
        // Aquí podrías redirigir al usuario a la página de inicio de sesión
        // router.push('/login'); // si estás usando Vue Router
      } else {
        $q.notify({
          color: 'negative',
          message: 'Las contraseñas no coinciden.',
          icon: 'mdi-alert'
        });
      }
      // En un caso real, aquí se llamaría a una API para restablecer la contraseña
    };

    return {
      step,
      email,
      verificationMethod,
      verificationOptions,
      verificationCode,
      newPassword,
      confirmPassword,
      showNewPassword,
      showConfirmPassword,
      sendVerificationCode,
      verifyCode,
      resendCode,
      resetPassword
    };
  }
};
</script>

<style scoped>
</style>