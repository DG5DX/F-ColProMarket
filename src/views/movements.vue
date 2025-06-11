<template>
<q-layout>
    <q-page-container>
          <q-page class="q-pa-md movements-viewer-page">
    <h2 class="text-center q-my-md page-title">Historial de Movimientos</h2>

    <div v-if="movements.length === 0" class="text-center text-grey-7 q-pa-lg empty-state">
      <q-icon name="info" size="xl" class="q-mb-md" />
      <p class="text-h6">No hay movimientos registrados.</p>
      <p>Cuando realices una compra, aparecerá aquí.</p>
    </div>

    <q-list bordered class="rounded-borders movements-list">
      <q-item
        v-for="movement in movements"
        :key="movement.paypalData ? movement.paypalData.id : movement._id"
        class="q-mb-md movement-item"
      >
        <q-card flat bordered class="full-width movement-card">
          <q-card-section class="q-pb-none row items-center justify-between movement-header">
            <div class="text-h6 text-primary">
              <q-icon name="receipt" class="q-mr-sm" />
              Movimiento ID:
              <span class="movement-id">{{ movement.paypalData ? movement.paypalData.id : movement._id }}</span>
            </div>
            <div :class="['text-subtitle1', `status-${movement.status}`]">
              <q-icon :name="getStatusIcon(movement.status)" class="q-mr-xs" />
              Estado: <span class="status-text">{{ getStatusText(movement.status) }}</span>
            </div>
          </q-card-section>

          <q-card-section class="q-pt-xs movement-details">
            <div class="row q-col-gutter-sm">
              <div class="col-12 col-md-6">
                <p class="q-mb-xs">
                  <q-icon name="event" class="q-mr-xs" />
                  <span class="text-weight-bold">Fecha:</span> {{ formatDate(movement.createdAt) }}
                </p>
                <p class="q-mb-xs">
                  <q-icon name="update" class="q-mr-xs" />
                  <span class="text-weight-bold">Última Actualización:</span> {{ formatDate(movement.updatedAt) }}
                </p>
              </div>
              <div class="col-12 col-md-6 text-right">
                <p class="text-h5 text-weight-bold q-mb-xs total-amount">
                  <q-icon name="payments" class="q-mr-sm" />
                  Total: {{ formatCurrency(movement.total) }}
                </p>
                <p class="text-caption text-grey-6 q-mb-none" v-if="movement.paypalData">
                  Pago via PayPal ({{ movement.paypalData.intent }})
                </p>
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions align="left">
            <q-expansion-item
              expand-separator
              icon="shopping_bag"
              label="Ver Productos"
              class="full-width products-expansion"
            >
              <q-card-section class="q-pt-none product-list-section">
                <q-list separator>
                  <q-item
                    v-for="(product, index) in movement.products"
                    :key="index"
                    class="product-item q-my-sm"
                  >
                    <q-item-section avatar>
                      <q-avatar rounded size="60px">
                        <img :src="product.images && product.images[0] ? product.images[0] : 'https://via.placeholder.com/60x60?text=No+Image'" alt="Product Image">
                      </q-avatar>
                    </q-item-section>

                    <q-item-section>
                      <q-item-label class="text-weight-bold">{{ product.name }}</q-item-label>
                      <q-item-label caption lines="2">{{ product.description }}</q-item-label>
                      <q-item-label class="text-weight-medium">Cantidad: {{ product.quantity }}</q-item-label>
                    </q-item-section>

                    <q-item-section side top>
                      <q-item-label class="text-body1 text-right">{{ formatCurrency(product.total) }}</q-item-label>
                      <q-item-label caption v-if="product.discountPercentage">
                        <span class="text-strike text-grey-6">{{ formatCurrency(product.subtotal) }}</span>
                        <span class="text-positive q-ml-xs">(-{{ product.discountPercentage }}%)</span>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-expansion-item>
          </q-card-actions>
        </q-card>
      </q-item>
    </q-list>
  </q-page>
    </q-page-container>
</q-layout>
</template>

<script setup>
import { ref } from 'vue';
import { date } from 'quasar';

// Datos de ejemplo para los movimientos (simulando tu array de objetos vacío)
const movements = ref([
  {
    userId: '683918074f1d70b937211cf8',
    products: [
      {
        _id: '6831bb52bf78f5ef967d3388',
        name: 'Humidificador Ultrasónico Deluxe',
        description: 'Transforma el aire seco de tu hogar en un ambiente fresco y saludable...',
        images: ['https://picsum.photos/id/237/200/300'], // Imagen de ejemplo
        price: 30000,
        acceptReturns: 'Si',
        averageRating: 2,
        categoryId: {},
        stock: 15,
        state: 1,
        reviews: [
          {
            userId: {},
            stars: 1,
            message: 'me exploto en la casa y mato a mi perro',
            _id: '683462c0921415343fb6f08a',
          },
        ],
        createdAt: '2025-05-24T12:28:02.393Z',
        updatedAt: '2025-06-03T13:37:05.787Z',
        discountPercentage: 5,
        offer: 1,
        offerPrice: 28500,
        offerDateRange: {
          from: '2025-06-03',
          to: '2025-06-06',
        },
        quantity: '1', // Nota: Tu dato es string, mejor un number para cálculos
        total: 28500,
        discount: 1500,
        subtotal: 30000,
      },
      // Puedes añadir más productos aquí para probar
      {
        _id: '6831bb52bf78f5ef967d3389',
        name: 'Cafetera Inteligente XYZ',
        description: 'Prepara tu café perfecto con un solo clic desde tu smartphone.',
        images: ['https://picsum.photos/id/240/200/300'],
        price: 50000,
        quantity: '2',
        total: 100000,
        discount: 0,
        subtotal: 100000,
      }
    ],
    total: 8728500, // Este total parece muy alto para el ejemplo de un solo producto
    status: 'paid',
    state: 1,
    createdAt: '2025-06-09T16:06:46.415Z', // Convertido a formato ISO para Date
    updatedAt: '2025-06-09T16:06:50.387Z', // Convertido a formato ISO para Date
    __v: 0,
    paypalData: {
      id: '8UP900905A661221U',
      intent: 'CAPTURE',
      status: 'COMPLETED',
      purchase_units: [],
      payer: {},
      create_time: '2025-06-09T16:06:27Z',
      update_time: '2025-06-09T16:06:43Z',
      links: [],
    },
  },
  {
    // Segundo movimiento de ejemplo para mostrar la lista
    userId: '683918074f1d70b937211cf9',
    products: [
      {
        _id: '6831bb52bf78f5ef967d3390',
        name: 'Auriculares Bluetooth Pro',
        description: 'Sonido inmersivo y cancelación de ruido activa.',
        images: ['https://picsum.photos/id/245/200/300'],
        price: 12000,
        quantity: '1',
        total: 12000,
        discount: 0,
        subtotal: 12000,
      }
    ],
    total: 12000,
    status: 'pending', // Estado pendiente
    state: 1,
    createdAt: '2025-06-08T10:30:00.000Z',
    updatedAt: '2025-06-08T10:30:00.000Z',
    __v: 0,
    paypalData: {
      id: 'ABCDE12345FGHI67890',
      intent: 'AUTHORIZE',
      status: 'PENDING',
      purchase_units: [],
      payer: {},
      create_time: '2025-06-08T10:29:00Z',
      update_time: '2025-06-08T10:29:00Z',
      links: [],
    },
  },
  {
    // Tercer movimiento de ejemplo con pocos datos
    userId: '683918074f1d70b937211cfa',
    products: [
      {
        _id: '6831bb52bf78f5ef967d3391',
        name: 'Mouse Óptico Inalámbrico',
        description: 'Diseño ergonómico para largas horas de uso.',
        images: ['https://picsum.photos/id/250/200/300'],
        price: 5000,
        quantity: '3',
        total: 15000,
        discount: 0,
        subtotal: 15000,
      }
    ],
    total: 15000,
    status: 'refunded', // Estado reembolsado
    state: 1,
    createdAt: '2025-06-07T08:00:00.000Z',
    updatedAt: '2025-06-07T08:00:00.000Z',
    __v: 0,
    paypalData: {
      id: 'ZYXWV98765FEDCB43210',
      intent: 'REFUND',
      status: 'REFUNDED',
      purchase_units: [],
      payer: {},
      create_time: '2025-06-07T07:50:00Z',
      update_time: '2025-06-07T08:00:00Z',
      links: [],
    },
  },
]);

// --- Funciones de utilidad ---

const formatDate = (isoString) => {
  if (!isoString) return 'N/A';
  const dateObj = new Date(isoString);
  // date.formatDate de Quasar es ideal para esto
  return date.formatDate(dateObj, 'DD/MM/YYYY HH:mm');
};

const formatCurrency = (amount) => {
  if (typeof amount !== 'number') {
    // Intenta convertir si es un string que parezca un número
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return 'N/A';
    amount = numAmount;
  }
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP', // Moneda colombiana, ajusta si es necesario
    minimumFractionDigits: 0, // No mostrar decimales si son 0
    maximumFractionDigits: 0, // No mostrar decimales si son 0
  }).format(amount);
};

const getStatusText = (status) => {
  switch (status) {
    case 'paid': return 'Pagado';
    case 'pending': return 'Pendiente';
    case 'refunded': return 'Reembolsado';
    case 'failed': return 'Fallido';
    default: return 'Desconocido';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'paid': return 'check_circle';
    case 'pending': return 'hourglass_empty';
    case 'refunded': return 'undo';
    case 'failed': return 'error';
    default: return 'help_outline';
  }
};
</script>

<style lang="scss" scoped>
/* Estilos globales de tu proyecto son accesibles, pero aquí definimos específicos para el componente */

.movements-viewer-page {
  background-color: var(--three-color--); // Usando tu variable global
  min-height: calc(100vh - var(--header-height, 0px) - var(--footer-height, 0px)); // Ajustar si tienes header/footer
  display: flex;
  flex-direction: column;
  align-items: center;
}

.page-title {
  color: var(--text-primary);
  font-weight: bold;
}

.empty-state {
  background-color: var(--one-color--);
  border-radius: 8px;
  box-shadow: var(--card-shadow);
  max-width: 600px;
  width: 100%;
}

.movements-list {
  max-width: 800px;
  width: 100%;
  background-color: transparent; // Quasar QList tiene un fondo por defecto, lo quitamos
  border: none;
}

.movement-item {
  padding: 0; // Quitar padding de q-item para que la card ocupe todo
  border-radius: 8px;
  overflow: hidden; // Asegura que los bordes redondeados se apliquen bien
}

.movement-card {
  background-color: var(--one-color--); // Fondo claro para la tarjeta
  box-shadow: var(--card-shadow); // Sombra global
  border-color: var(--border-color); // Borde global
  border-radius: 8px;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-3px);
  }
}

.movement-header {
  background-color: var(--two-color--); // Un color suave para el encabezado
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
}

.movement-id {
  font-family: monospace; // Para IDs, un monospace se ve bien
  font-size: 0.9em;
  opacity: 0.8;
}

.movement-details p {
  margin-bottom: 8px;
  color: var(--text-secondary);
}

.total-amount {
  color: var(--fiv-color--); // Usando tu color azul fuerte
}

/* Estilos para el estado del movimiento */
.status-paid {
  color: #28a745; // Verde para pagado
  font-weight: bold;
}
.status-pending {
  color: #ffc107; // Naranja para pendiente
  font-weight: bold;
}
.status-refunded {
  color: #dc3545; // Rojo para reembolsado
  font-weight: bold;
}
.status-failed {
  color: #6c757d; // Gris para fallido
  font-weight: bold;
}

.products-expansion {
  background-color: var(--one-color--);
  color: var(--text-primary);
  .q-item__section--side {
    color: var(--fiv-color--); // Color del icono de expansión
  }
}

.product-list-section {
  background-color: var(--one-color--); // Fondo de la sección de productos
  padding-top: 0; // Asegura que no haya doble padding si QCardSection ya lo tiene
}

.product-item {
  border-bottom: 1px dashed var(--border-color); // Línea punteada entre productos
  &:last-child {
    border-bottom: none; // No hay línea en el último producto
  }
}

.q-item__label.text-weight-bold {
  color: var(--text-primary);
}

.q-item__label.caption {
  color: var(--text-secondary);
}

.text-positive {
  color: #28a745; // Verde para descuentos
}
.text-strike {
  text-decoration: line-through;
}

/* Responsive adjustments */
@media (max-width: $breakpoint-xs-max) {
  .movement-header {
    flex-direction: column;
    align-items: flex-start;
    .text-subtitle1 {
      margin-top: 8px;
    }
  }
  .movement-details .col-md-6.text-right {
    text-align: left;
    margin-top: 16px;
  }
}
</style>