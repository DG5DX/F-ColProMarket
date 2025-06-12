<template>
  <q-layout>
    <q-page-container>
      <!-- Header con pasos del checkout -->
      <q-header elevated class="checkout-header bg-primary text-white">
        <q-toolbar>
          <q-toolbar-title class="text-h5">
            <q-avatar circle size="sm" @click="router.push('/')" class="cursor-pointer">
              <img src="../assets/MiniLogo.jpeg">
            </q-avatar>
            Colpromarket
          </q-toolbar-title>

          <q-stepper v-model="step" header-nav flat bordered inactive-color="white" active-color="yellow"
            done-color="green" class="no-box-shadow bg-transparent text-white">
            <q-step :name="1" title="Informacion personal" icon="shopping_cart" :done="step > 1" />
            <q-step :name="2" title="informacion producto" icon="person" :done="step > 2" :disable="step < 2" />
            <q-step :name="3" title="Pago" icon="credit_card" :done="step > 3" :disable="step < 3" />
            <q-step :name="4" title="Confirmación" icon="check_circle" />
          </q-stepper>
        </q-toolbar>
      </q-header>

 <div v-if="step === 1">
  <q-page class="checkout-page">
    <q-card>
      <q-card-section>
        <!-- Dirección de Envío -->
        <q-card class="my-card q-mb-md">
          <q-card-section class="bg-primary text-white flex justify-between items-center">
            <div class="text-h6">Dirección de Envío</div>
            <q-btn 
              icon="edit" 
              flat 
              round 
              dense 
              color="white" 
              @click="openAddressEditDialog"
              title="Editar dirección"
            />
          </q-card-section>

          <q-separator/>

          <q-card-section>
            <q-list bordered separator>
              <q-item>
                <q-item-section>
                  <q-item-label caption>Calle</q-item-label>
                  <q-item-label>{{ user.shippingAddress.street }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>Ciudad</q-item-label>
                  <q-item-label>{{ user.shippingAddress.city }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>Estado/Provincia</q-item-label>
                  <q-item-label>{{ user.shippingAddress.state }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>Código Postal</q-item-label>
                  <q-item-label>{{ user.shippingAddress.zipCode !== 'N/A' ? user.shippingAddress.zipCode : 'No especificado' }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>País</q-item-label>
                  <q-item-label>{{ user.shippingAddress.country }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>

        <!-- Diálogo para editar dirección -->
        <q-dialog v-model="addressEditDialog" persistent>
          <q-card style="min-width: 70vw;">
            <q-toolbar class="bg-primary text-white">
              <q-toolbar-title>Editar Dirección de Envío</q-toolbar-title>
              <q-btn flat round dense icon="close" v-close-popup />
            </q-toolbar>

            <q-card-section>
              <q-form @submit="saveAddressInfo">
                <div class="row q-col-gutter-md">
                  <div class="col-12">
                    <q-input
                      v-model="editForm.shippingAddress.street"
                      label="Calle y número"
                      outlined
                      lazy-rules
                      :rules="[
                        val => !!val || 'La calle es requerida',
                        val => val.length >= 5 || 'Mínimo 5 caracteres'
                      ]"
                    />
                  </div>

                  <div class="col-12 col-sm-6">
                    <q-select
                      v-model="editForm.shippingAddress.state"
                      :options="colombianStates"
                      label="Departamento"
                      outlined
                      use-input
                      @filter="filterStates"
                      lazy-rules
                      :rules="[val => !!val || 'El departamento es requerido']"
                    />
                  </div>

                  <div class="col-12 col-sm-6">
                    <q-select
                      v-model="editForm.shippingAddress.city"
                      :options="filteredCities"
                      label="Ciudad"
                      outlined
                      use-input
                      @filter="filterCities"
                      lazy-rules
                      :rules="[val => !!val || 'La ciudad es requerida']"
                    />
                  </div>

                  <div class="col-12 col-sm-6">
                    <q-input
                      v-model="editForm.shippingAddress.zipCode"
                      label="Código Postal"
                      outlined
                      mask="######"
                      unmasked-value
                      :rules="[
                        val => !!val || 'El código postal es requerido',
                        val => val.length === 6 || 'Deben ser 6 dígitos'
                      ]"
                    />
                  </div>

                  <div class="col-12 col-sm-6">
                    <q-input
                      v-model="editForm.shippingAddress.country"
                      label="País"
                      outlined
                      readonly
                    />
                  </div>
                </div>

                <div class="q-mt-lg flex justify-end">
                  <q-btn label="Cancelar" color="negative" flat v-close-popup class="q-mr-sm" />
                  <q-btn label="Guardar" type="submit" color="primary" />
                </div>
              </q-form>
            </q-card-section>
          </q-card>
        </q-dialog>
      </q-card-section>
    </q-card>
  </q-page>
</div>

      <div v-else-if="step === 2">
        <!-- Detalles pago -->
        <q-page class="checkout-page">
          <div class="col-md-7 col-12">
            <q-card class="order-summary-card">
              <q-card-section>
                <div class="text-h5 q-mb-md">
                  <q-icon name="shopping_bag" class="q-mr-sm" />
                  Tu pedido #{{ 2131 }}
                </div>

                <!-- Lista de productos -->
                <q-list bordered separator>
                  <q-item v-for="(item, index) in cartDetails.items" :key="index" class="q-pa-none">
                    <q-item-section avatar>
                      <q-img :src="item.images[0].urlImage" :ratio="1" width="80px" class="rounded-borders" />
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

                <!-- Cupón de descuento -->
                <q-input v-model="couponCode" label="Código promocional" outlined class="q-mt-md">
                  <template v-slot:append>
                    <q-btn label="Aplicar" color="primary" flat @click="applyCoupon" />
                  </template>
                </q-input>

                <!-- Resumen de totales -->
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

            <!-- Garantía -->
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
        </q-page>
      </div>

      <div v-else-if="step === 3">
        <!-- Método de pago -->
        <div class="col-md-5 col-12">
          <q-card class="payment-methods-card">
            <q-card-section>
              <div class="text-h5 q-mb-md">
                <q-icon name="credit_card" class="q-mr-sm" />
                Método de pago
              </div>

              <!-- Selección de método de pago -->
              <q-option-group v-model="paymentMethod" :options="paymentOptions" type="radio" inline class="q-mb-md" />

              <!-- Botón de PayPal -->
              <div class="paypal-container q-mt-lg">
                <div ref="paypalRef" class="paypal-button"></div>
                <div class="text-caption text-center q-mt-sm">
                  <q-icon name="lock" color="positive" />
                  Pago seguro con encriptación SSL
                </div>
              </div>

              <!-- Información de soporte -->
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
        </div>
      </div>

      <div v-else-if="step === 4">
        <!-- Confirmación final -->
        <q-btn label="Volver al inicio" @click="step = 1" />
      </div>


      <!-- Contenido principal -->
      <q-page class="checkout-page">
        <div class="row q-col-gutter-lg">
          <!-- Columna izquierda - Resumen del pedido -->
          <!-- Columna derecha - Métodos de pago -->
        </div>
      </q-page>

      <!-- Footer -->
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
const step = ref(1);
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

function applyCoupon() {
  // Lógica para aplicar cupón
  Notify.create({
    type: 'info',
    message: 'Cupón aplicado correctamente'
  });
}

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
      if (details.status === 'COMPLETED') {
        paymentDetails.value.paypalData = details;
        await updatePayment(paymentId, 'paid');
      } else {
        await updatePayment(paymentId, 'canceled');
        return showNotification('negative', 'Error al pagar , intenta nuevamente')
      }
      console.log("detalles de pago", toRaw(paymentDetails.value.paypalData));
      return Notify.create({
        type: 'positive',
        message: `Pago completado por : ${details.payer.name.given_name}`
      })

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

// Datos de Colombia
const allColombianStates = [
  'Amazonas', 'Antioquia', 'Arauca', 'Atlántico', 'Bolívar', 
  'Boyacá', 'Caldas', 'Caquetá', 'Casanare', 'Cauca', 
  'Cesar', 'Chocó', 'Córdoba', 'Cundinamarca', 'Guainía', 
  'Guaviare', 'Huila', 'La Guajira', 'Magdalena', 'Meta', 
  'Nariño', 'Norte de Santander', 'Putumayo', 'Quindío', 
  'Risaralda', 'San Andrés y Providencia', 'Santander', 'Sucre', 
  'Tolima', 'Valle del Cauca', 'Vaupés', 'Vichada'
];

const allColombianCities = [
  // Ciudades principales por departamento
  // Amazonas
  'Leticia', 'Puerto Nariño',
  // Antioquia
  'Medellín', 'Bello', 'Itagüí', 'Envigado', 'Rionegro',
  // Atlántico
  'Barranquilla', 'Soledad', 'Malambo', 'Sabanalarga',
  // Bogotá (especial)
  'Bogotá D.C.',
  // Bolívar
  'Cartagena', 'Magangué', 'Turbaco',
  // Boyacá
  'Tunja', 'Duitama', 'Sogamoso',
  // Caldas
  'Manizales', 'La Dorada', 'Chinchiná',
  // Valle del Cauca
  'Cali', 'Palmira', 'Buenaventura', 'Tuluá', 'Cartago'
];

// En tu setup() o data()
const addressEditDialog = ref(false);
const colombianStates = ref(allColombianStates); // Asegúrate de tener definido allColombianStates
const filteredCities = ref([]);

// Métodos necesarios
const openAddressEditDialog = () => {
  editForm.value.shippingAddress = {
    street: user.value.shippingAddress.street !== 'No especificado' ? user.value.shippingAddress.street : '',
    city: user.value.shippingAddress.city !== 'No especificada' ? user.value.shippingAddress.city : '',
    state: user.value.shippingAddress.state !== 'No especificado' ? user.value.shippingAddress.state : '',
    zipCode: user.value.shippingAddress.zipCode !== 'N/A' ? user.value.shippingAddress.zipCode : '',
    country: 'Colombia'
  };
  addressEditDialog.value = true;
};

const saveAddressInfo = () => {
  user.value.shippingAddress.street = editForm.value.shippingAddress.street || 'No especificado';
  user.value.shippingAddress.city = editForm.value.shippingAddress.city || 'No especificada';
  user.value.shippingAddress.state = editForm.value.shippingAddress.state || 'No especificado';
  user.value.shippingAddress.zipCode = editForm.value.shippingAddress.zipCode || 'N/A';
  user.value.shippingAddress.country = 'Colombia';
  
  user.value.updatedAt = new Date().toISOString();
  
  $q.notify({
    type: 'positive',
    message: 'Dirección actualizada correctamente',
    position: 'top'
  });
  
  addressEditDialog.value = false;
};

// Filtros para departamentos y ciudades
const filterStates = (val, update) => {
  update(() => {
    const needle = val.toLowerCase();
    colombianStates.value = allColombianStates.filter(
      v => v.toLowerCase().indexOf(needle) > -1
    );
  });
};

const filterCities = (val, update) => {
  update(() => {
    const needle = val.toLowerCase();
    if (editForm.value.shippingAddress.state) {
      filteredCities.value = allColombianCities.filter(
        v => v.toLowerCase().indexOf(needle) > -1
      );
    } else {
      filteredCities.value = allColombianCities.filter(
        v => v.toLowerCase().indexOf(needle) > -1
      );
    }
  });
};



async function savePendingPayment() {
  try {
    const response = await postData("/orders", {
      data: paymentDetails.value
    })
    console.log("Datos de pago pendiente guardado", response.data);
    return response.data._id
  } catch (error) {
    showNotification('negative', 'Error al procesar pago')
    console.log("[Linea 203] Error en pagos", error);
  }
}


async function updatePayment(id, status) {
  try {
    paymentDetails.value.status = status
    const response = await putData(`/orders/${id}`, {
      data: paymentDetails.value
    })
  } catch (error) {
    return console.log('[linea 218] error actualizando pago pendiente', error);
  }
}

async function convertCurrency() {
  try {  //por el momento el descuento es estatico luego cuando se complete la logica de ofertas ay que arreglarlo
    const response = await postData(`/orders/convertCurrency`, {
      discount:cartDetails.value.discount,
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
      const unitPriceInDollars = (product.price / 3900).toFixed(2)
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
