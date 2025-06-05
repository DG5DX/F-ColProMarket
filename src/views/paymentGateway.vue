<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="checkout-header">
      <q-toolbar>
        <q-toolbar-title class="flex items-center">
          <q-avatar circle size="md" @click="router.push('/')" class="cursor-pointer q-mr-sm">
            <img src="../assets/MiniLogo.jpeg" alt="Colpromarket Logo">
          </q-avatar>
          <span class="text-h6 text-white text-weight-bold">Colpromarket</span>
        </q-toolbar-title>

        <q-stepper v-model="step" header-nav inactive-color="white" active-color="yellow" done-color="green"
          class="no-box-shadow bg-transparent text-white desktop-stepper">
          <q-step :name="1" title="Carrito" icon="shopping_cart" :done="step > 1" />
          <q-step :name="2" title="Información" icon="person" :done="step > 2" />
          <q-step :name="3" title="Pago" icon="credit_card" active />
          <q-step :name="4" title="Confirmación" icon="check_circle" />
        </q-stepper>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page class="checkout-page q-pa-md">
        <div class="row q-col-gutter-lg justify-center">
          <div class="col-xs-12 col-md-7">
            <q-card class="order-summary-card shadow-10 rounded-borders">
              <q-card-section>
                <div class="text-h5 q-mb-md text-primary text-weight-bold">
                  <q-icon name="shopping_bag" class="q-mr-sm" />
                  Tu pedido
                </div>

                <q-list class="rounded-borders">
                  <q-item v-for="(item, index) in cartDetails.items" :key="index" class="q-py-md product-item-card">
                    <q-item-section avatar>
                      <q-img :src="item.images[0].urlImage" :ratio="1" width="90px"
                        class="rounded-borders product-thumbnail" />
                    </q-item-section>

                    <q-item-section>
                      <q-item-label class="text-weight-medium text-body1">{{ item.name }}</q-item-label>
                      <q-item-label caption>
                        <div v-for="(value, key) in item.details" :key="key" class="text-caption text-grey-7">
                          {{ key }}: {{ value }}
                        </div>
                      </q-item-label>
                      <q-item-label class="q-mt-sm">
                        <div class="product-quantity text-weight-medium">
                          Cantidad: {{ item.quantity }}
                        </div>
                      </q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <div class="product-price-display">
                        <span v-if="item.offer" class="display-original-price">
                          {{ formatPrice(item.price) }}
                        </span>
                        <span class="display-current-price">
                          {{ formatPrice(item.offer ? item.offerPrice : item.price) }}
                        </span>
                      </div>
                    </q-item-section>
                  </q-item>
                  <q-separator v-if="index < cartDetails.items.length - 1" spaced inset="item" />
                </q-list>

                <div class="order-totals q-mt-lg">
                  <div class="row items-center q-py-sm text-body1">
                    <div class="col text-grey-8">Subtotal:</div>
                    <div class="col text-right text-weight-medium">{{ formatPrice(cartDetails.subtotal) }}</div>
                  </div>

                  <div class="row items-center q-py-sm text-body1">
                    <div class="col text-grey-8">Descuento:</div>
                    <div class="col text-right text-negative text-weight-medium">-{{ formatPrice(cartDetails.discount)
                      }}</div>
                  </div>

                  <q-separator class="q-my-md" />

                  <div class="row items-center q-py-sm">
                    <div class="col text-h5 text-weight-bold">Total:</div>
                    <div class="col text-right text-h5 text-primary text-weight-bold">
                      {{ formatPrice(cartDetails.total) }}
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <q-card class="q-mt-lg guarantee-card shadow-10 rounded-borders">
              <q-card-section horizontal>
                <q-card-section class="bg-blue-1 text-center flex flex-center q-pa-md">
                  <q-icon name="verified_user" size="xl" color="positive" />
                </q-card-section>
                <q-card-section class="q-pa-md">
                  <div class="text-h6 text-primary text-weight-bold">Garantía de satisfacción</div>
                  <div class="text-caption text-grey-8">30 días para probar nuestros productos. Si no estás satisfecho,
                    te
                    devolvemos tu dinero.
                  </div>
                </q-card-section>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-xs-12 col-md-5">
            <q-card class="payment-methods-card shadow-10 rounded-borders">
              <q-card-section>
                <div class="text-h5 q-mb-md text-primary text-weight-bold">
                  <q-icon name="credit_card" class="q-mr-sm" />
                  Método de pago
                </div>

                <q-option-group v-model="paymentMethod" :options="paymentOptions" type="radio"
                  class="q-mb-md payment-options-group" />

                <div class="paypal-container q-mt-lg q-pa-sm bg-grey-1 rounded-borders">
                  <div ref="paypalRef" class="paypal-button"></div>
                  <div class="text-caption text-center q-mt-sm text-grey-7">
                    <q-icon name="lock" color="positive" class="q-mr-xs" />
                    Pago seguro con encriptación SSL
                  </div>
                </div>

                <q-card class="support-card q-mt-lg shadow-2 rounded-borders">
                  <q-card-section>
                    <div class="text-h6 text-primary q-mb-sm text-weight-bold">
                      <q-icon name="help_outline" class="q-mr-sm" />
                      ¿Necesitas ayuda?
                    </div>
                    <div class="q-mt-xs flex items-center text-grey-8">
                      <q-icon name="email" size="sm" class="q-mr-xs" />
                      soporte@colpromarket.com
                    </div>
                    <div class="q-mt-xs flex items-center text-grey-8">
                      <q-icon name="schedule" size="sm" class="q-mr-xs" />
                      L-V de 9:00 a 18:00 (hora local)
                    </div>
                  </q-card-section>
                </q-card>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-page>
    </q-page-container>

    <q-footer elevated class="checkout-footer">
      <q-toolbar class="flex flex-center">
        <div class="footer-links q-gutter-md">
          <a href="#" class="text-white text-weight-medium">Términos y condiciones</a>
          <a href="#" class="text-white text-weight-medium">Política de privacidad</a>
          <a href="#" class="text-white text-weight-medium">Reembolsos</a>
        </div>
        <div class="copyright q-mt-md text-caption text-grey-5">
          © {{ new Date().getFullYear() }} Colpromarket. Todos los derechos reservados.
        </div>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, toRaw } from 'vue'
import { useStore } from '../stores/store.js';
import { Notify } from 'quasar';
import { postData, putData } from '../service/service.js';
import { showNotification } from '../utils/utils.js';
const paypalRef = ref(null)
const store = useStore()
const cartDetails = ref(store.cart);
import { router } from '../routes/routes.js';
const formatItems = ref([])
const paymentValues = ref({})
const step = ref(3);
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

const renderPayPalButton = () => {
  if (!window.paypal || !window.paypal.Buttons) {
    setTimeout(renderPayPalButton, 250)
    return
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
          items: paymentValues.items
        }]
      })
    },
    onApprove: async (data, actions) => {
      const paymentId = await savePendingPayment()
      const details = await actions.order.capture()
      console.log("detalles de pago", toRaw(paymentDetails.value.paypalData));

      if (details.status === 'COMPLETED') {
        paymentDetails.value.paypalData = details;
        await updatePayment(paymentId, 'paid');

        showNotification('positive', `Pago completado por : ${details.payer.name.given_name}`)
      } else {
          await updatePayment(paymentId, 'canceled');
          return showNotification('negative', 'Error al pagar , intenta nuevamente')
        }

    },
    onError: (err) => {
      console.error('Error en PayPal:', err)
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
    console.log(" Error en pagos", error);
  }
}


async function updatePayment(id, status) {
  try {
    paymentDetails.value.status = status
    const response = await putData(`/orders/${id}`, {
      data: paymentDetails.value
    })
  } catch (error) {
    return console.log(' error actualizando pago pendiente', error);
  }
}


async function convertCurrency() {
  try {
    //por el momento el descuento es estatico luego cuando se complete la logica de ofertas ay que arreglarlo
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
  if (cartDetails.value.items) {
    cartDetails.value.items.forEach((product) => {
      const unitPriceInDollars = (product.price / 3900).toFixed(2) // Asumiendo un factor de conversión
      formatItems.value.push({
        name: product.name,
        unit_amount: { value: unitPriceInDollars, currency_code: 'USD' },
        quantity: product.quantity
      })
    })
  } else {
    Notify.create({
      type: 'negative',
      message: 'No hay datos del carrito'
    })
  }

  console.log("datos de items formateados", toRaw(formatItems.value));

}

onMounted(() => {
  formatProducts()
  renderPayPalButton()
  convertCurrency()
  console.log("datos del carrito en pagos", toRaw(cartDetails.value));
})
</script>


<style scoped>
@import url("../style/paymentGateway.css");
</style>
