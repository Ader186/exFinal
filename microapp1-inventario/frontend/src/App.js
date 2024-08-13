// inventory-frontend/src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ id: '', name: '', stock: 0 });

  useEffect(() => {
    axios.get('http://localhost:3002/api/inventory')
      .then(response => setProducts(response.data))
      .catch(error => console.error(error));
  }, []);

  const addProduct = () => {
    axios.post('http://localhost:3002/api/inventory', newProduct)
      .then(response => {
        setProducts([...products, response.data]);
        setNewProduct({ id: '', name: '', stock: 0 });
      })
      .catch(error => console.error(error));
  };

  return (
    <div>
      <h1>Gestión de Inventarios</h1>
      <ul>
        {products.map(product => (
          <li key={product.id}>{product.name} - {product.stock}</li>
        ))}
      </ul>
      <h2>Agregar Producto</h2>
      <input 
        type="text" 
        placeholder="ID" 
        value={newProduct.id} 
        onChange={e => setNewProduct({ ...newProduct, id: e.target.value })} 
      />
      <input 
        type="text" 
        placeholder="Nombre" 
        value={newProduct.name} 
        onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} 
      />
      <input 
        type="number" 
        placeholder="Stock" 
        value={newProduct.stock} 
        onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} 
      />
      <button onClick={addProduct}>Agregar</button>
    </div>
  );
}

export default App;
