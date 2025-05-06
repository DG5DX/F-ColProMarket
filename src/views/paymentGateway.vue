<template>
  <div class="payment-container">
    <div class="payment-box">
      <h2 class="title">Método de pago</h2>
      <p class="subtitle">Seleccione su forma de pago preferida</p>

      <div v-if="amount !== null" class="payment-buttons">
        <div ref="paypalRef" class="paypal-button"></div>
        <button class="buy-btn" @click="handleCardPayment">Pagar con tarjeta</button>
      </div>
      <p v-else>Cargando precio...</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import axios from 'axios'

export default {
  data() {
    return {
      amount: null,
      paypalRef: null
    }
  },
  methods: {
    async fetchAmount() {
      try {
        const response = await axios.get('https://elbackend.com/api/precio') //Capi esto aqui va el axios lo puse a que funcionara asi mire a ver si esa monda sirve
        this.amount = response.data.amount
        this.renderPayPalButton()
      } catch (error) {
        console.error('❌ Error al obtener el monto:', error)
      }
    },
    renderPayPalButton() {
      if (!window.paypal || !window.paypal.Buttons || this.amount === null) {
        setTimeout(this.renderPayPalButton, 250)
        return
      }

      window.paypal.Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: { value: this.amount.toFixed(2) }
            }]
          })
        },
        onApprove: async (data, actions) => {
          const details = await actions.order.capture()
          alert(`✅ Pago completado por ${details.payer.name.given_name}`)
          this.savePurchase('PayPal', details)
        },
        onError: (err) => {
          console.error('❌ Error en PayPal:', err)
        }
      }).render(this.paypalRef)
    },
    handleCardPayment() {
      const dummyDetails = {
        method: 'Tarjeta de crédito',
        transactionId: 'manual-1234',
        buyer: 'Usuario tarjeta'
      }
      alert('✅ Pago con tarjeta procesado')
      this.savePurchase('Tarjeta', dummyDetails)
    },
    savePurchase(method, details) {
      console.log('📝 Guardando compra...', {
        metodo: method,
        detalles: details,
        monto: this.amount
      })

    }
  },
  mounted() {
    this.paypalRef = this.$refs.paypalRef
    this.fetchAmount()
  }
}
</script>

<style scoped>
@import url('../style/paymentGateway.css');
</style>