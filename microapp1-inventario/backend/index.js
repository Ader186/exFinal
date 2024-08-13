const express = require('express');
const { Observable } = require('rxjs');
const app = express();
const port = 3002;
const bodyParser = require('body-parser');
app.use(bodyParser.json());

// Simulación de inventario
let inventory = {
  'product-123': { name: 'Laptop', stock: 10 },
  'product-456': { name: 'Smartphone', stock: 5 },
};

// Listar productos
app.get('/api/inventory', (req, res) => {
  // Crear un Observable para manejar el flujo de datos
  const observable = new Observable(subscriber => {
    subscriber.next(Object.values(inventory));
    subscriber.complete();
  });

  observable.subscribe({
    next: data => res.json(data),
    error: err => res.status(500).send(err.message),
  });
});

// Añadir un producto
app.post('/api/inventory', (req, res) => {
  const { id, name, stock } = req.body;

  // Crear un Observable para manejar el flujo de datos
  const observable = new Observable(subscriber => {
    inventory[id] = { name, stock };
    subscriber.next(inventory[id]);
    subscriber.complete();
  });

  observable.subscribe({
    next: data => res.status(201).json(data),
    error: err => res.status(500).send(err.message),
  });
});

// Actualizar un producto
app.put('/api/inventory/:id', (req, res) => {
  const id = req.params.id;
  const { name, stock } = req.body;

  const observable = new Observable(subscriber => {
    if (inventory[id]) {
      inventory[id] = { name, stock };
      subscriber.next(inventory[id]);
    } else {
      subscriber.error(new Error('Producto no encontrado'));
    }
    subscriber.complete();
  });

  observable.subscribe({
    next: data => res.json(data),
    error: err => res.status(404).send(err.message),
  });
});

// Eliminar un producto
app.delete('/api/inventory/:id', (req, res) => {
  const id = req.params.id;

  const observable = new Observable(subscriber => {
    if (inventory[id]) {
      delete inventory[id];
      subscriber.next();
    } else {
      subscriber.error(new Error('Producto no encontrado'));
    }
    subscriber.complete();
  });

  observable.subscribe({
    next: () => res.status(204).send(),
    error: err => res.status(404).send(err.message),
  });
});

app.listen(port, () => {
  console.log(`Microapp de Gestión de Inventarios corriendo en http://localhost:${port}`);
});
