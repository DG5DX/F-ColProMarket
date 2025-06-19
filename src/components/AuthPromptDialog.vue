<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin auth-dialog-card">
      <q-card-section class="q-pb-none">
        <div class="row justify-end">
          <q-btn 
            flat 
            round 
            dense 
            icon="close" 
            class="close-btn"
            @click="onActionClick('cancel')" 
          />
        </div>
        <div class="text-h6 text-center text-primary-color">{{ title }}</div>
      </q-card-section>

      <q-card-section class="q-pt-sm text-center text-secondary-color">
        {{ message }}
        <div class="auth-links q-mt-md">
          <span 
            class="register-link"
            @click="onActionClick('register')"
          >Regístrate</span>
          <span class="text-secondary-color">. Si ya eres miembro, </span>
          <span 
            class="login-link"
            @click="onActionClick('login')"
          >ingresa aquí</span>
          <span class="text-secondary-color">!</span>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent } from 'quasar';

const emit = defineEmits();
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
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  max-width: 400px;
  width: 100%;
  margin: auto;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
}

.auth-dialog-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--five-color--), var(--cambio--));
}

.auth-dialog-card .text-primary-color {
  color: var(--text-primary);
  font-weight: 700;
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

.auth-dialog-card .text-secondary-color {
  color: var(--text-secondary);
  line-height: 1.6;
  font-size: 0.95rem;
}

.close-btn {
  color: var(--text-secondary);
  transition: transform 0.2s ease, color 0.2s ease;
  font-size: 1.2rem;
}

.close-btn:hover {
  color: var(--text-primary);
  transform: scale(1.1);
}

.auth-links {
  display: inline-block;
  margin-top: 1rem;
}

.register-link, .login-link {
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  padding: 0.1rem 0.2rem;
}

.register-link {
  color: var(--five-color--);
}

.register-link:hover {
  color: var(--primary-button-hover);
  text-decoration: none;
}

.register-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--primary-button-hover);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.register-link:hover::after {
  transform: scaleX(1);
}

.login-link {
  color: var(--cambio--);
}

.login-link:hover {
  color: #7d6ab6;
  text-decoration: none;
}

.login-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background: #7d6ab6;
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.login-link:hover::after {
  transform: scaleX(1);
}
</style>