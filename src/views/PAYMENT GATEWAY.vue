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
.payment-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f0f2f5;
  padding: 20px;
}

.payment-box {
  background: white;
  border-radius: 16px;
  padding: 40px 30px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.title {
  font-size: 24px;
  margin-bottom: 8px;
  color: #333;
}

.subtitle {
  font-size: 14px;
  margin-bottom: 30px;
  color: #666;
}

.payment-buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.buy-btn {
  padding: 12px 24px;
  font-size: 16px;
  background-color: #0070ba;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 100%;
}

.buy-btn:hover {
  background-color: #005c9e;
}

.paypal-button {
  width: 100%;
}

.payment-container {
  width: 100%;
  background: linear-gradient(to right, rgba(255, 255, 0, 0.5), rgba(0, 0, 255, 0.5), rgba(255, 0, 0, 0.5));
  padding: 5rem;
  border-radius: 10px;
}

.progress-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  align-items: center;
}

.step {
  text-align: center;
  flex: 1;
}

.circle {
  width: 20px;
  height: 20px;
  border: 2px solid gray;
  border-radius: 50%;
  margin: auto;
  background: white;
}

.circle.active {
  background: #3f51b5;
  border-color: #3f51b5;
}

.payment-box {
  background: #e0e0e0;
  padding: 2rem;
  border-radius: 10px;
}

.methods {
  display: flex;
  justify-content: space-around;
  margin: 1rem 0;
}

.method-btn {
  background: #f0f0f0;
  border: 1px solid #ccc;
  padding: 1rem;
  border-radius: 10px;
  width: 150px;
  text-align: center;
  cursor: pointer;
}

.method-btn:hover {
  background: #ddd;
}

.card-details {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  margin: 2rem 0;
}
</style>