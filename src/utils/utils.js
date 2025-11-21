import { Notify, Dialog } from "quasar";
import { useStore } from "../stores/store";
import AuthPromptDialog from "../components/AuthPromptDialog.vue";
import { router } from "../routes/routes.js";

export function showNotification(type, message) {
    Notify.create({
        type: type,
        message: message,
    });
}

export function showNotification2(title, message, color, callback) {
    Dialog.create({
        title: title,
        message: message,
        cancel: true,
        persistent: true,
        color: color,
    }).onOk(() => {
        callback();
    });
}

export function reloadPage() {
    location.reload();
}

export function validateToken() {
    const store = useStore();
    console.log("validando token");

    return new Promise((resolve, reject) => {
        if (!store.token) {
            Dialog.create({
                component: AuthPromptDialog,
                componentProps: {
                    title: "Acceder a la Cuenta",
                    message:
                        "¿Aún no tienes cuenta?",
                },
            })
                .onOk((payload) => {
                    if (payload && payload.action === "register") {
                        store.showRegisterDialog = true;
                        console.log("Usuario eligió Registrarse");
                    } else if (payload && payload.action === "login") {
                        store.showLoginDialog = true;
                        console.log("Usuario eligió Ingresar");
                    }
                    resolve(false); // No continuar con agregar al carrito
                })
                .onCancel(() => {
                    console.log("Diálogo cancelado");
                    resolve(false); // No continuar
                });
        } else {
            resolve(true); // Continuar
        }
    });
}

export function scrollToTopInstant() {
  window.scrollTo(0, 0); // Desplaza a las coordenadas (0,0) de la página
  console.log("Desplazamiento instantáneo al inicio de la página.");
}

export function formatNum(value) {
  if (typeof value !== 'number') {
    console.error("Error: The provided value is not a number.");
    return String(value);
  }

  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });

  return formatter.format(value);
}

export function formatISODateToSpanish(dateString) {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    console.error("Error: Cadena de fecha inválida proporcionada:", dateString);
    return "Fecha inválida";
  }

  const options = {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  };

  return new Intl.DateTimeFormat('es-ES', options).format(date);
}