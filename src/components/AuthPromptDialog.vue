<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin auth-dialog-card">
      <q-card-section class="q-pb-none">
        <div class="text-h6 text-center text-primary-color">{{ title }}</div>
      </q-card-section>

      <q-card-section class="q-pt-sm text-center text-secondary-color">
        {{ message }}
      </q-card-section>

      <q-card-actions align="center" class="q-pt-md q-pb-lg">
        <q-btn
          label="Registrarse"
          class="auth-btn register-btn"
          @click="onActionClick('register')"
        />
        <q-btn
          label="Ingresar"
          class="auth-btn login-btn"
          @click="onActionClick('login')"
        />
        <q-btn
          flat
          label="Cancelar"
          class="auth-btn cancel-btn"
          @click="onActionClick('cancel')"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent } from 'quasar';

// PASO 1: declara el emit sin destructuración inmediata
const emit = defineEmits();

// PASO 2: luego, llama al composable con el contexto ya disponible
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  }
});

const onActionClick = (action) => {
  if (action === 'register' || action === 'login') {
    onDialogOK({ action });
  } else {
    onDialogCancel();
  }
};
</script>

<style scoped>
.auth-dialog-card {
  background-color: var(--one-color--);
  box-shadow: var(--card-shadow);
  border-radius: 16px;
  max-width: 400px;
  margin: auto;
  padding: 1rem;
}

.auth-dialog-card .text-primary-color {
  color: var(--text-primary);
  font-weight: bold;
}

.auth-dialog-card .text-secondary-color {
  color: var(--text-secondary);
}

.auth-btn {
  min-width: 120px;
  border-radius: 10px;
  font-weight: 600;
  margin: 5px;
  transition: background-color 0.3s ease;
}

/* Botón Registrarse */
.register-btn {
  background: var(--five-color--);
  color: white;
}
.register-btn:hover {
  background: var(--primary-button-hover);
}

/* Botón Ingresar */
.login-btn {
  background-color: var(--cambio--);
  color: white;
}
.login-btn:hover {
  background-color: #7d6ab6;
}

/* Botón Cancelar */
.cancel-btn {
  color: var(--seven-color--);
}
.cancel-btn:hover {
  background-color: var(--menu-item-hover);
}

</style>
