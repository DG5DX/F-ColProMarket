<template>
  <div class="checkout-container">
    <h2>Tu pedido</h2>
    <table class="order-table">
      <thead>
        <tr>
          <th>Producto</th>
          <th>Subtotal</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in orderItems" :key="index">
          <td>{{ item.name }} × {{ item.quantity }}</td>
          <td>{{ formatPrice(item.price * item.quantity) }}</td>
        </tr>
        <tr>
          <td><strong>Subtotal</strong></td>
          <td><strong>{{ formatPrice(total) }}</strong></td>
        </tr>
        <tr>
          <td><strong>Total</strong></td>
          <td><strong>{{ formatPrice(total) }}</strong></td>
        </tr>
      </tbody>
    </table>

    <div class="payment-info">
      <h3>Transferencia bancaria directa</h3>
      <p>
        Realiza tu pago directamente en nuestra cuenta bancaria. Por favor, usa el número del pedido como referencia de pago. Tu pedido no se procesará hasta que se haya recibido el importe en nuestra cuenta.
      </p>
    </div>

    <div class="customer-info">
      <p><strong>Nombre:</strong> Juan Pérez</p>
      <p><strong>Email:</strong> juan@example.com</p>
    </div>

    <label class="terms">
      <input type="checkbox" v-model="acceptedTerms" />
      He leído y estoy de acuerdo con los <a href="#">términos y condiciones</a> de la web
    </label>

    <div ref="paypalRef" class="paypal-button"></div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  data() {
    return {
      orderItems: [
        { name: 'Curso 1', quantity: 1, price: 8.0 }
      ],
      acceptedTerms: false,
      paypalRef: null
    }
  },
  computed: {
    total() {
      return this.orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    }
  },
  methods: {
    formatPrice(value) {
      return `${value.toFixed(2)}€`
    },
    renderPayPalButton() {
      if (!window.paypal || !window.paypal.Buttons) {
        setTimeout(this.renderPayPalButton, 250)
        return
      }

      window.paypal.Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: { value: this.total.toFixed(2) }
            }]
          })
        },
        onApprove: async (data, actions) => {
          const details = await actions.order.capture()
          alert(`✅ Pago completado por ${details.payer.name.given_name}`)
          this.savePurchase(details)
        },
        onError: (err) => {
          console.error('❌ Error en PayPal:', err)
        }
      }).render(this.paypalRef)
    },
    savePurchase(details) {
      console.log('📝 Compra registrada:', {
        metodo: 'PayPal',
        detalles: details,
        monto: this.total
      })
    }
  },
  mounted() {
    this.paypalRef = this.$refs.paypalRef
    this.renderPayPalButton()
  }
}
</script>

<style scoped>
.checkout-container {
  max-width: 700px;
  margin: 3rem auto;
  padding: 2rem;
  background: linear-gradient(
    to right,
    rgba(255, 255, 0, 0.2),
    rgba(0, 0, 255, 0.2),
    rgba(255, 0, 0, 0.2)
  );
  border-radius: 20px;
  font-family: 'Montserrat', 'Playfair Display', 'Roboto', sans-serif;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  color: #333;
}

h2, h3 {
  font-family: 'Playfair Display', serif;
  color: #222;
  margin-bottom: 1rem;
  font-size: 1.8rem;
  border-bottom: 2px solid rgba(0, 0, 0, 0.1);
  padding-bottom: 0.3rem;
}

.order-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1.5rem;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 10px;
  overflow: hidden;
}

.order-table th,
.order-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #ccc;
  font-size: 0.95rem;
}

.order-table th {
  background-color: rgba(240, 240, 240, 0.6);
  font-weight: 600;
}

.payment-info {
  background: rgba(255, 255, 255, 0.6);
  padding: 1rem 1.2rem;
  border-radius: 12px;
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
  line-height: 1.5;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.05);
}

.customer-info {
  font-size: 0.95rem;
  background: rgba(255, 255, 255, 0.6);
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 1rem;
}

.terms {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  background: rgba(255, 255, 255, 0.6);
  padding: 0.8rem 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.terms a {
  color: #0056b3;
  text-decoration: underline;
}

.terms a:hover {
  text-decoration: none;
}

.paypal-button {
  text-align: center;
  margin-top: 1rem;
}

.paypal-button > div {
  transition: transform 0.3s ease;
}

.paypal-button > div:hover {
  transform: scale(1.03);
}
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&family=Playfair+Display:wght@600&family=Roboto&display=swap');
</style>
