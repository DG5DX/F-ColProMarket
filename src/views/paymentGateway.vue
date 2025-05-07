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


