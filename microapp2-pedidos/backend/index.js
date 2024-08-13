const express = require('express');
const { Observable } = require('rxjs');
const app = express();
const port = 3003;
const bodyParser = require('body-parser');
app.use(bodyParser.json());

// Simulación de pedidos
let orders = [];
let orderId = 1;

// Crear un pedido
app.post('/api/orders', (req, res) => {
  const { productId, quantity } = req.body;

  // Crear un Observable para manejar el flujo de datos
  const observable = new Observable(subscriber => {
    const newOrder = {
      id: orderId++,
      productId,
      quantity,
      status: 'Pending'
    };
    orders.push(newOrder);
    subscriber.next(newOrder);
    subscriber.complete();
  });

  observable.subscribe({
    next: data => res.status(201).json(data),
    error: err => res.status(500).send(err.message),
  });
});

// Listar pedidos
app.get('/api/orders', (req, res) => {
  const observable = new Observable(subscriber => {
    subscriber.next(orders);
    subscriber.complete();
  });

  observable.subscribe({
    next: data => res.json(data),
    error: err => res.status(500).send(err.message),
  });
});

// Consultar un pedido
app.get('/api/orders/:id', (req, res) => {
  const id = parseInt(req.params.id);

  const observable = new Observable(subscriber => {
    const order = orders.find(o => o.id === id);
    if (order) {
      subscriber.next(order);
    } else {
      subscriber.error(new Error('Pedido no encontrado'));
    }
    subscriber.complete();
  });

  observable.subscribe({
    next: data => res.json(data),
    error: err => res.status(404).send(err.message),
  });
});

app.listen(port, () => {
  console.log(`Microapp de Gestión de Pedidos corriendo en http://localhost:${port}`);
});
