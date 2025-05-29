<template>
  <div class="fullscreen-checkout">
    <!-- Header con logo y pasos -->
    <header class="checkout-header">
      <div class="logo">
        <i class="fas fa-graduation-cap"></i>
        <span>ACADEMIA ONLINE</span>
      </div>
      <div class="steps">
        <div class="step completed">
          <div class="step-number">1</div>
          <div class="step-name">Carrito</div>
        </div>
        <div class="step completed">
          <div class="step-number">2</div>
          <div class="step-name">Información</div>
        </div>
        <div class="step active">
          <div class="step-number">3</div>
          <div class="step-name">Pago</div>
        </div>
        <div class="step">
          <div class="step-number">4</div>
          <div class="step-name">Confirmación</div>
        </div>
      </div>
    </header>

    <!-- Contenido principal -->
    <main class="checkout-main">
      <!-- Sección izquierda - Resumen del pedido -->
      <div class="order-summary">
        <div class="summary-header">
          <h2><i class="fas fa-shopping-bag"></i> Tu pedido</h2>
          <div class="order-number">Pedido #12345</div>
        </div>

        <div class="order-items">
          <div class="order-item">
            <div class="item-image" style="background-color: #FF9A8B;"></div>
            <div class="item-details">
              <h3>Curso de Vue.js Avanzado</h3>
              <p class="item-meta">Acceso por 12 meses</p>
              <div class="item-quantity">1 × 89.00€</div>
            </div>
            <div class="item-price">89.00€</div>
          </div>

          <div class="order-item">
            <div class="item-image" style="background-color: #4FC0D0;"></div>
            <div class="item-details">
              <h3>Curso de Diseño UX/UI</h3>
              <p class="item-meta">Acceso por 12 meses</p>
              <div class="item-quantity">1 × 65.00€</div>
            </div>
            <div class="item-price">95.00€</div>
          </div>
        </div>

        <div class="promo-section">
          <input type="text" placeholder="Código promocional" class="promo-input">
          <button class="apply-btn">Aplicar</button>
        </div>

        <div class="order-totals">
          <div class="total-row">
            <span>Subtotal</span>
            <span>{{ cartDetails.total }}</span>
          </div>
          <div class="total-row">
            <span>Descuento</span>
            <span class="discount">-10000</span>
          </div>
          <div class="total-row grand-total">
            <span>Total</span>
            <span>falta arreglar logica de esto</span>
          </div>
        </div>

        <div class="guarantee-banner">
          <i class="fas fa-shield-alt"></i>
          <span>Garantía de satisfacción de 30 días</span>
        </div>
      </div>

      <!-- Sección derecha - Método de pago -->
      <div class="payment-section">
        <div class="payment-container">
          <h2><i class="fas fa-credit-card"></i> Método de pago</h2>
          
          <div class="payment-method selected">
            <div class="method-logo">
              <i class="fab fa-paypal"></i>
            </div>
            <div class="method-info">
              <h3>PayPal</h3>
              <p>Paga con tu cuenta PayPal o tarjeta</p>
            </div>
          </div>

          <div class="paypal-button-container">
            <div ref="paypalRef" class="paypal-button"></div>
            <p class="secure-payment">
              <i class="fas fa-lock"></i> Pago seguro con encriptación SSL
            </p>
          </div>

          <div class="customer-support">
            <h3><i class="fas fa-headset"></i> ¿Necesitas ayuda?</h3>
            <p>Contacta con nuestro equipo de soporte en <strong>soporte@academiaonline.com</strong></p>
            <p>Horario: L-V de 9:00 a 18:00</p>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="checkout-footer">
      <div class="footer-links">
        <a href="#">Términos y condiciones</a>
        <a href="#">Política de privacidad</a>
        <a href="#">Reembolsos</a>
      </div>
      <div class="copyright">
        © 2023 Academia Online. Todos los derechos reservados.
      </div>
    </footer>
  </div>
</template>
<script setup>
import { ref, onMounted, toRaw } from 'vue'
import { useStore } from '../stores/store.js';
import { Notify } from 'quasar';
import {  postData, putData } from '../service/service.js';
import { showNotification } from '../utils/utils.js';
const paypalRef = ref(null)
const store = useStore()
const cartDetails = ref(store.cart);
const formatItems = ref([])
const paymentValues = ref({})

const paymentDetails = ref({
    userId:store.userId,
    products:cartDetails.value.items,
    paypalData:{},
    total:cartDetails.value.total
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
          items:paymentValues.items
        }]
      })
    },
    onApprove: async (data, actions) => {
      const paymentId = await savePendingPayment()
      const details = await actions.order.capture()
      if(details.status === 'COMPLETED'){
        paymentDetails.value.paypalData = details;
        await updatePayment(paymentId, 'paid');
      }else{
        await updatePayment(paymentId, 'canceled');
        return showNotification('negative','Error al pagar , intenta nuevamente')
      }
      console.log("detalles de pago" , toRaw(paymentDetails.value.paypalData));
      return Notify.create({
        type:'positive',
        message:`Pago completado por : ${details.payer.name.given_name}`
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

async function savePendingPayment(){
  try {
    const response = await postData("/orders",{
      data:paymentDetails.value
    })
    console.log("Datos de pago pendiente guardado", response.data);
    return response.data._id
  } catch (error) {
    showNotification('negative','Error al procesar pago')
    console.log("[Linea 203] Error en pagos" , error);
  }
}


async function updatePayment(id , status){
  try {
    paymentDetails.value.status = status
    const response = await putData(`/orders/${id}`,{
      data:paymentDetails.value
    })
  } catch (error) {
    return console.log('[linea 218] error actualizando pago pendiente', error);
  }
}

async function convertCurrency(){
  try {  //por el momento el descuento es estatico luego cuando se complete la logica de ofertas ay que arreglarlo
    const response = await postData(`/orders/convertCurrency`,{
      discount: 10000, 
      items: toRaw(cartDetails.value.items) 
    })
    paymentValues.value = response.data
    console.log('valores de pago', toRaw(paymentValues.value));

  } catch (error) {
    console.log('error al convertir valores', error);
  }
}

function formatProducts(){
if(cartDetails.value.items){
    cartDetails.value.items.forEach((product)=>{
      const unitPriceInDollars = (product.price / 3900).toFixed(2)
    formatItems.value.push({
      name:product.name,
      unit_amount:{value:unitPriceInDollars , currency_code:'USD'},
      quantity:product.quantity
    })
  })
}else{
  Notify.create({
    type:'negative',
    message:'No hay datos del carrito'
  })
}

console.log("datos de items formateados", toRaw(formatItems.value));

}

onMounted(() => {
  formatProducts()
  renderPayPalButton()
  convertCurrency()
  console.log("datos del carrito en pagos" , toRaw(cartDetails.value));
})
</script>


<style scoped>
@import url("../style/paymentGateway.css");
</style>
