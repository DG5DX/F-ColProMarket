<template>
  <q-layout>
    <q-page-container>
      <q-header elevated class="checkout-header bg-primary text-white">
        <q-toolbar>
          <q-toolbar-title class="text-h5">
            <q-avatar circle size="sm" @click="router.push('/')" class="cursor-pointer">
              <img src="../assets/MiniLogo.jpeg">
            </q-avatar>
            Colpromarket
          </q-toolbar-title>
        </q-toolbar>
      </q-header>

      <q-page class="checkout-page q-pa-md">
        <q-stepper v-model="step" animated keep-alive flat header-nav class="full-width no-box-shadow" color="primary"
          active-color="primary" done-color="green">
          <q-step :name="1" title="Carrito" icon="shopping_cart" :done="step > 1">
            <div class="row q-col-gutter-lg">
              <div class="col-12">
                <q-card class="order-summary-card">
                  <q-card-section>
                    <div class="text-h5 q-mb-md">
                      <q-icon name="shopping_bag" class="q-mr-sm" />
                      Tu pedido #{{ 2131 }}
                    </div>

                    <q-list bordered separator>
                      <q-item v-for="(item, index) in cartDetails.items" :key="index" class="q-pa-none">
                        <q-item-section avatar>
                          <q-img :src="item.images[0]?.urlImage" :ratio="1" width="80px" class="rounded-borders" />
                        </q-item-section>

                        <q-item-section>
                          <q-item-label class="text-weight-bold">{{ item.name }}</q-item-label>
                          <q-item-label caption>
                            <div v-for="(value, key) in item.details" :key="key" class="text-caption">
                              {{ key }}: {{ value }}
                            </div>
                          </q-item-label>
                        </q-item-section>

                        <q-item-section side>
                          <div class="text-right">
                            <div class="text-body1">{{ formatPrice(item.price) }}</div>
                            <div class="text-caption">x {{ item.quantity }}</div>
                          </div>
                        </q-item-section>
                      </q-item>
                    </q-list>


                    <div class="order-totals q-mt-lg">
                      <div class="row items-center q-py-sm">
                        <div class="col text-grey-7">Subtotal:</div>
                        <div class="col text-right">{{ formatPrice(cartDetails.subtotal) }}</div>
                      </div>

                      <div class="row items-center q-py-sm">
                        <div class="col text-grey-7">Descuento:</div>
                        <div class="col text-right text-negative">-{{ formatPrice(cartDetails.discount) }}</div>
                      </div>

                      <q-separator class="q-my-sm" />

                      <div class="row items-center q-py-sm">
                        <div class="col text-h6">Total:</div>
                        <div class="col text-right text-h6 text-primary">
                          {{ formatPrice(cartDetails.total) }}
                        </div>
                      </div>
                    </div>
                  </q-card-section>
                </q-card>

                <q-card class="q-mt-md guarantee-card">
                  <q-card-section horizontal>
                    <q-card-section class="bg-yellow-1 text-center flex flex-center">
                      <q-icon name="verified" size="xl" color="positive" />
                    </q-card-section>
                    <q-card-section>
                      <div class="text-h6">Garantía de satisfacción</div>
                      <div class="text-caption">30 días para probar nuestros productos. Si no estás satisfecho, te
                        devolvemos tu dinero.
                      </div>
                    </q-card-section>
                  </q-card-section>
                </q-card>
              </div>
            </div>

            <q-stepper-navigation>
              <q-btn @click="step = 2" color="primary" label="Siguiente" />
            </q-stepper-navigation>
          </q-step>

          <q-step :name="2" title="Información" icon="person" :done="step > 2">
            <q-card class="user-info-card">
              <q-card-section>
                <div class="text-h5 q-mb-md">
                  <q-icon name="person" class="q-mr-sm" />
                  Tu Información Personal
                </div>
                <q-list bordered separator>
                  <q-item>
                    <q-item-section>
                      <q-item-label caption>Nombre Completo</q-item-label>
                      <q-item-label>{{ userInformation.name }} {{ userInformation.lastName }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label caption>Correo Electrónico</q-item-label>
                      <q-item-label>{{ userInformation.email }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label caption>Teléfono</q-item-label>
                      <q-item-label>{{ userInformation.phone }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label caption>Género</q-item-label>
                      <q-item-label>{{ userInformation.gender }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label caption>Fecha de Nacimiento</q-item-label>
                      <q-item-label>{{ userInformation.dateOfBirth || 'No especificada' }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>

                <div class="text-h6 q-mt-lg q-mb-md">
                  <q-icon name="apartment" class="q-mr-sm" />
                  Dirección de Envío
                </div>
                <q-list bordered separator>
                  <q-item>
                    <q-item-section>
                      <q-item-label caption>Calle</q-item-label>
                      <q-item-label>{{ userInformation.shippingAddress?.street || 'No especificada' }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label caption>Ciudad</q-item-label>
                      <q-item-label>{{ userInformation.shippingAddress?.city || 'No especificada' }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label caption>Departamento/Estado</q-item-label>
                      <q-item-label>{{ userInformation.shippingAddress?.state || 'No especificado' }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label caption>País</q-item-label>
                      <q-item-label>{{ userInformation.shippingAddress?.country || 'No especificado' }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label caption>Código Postal</q-item-label>
                      <q-item-label>{{ userInformation.shippingAddress?.zipCode || 'N/A' }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>

            <q-stepper-navigation>
              <q-btn flat @click="step = 1" color="primary" label="Atrás" class="q-ml-sm" />
              <q-btn @click="validateUserData(store.userInformation)" color="primary" label="Siguiente" />
            </q-stepper-navigation>
          </q-step>

          <q-step :name="3" title="Pago" icon="credit_card" :done="step > 3">
            <q-card class="payment-methods-card">
              <q-card-section>
                <div class="text-h5 q-mb-md">
                  <q-icon name="credit_card" class="q-mr-sm" />
                  Método de pago
                </div>

                <q-option-group v-model="paymentMethod" :options="paymentOptions" type="radio" inline class="q-mb-md" />

                <div class="paypal-container q-mt-lg">
                  <div ref="paypalRef" class="paypal-button"></div>
                  <div class="text-caption text-center q-mt-sm">
                    <q-icon name="lock" color="positive" />
                    Pago seguro con encriptación SSL
                  </div>
                </div>

                <q-card class="support-card q-mt-md">
                  <q-card-section>
                    <div class="text-h6">
                      <q-icon name="help" class="q-mr-sm" />
                      ¿Necesitas ayuda?
                    </div>
                    <div class="q-mt-sm">
                      <q-icon name="email" size="sm" class="q-mr-xs" />
                      soporte@academiaonline.com
                    </div>
                    <div>
                      <q-icon name="schedule" size="sm" class="q-mr-xs" />
                      L-V de 9:00 a 18:00
                    </div>
                  </q-card-section>
                </q-card>
              </q-card-section>
            </q-card>

            <q-stepper-navigation>
              <q-btn flat @click="step = 2" color="primary" label="Atrás" class="q-ml-sm" />
            </q-stepper-navigation>
          </q-step>

          <q-step :name="4" title="Confirmación" icon="check_circle">
            <div class="q-pa-md text-center">
              <q-icon name="check_circle" size="xl" color="positive" class="q-mb-md" />
              <div class="text-h5 q-mb-md">¡Tu pedido ha sido procesado con éxito!</div>
              <p class="text-grey-7">Recibirás una confirmación por correo electrónico con los detalles de tu compra.
              </p>
              <q-btn color="primary" label="Volver a la tienda" @click="router.push('/')" class="q-mt-lg" />
            </div>
            <q-stepper-navigation>
              <q-btn flat @click="step = 3" color="primary" label="Atrás" class="q-ml-sm" />
            </q-stepper-navigation>
          </q-step>
        </q-stepper>
      </q-page>

      <q-footer elevated class="checkout-footer bg-grey-9 text-white">
        <q-toolbar>
          <q-toolbar-title class="text-center">
            <div class="footer-links">
              <a href="#" class="text-white q-mx-sm">Términos y condiciones</a>
              <a href="#" class="text-white q-mx-sm">Política de privacidad</a>
              <a href="#" class="text-white q-mx-sm">Reembolsos</a>
            </div>
            <div class="copyright q-mt-sm">
              © 2023 Academia Online. Todos los derechos reservados.
            </div>
          </q-toolbar-title>
        </q-toolbar>
      </q-footer>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, toRaw, watch } from 'vue'
import { useStore } from '../stores/store.js';
import { Notify } from 'quasar';
import { postData, putData } from '../service/service.js';
import { showNotification, showNotification2 } from '../utils/utils.js';
import { router } from '../routes/routes.js'; // Asegúrate de que esta importación sea correcta

const paypalRef = ref(null)
const store = useStore()
// userInformation se obtiene directamente del store
const userInformation = store.userInformation;
const cartDetails = ref(store.cart);

const step = ref(1); // Inicia en el primer paso (Carrito)
const couponCode = ref('');
const paymentMethod = ref('paypal');
const paymentOptions = [
  {
    label: 'PayPal',
    value: 'paypal',
    icon: 'fab fa-paypal'
  },
  {
    label: 'Tarjeta de crédito',
    value: 'credit_card',
    icon: 'credit_card'
  }
];


function validateUserData(userData) {
  const missingFields = [];
  let isValid = true;

  const emptyIndicators = new Set(['', 'no especificado', 'n/a']);

  const requiredUserFields = [
    'name',
    'email',
    'lastName',
    'phone',
    'gender',
  ];

  requiredUserFields.forEach(field => {
    const fieldValue = typeof userData[field] === 'string' ? userData[field].trim().toLowerCase() : userData[field];

    if (fieldValue === null || emptyIndicators.has(fieldValue)) {
      missingFields.push(field);
      isValid = false;
    }
  });

  if (userData.dateOfBirth === null) {
      missingFields.push('dateOfBirth');
      isValid = false;
  }

  if (!userData.shippingAddress || typeof userData.shippingAddress !== 'object' || Object.keys(userData.shippingAddress).length === 0) {
    missingFields.push('shippingAddress');
    isValid = false;
  } else {
    const requiredShippingFields = [
      'street',
      'city',
      'state',
      'zipCode',
      'country'
    ];

    requiredShippingFields.forEach(field => {
      const fieldValue = typeof userData.shippingAddress[field] === 'string' ? userData.shippingAddress[field].trim().toLowerCase() : userData.shippingAddress[field];

      if (fieldValue === null || emptyIndicators.has(fieldValue)) {
        missingFields.push(`shippingAddress.${field}`);
        isValid = false;
      }
    });
  }

  if (!isValid) {
    return showNotification2(
      'Informacion de usuario incompleta',
      'Para poder seguir adelante con tu compra debes completar tu informacion personal 😁',
      'warning',
      () => { router.replace('/userProfile') }
    );
  }

  step.value = 3;
  return { isValid, missingFields };
}


const formatPrice = (price) => {
  if (!price) return '$0';
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(price);
};


const paymentDetails = ref({
  userId: store.userId,
  products: cartDetails.value.items,
  paypalData: {},
  total: cartDetails.value.total
})

const paymentValues = ref({}); // Inicializa paymentValues
const formatItems = ref([]); // Inicializa formatItems

const renderPayPalButton = () => {
  // Solo intenta renderizar si paypalRef.value existe y el script de PayPal está cargado
  if (!window.paypal || !window.paypal.Buttons || !paypalRef.value) {
    // Si no está listo, reintenta después de un breve retraso
    setTimeout(renderPayPalButton, 250);
    return;
  }

  // Limpiar cualquier botón existente para evitar duplicados en re-renderizados
  if (paypalRef.value.innerHTML !== '') {
    paypalRef.value.innerHTML = '';
  }

  window.paypal.Buttons({
    createOrder: (data, actions) => {
      return actions.order.create({
        purchase_units: [{
          amount: {
            value: String(paymentValues.value.amount),
            currency_code: 'USD',
            breakdown: {
              item_total: { value: String(paymentValues.value.subTotal), currency_code: 'USD' },
              discount: { value: String(paymentValues.value.discount), currency_code: 'USD' }
            }
          },
          items: formatItems.value // Asegúrate de que `formatItems` esté correctamente formateado para PayPal
        }]
      })
    },
    onApprove: async (data, actions) => {

      const paymentId = await savePendingPayment()
      const details = await actions.order.capture()

      if (details.status === 'COMPLETED') {
        paymentDetails.value.paypalData = details;
        await updatePayment(paymentId, 'paid');
        step.value = 4; // Mover al paso de confirmación al éxito del pago
      } else {
        await updatePayment(paymentId, 'canceled');
        return showNotification('negative', 'Error al pagar, intenta nuevamente')
      }

      console.log("detalles de pago", toRaw(paymentDetails.value.paypalData));

      return Notify.create({
        type: 'positive',
        message: `Pago completado por: ${details.payer.name.given_name}`
      })

    },
    onError: (err) => {
      console.error('Error en PayPal:', err)
      showNotification('negative', 'Error al procesar pago con PayPal.')
    },
    style: {
      layout: 'vertical',
      color: 'blue',
      shape: 'rect',
      label: 'paypal',
      tagline: false
    }
  }).render(paypalRef.value)
}

async function savePendingPayment() {
  try {
    const response = await postData("/orders", {
      data: paymentDetails.value
    })
    console.log("Datos de pago pendiente guardado", response.data);
    return response.data._id
  } catch (error) {
    showNotification('negative', 'Error al procesar pago')
    console.log("Error en pagos:", error);
  }
}

async function updatePayment(id, status) {
  try {
    paymentDetails.value.status = status
    const response = await putData(`/orders/${id}`, {
      data: paymentDetails.value
    })
  } catch (error) {
    console.log('error actualizando pago pendiente', error);
  }
}

async function convertCurrency() {
  try {
    // Por el momento el descuento es estático, luego cuando se complete la lógica de ofertas hay que arreglarlo
    const response = await postData(`/orders/convertCurrency`, {
      discount: cartDetails.value.discount,
      items: toRaw(cartDetails.value.items)
    })
    paymentValues.value = response.data
    console.log('valores de pago', toRaw(paymentValues.value));

  } catch (error) {
    console.log('error al convertir valores', error);
  }
}

function formatProducts() {
  if (cartDetails.value.items && cartDetails.value.items.length > 0) {
    formatItems.value = cartDetails.value.items.map((product) => {
      const unitPriceInDollars = (product.price / 3900).toFixed(2); // Asumiendo una tasa de conversión COP a USD
      return {
        name: product.name,
        unit_amount: { value: unitPriceInDollars, currency_code: 'USD' },
        quantity: product.quantity
      };
    });
  } else {
    Notify.create({
      type: 'negative',
      message: 'No hay datos del carrito'
    });
  }
  console.log("datos de items formateados", toRaw(formatItems.value));
}

// Observa cambios en el `step` para renderizar el botón de PayPal cuando sea necesario
watch(step, (newStep) => {
  if (newStep === 3) {
    // Intenta renderizar el botón de PayPal solo cuando se esté en el paso de pago
    if (window.paypal && window.paypal.Buttons) {
      renderPayPalButton();
    } else {
      // Si el script de PayPal aún no se ha cargado, lo inyecta y luego renderiza
      const script = document.createElement('script');
      // **IMPORTANTE**: Reemplaza 'YOUR_PAYPAL_CLIENT_ID' con tu ID de cliente real de PayPal
      script.src = `https://www.paypal.com/sdk/js?client-id=YOUR_PAYPAL_CLIENT_ID&currency=USD`;
      script.onload = renderPayPalButton;
      document.head.appendChild(script);
    }
  }
});

onMounted(() => {
  formatProducts()
  convertCurrency()
  console.log("datos del carrito en pagos", toRaw(cartDetails.value));
  console.log("Información del usuario:", toRaw(userInformation));
})
</script>

<style scoped>
/* Importa tus estilos existentes */
@import url("../style/paymentGateway.css");

/* Nuevos estilos o ajustes para el stepper y la información del usuario */

/* Ajustes generales para el stepper */
.checkout-page .q-stepper {
  background: none;
  /* Hace el fondo del stepper transparente */
  box-shadow: none;
  /* Elimina la sombra del stepper */
}

/* Espacio entre el encabezado del stepper y el contenido del paso */
.checkout-page .q-stepper__header {
  margin-bottom: 24px;
}

/* Tarjeta para la información del usuario */
.user-info-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
}

/* Asegura un espaciado y alineación adecuados para las listas en la tarjeta de información */
.user-info-card .q-list .q-item {
  padding: 12px 16px;
}

.user-info-card .q-item-label.caption {
  font-weight: 500;
  color: #757575;
  /* Color de texto más oscuro para los labels de caption */
}

/* Ajusta los márgenes para los títulos dentro de las secciones */
.user-info-card .text-h5,
.user-info-card .text-h6 {
  margin-top: 16px;
  margin-bottom: 12px;
}

/* Ajusta el padding/margen de las tarjetas dentro de los pasos del stepper */
.q-step>div:not(.q-stepper-navigation) {
  padding-top: 16px;
  padding-bottom: 16px;
}

/* Espaciado de los botones de navegación del stepper */
.q-stepper-navigation .q-btn {
  margin-right: 8px;
  /* Espacio entre botones */
}

/* Resaltar colores de totales */
.order-totals .text-negative {
  color: #e53935 !important;
  /* Rojo Material Design */
}

.order-totals .text-primary {
  color: var(--q-primary) !important;
  /* Usa la variable de color primario de Quasar */
}

/* Ajustes para imágenes de productos en el carrito */
.q-item-section.avatar .q-img {
  margin-right: 16px;
  /* Espacio entre la imagen y el texto */
}

/* Asegura que los detalles del producto en el carrito se vean bien */
.q-item-label.caption .text-caption {
  line-height: 1.3;
}
</style>