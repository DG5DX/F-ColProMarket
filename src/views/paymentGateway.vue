<template>
    <div class="payment-container">
      <div class="progress-bar">
        <div v-for="(step, index) in steps" :key="index" class="step">
          <div class="circle" :class="{ active: index <= currentStep }"></div>
          <p>{{ step }}</p>
        </div>
      </div>
  
      <div class="payment-box">
        <h3>Método de pago</h3>
        <hr />
        <p>Escoja su método de pago</p>
        <div class="methods">
          <button v-for="method in paymentMethods" :key="method.label" class="method-btn">
            <span>{{ method.icon }}</span>
            <p>{{ method.label }}</p>
          </button>
        </div>
  
        <div class="card-details">
          <input type="text" placeholder="Número tarjeta" />
          <input type="text" placeholder="Fecha de expiración" />
          <input type="text" placeholder="CVV" />
        </div>
  
        <button class="buy-btn">Comprar</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        currentStep: 3,
        steps: ["Datos personales", "Dirección envío", "Dirección llegada", "Método de pago"],
        paymentMethods: [
          { label: "Tarjeta de crédito", icon: "💳" },
          { label: "PayPal", icon: "🅿️" },
          { label: "Contra-entrega", icon: "📦" },
        ],
      };
    },
  };
  </script>
  
  <style scoped>
  .payment-container {
    max-width: 800px;
    margin: auto;
    background: #f5f5f5;
    padding: 2rem;
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
  
  input {
    padding: 0.5rem;
    border-radius: 5px;
    border: 1px solid #ccc;
  }
  
  .buy-btn {
    background: #3f51b5;
    color: white;
    padding: 0.7rem 2rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
  }
  
  .buy-btn:hover {
    background: #2c3e94;
  }
  </style>
  