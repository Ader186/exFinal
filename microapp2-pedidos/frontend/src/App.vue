<!-- orders-frontend/src/App.vue -->
<template>
  <div>
    <h1>Gestión de Pedidos</h1>
    <input v-model="productId" placeholder="ID del producto" />
    <input v-model="quantity" type="number" placeholder="Cantidad" />
    <button @click="createOrder">Crear Pedido</button>
    <h2>Pedidos</h2>
    <ul>
      <li v-for="order in orders" :key="order.id">
        Pedido #{{ order.id }}: Producto ID {{ order.productId }} - Cantidad {{ order.quantity }} - Estado {{ order.status }}
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      productId: '',
      quantity: '',
      orders: []
    };
  },
  methods: {
    createOrder() {
      axios.post('http://localhost:3003/api/orders', {
        productId: this.productId,
        quantity: this.quantity
      })
      .then(response => {
        this.orders.push(response.data);
        this.productId = '';
        this.quantity = '';
      })
      .catch(error => console.error(error));
    }
  },
  mounted() {
    axios.get('http://localhost:3003/api/orders')
      .then(response => this.orders = response.data)
      .catch(error => console.error(error));
  }
};
</script>
