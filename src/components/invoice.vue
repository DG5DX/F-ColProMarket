<template>
  <div class="invoice-container">
    <div class="invoice-header">
        <q-btn icon="chevron_left" to="/"></q-btn>
      <h2>Factura de Compra</h2>
      <div class="invoice-meta">
        <span class="invoice-id">ID: {{ invoice._id }}</span>
        <span class="invoice-date">Fecha: {{ formatDate(invoice.createdAt) }}</span>
      </div>
    </div>

    <div class="invoice-body">
      <div class="invoice-section">
        <h3>Información del Cliente</h3>
        <div class="customer-info">
          <p><strong>Nombre:</strong> {{ invoice.paypalData.payer.name.given_name }} {{ invoice.paypalData.payer.name.surname }}</p>
          <p><strong>Email:</strong> {{ invoice.paypalData.payer.email_address }}</p>
          <p><strong>ID de Pago:</strong> {{ invoice.paypalData.id }}</p>
        </div>
      </div>

      <div class="invoice-section">
        <h3>Detalles del Pago</h3>
        <div class="payment-info">
          <p><strong>Estado:</strong> <span class="status-badge">{{ invoice.status }}</span></p>
          <p><strong>Fecha de Pago:</strong> {{ formatDate(invoice.paypalData.update_time) }}</p>
          <p><strong>Método:</strong> PayPal</p>
        </div>
      </div>

      <div class="invoice-section products-section">
        <h3>Productos</h3>
        <table class="products-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(product, index) in invoice.products" :key="index">
              <td>{{ product.name || 'Producto ' + (index + 1) }}</td>
              <td>{{ product.quantity || 1 }}</td>
              <td>{{ formatCurrency(product.price || product.total / (product.quantity || 1)) }}</td>
              <td>{{ formatCurrency(product.price ? product.price * product.quantity : product.total) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="invoice-total">
        <div class="total-row">
          <span>Subtotal:</span>
          <span>{{ formatCurrency(invoice.total) }}</span>
        </div>
        <div class="total-row">
          <span>Impuestos:</span>
          <span>{{ formatCurrency(0) }}</span>
        </div>
        <div class="total-row grand-total">
          <span>Total:</span>
          <span>{{ formatCurrency(invoice.total) }}</span>
        </div>
      </div>
    </div>

    <div class="invoice-footer">
      <p>Gracias por su compra</p>
      <p>Estado de la orden: <strong>{{ getStatusText(invoice.state) }}</strong></p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InvoiceComponent',
  props: {
    invoiceData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      invoice: {
        _id: '6838730d73cc93a3665f6d3b',
        userId: '68310848500998dbdbb07b60',
        products: [
          { name: 'Producto 1', quantity: 1, price: 25000, total: 25000 },
          { name: 'Producto 2', quantity: 1, price: 30000, total: 30000 }
        ],
        total: 55000,
        status: 'paid',
        state: 1,
        createdAt: '2025-05-29T14:45:33.734+00:00',
        updatedAt: '2025-05-29T14:45:36.271+00:00',
        __v: 0,
        paypalData: {
          id: '3YT39798HX4479321',
          intent: 'CAPTURE',
          status: 'COMPLETED',
          purchase_units: [{}],
          payer: {
            name: {
              given_name: 'John',
              surname: 'Doe'
            },
            email_address: 'sb-ws2ah42809141@personal.example.com',
            payer_id: 'YLCMFM9J47XR6',
            address: {
              country_code: 'CO'
            }
          },
          create_time: '2025-05-29T14:44:28Z',
          update_time: '2025-05-29T14:45:35Z',
          links: [
            {
              href: 'https://api.sandbox.paypal.com/v2/checkout/orders/3YT39798HX4479321',
              rel: 'self',
              method: 'GET'
            }
          ]
        }
      }
    };
  },
  created() {
    // Si se pasa data por props, sobreescribimos la data por defecto
    if (this.invoiceData) {
      this.invoice = {...this.invoice, ...this.invoiceData};
    }
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    formatCurrency(amount) {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
      }).format(amount);
    },
    getStatusText(state) {
      const statusMap = {
        0: 'Cancelado',
        1: 'Pagado',
        2: 'En proceso',
        3: 'Enviado',
        4: 'Entregado'
      };
      return statusMap[state] || 'Desconocido';
    }
  }
};
</script>

<style scoped>
.invoice-container {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  background-color: var(--one-color--);
  border-radius: 8px;
  box-shadow: var(--card-shadow);
  overflow: hidden;
  font-family: 'Arial', sans-serif;
  color: var(--text-primary);
  padding: 0;
}

.invoice-header {
  background: var(--five-color--);
  color: white;
  padding: 20px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.invoice-header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

.invoice-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.invoice-id, .invoice-date {
  font-size: 14px;
  opacity: 0.9;
}

.invoice-body {
  padding: 30px;
}

.invoice-section {
  margin-bottom: 30px;
}

.invoice-section h3 {
  color: var(--seven-color--);
  border-bottom: 2px solid var(--four-color--);
  padding-bottom: 8px;
  margin-bottom: 15px;
  font-size: 18px;
}

.customer-info p, .payment-info p {
  margin: 8px 0;
  line-height: 1.5;
}

.status-badge {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  background-color: #4CAF50;
  color: white;
}

.products-section {
  overflow-x: auto;
}

.products-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}

.products-table th {
  background-color: var(--two-color--);
  color: var(--text-primary);
  padding: 12px 15px;
  text-align: left;
}

.products-table td {
  padding: 12px 15px;
  border-bottom: 1px solid var(--border-color);
}

.products-table tr:last-child td {
  border-bottom: none;
}

.invoice-total {
  margin-top: 30px;
  width: 100%;
  max-width: 300px;
  margin-left: auto;
}

.total-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid var(--border-color);
}

.grand-total {
  font-weight: bold;
  font-size: 18px;
  color: var(--seven-color--);
  border-top: 2px solid var(--four-color--);
  margin-top: 5px;
  padding-top: 10px;
}

.invoice-footer {
  background-color: var(--two-color--);
  padding: 20px 30px;
  text-align: center;
  font-size: 14px;
  color: var(--text-secondary);
}

.invoice-footer p {
  margin: 5px 0;
}

@media (max-width: 768px) {
  .invoice-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .invoice-meta {
    align-items: flex-start;
    margin-top: 10px;
  }
  
  .invoice-total {
    max-width: 100%;
  }
}
</style>