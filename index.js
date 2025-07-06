const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

const products = [];


const isValidStatus = (status) => {
  return ['in-stock', 'low-stock', 'out-of-stock'].includes(status);
};


app.get('/products', (req, res) => {
  res.json(products);
});


app.get('/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
});


app.post('/products', (req, res) => {
  const { productName, cost, stockStatus } = req.body;
  if (!isValidStatus(stockStatus)) {
    return res.status(400).json({ message: "Invalid stock status" });
  }

  const newProduct = {
    id: Math.floor(Math.random() * 100000),
    productName,
    cost,
    stockStatus,
    createdAt: new Date().toISOString()
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

// PATCH edit product (not stockStatus)
app.patch('/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ message: "Product not found" });

  const { productName, cost } = req.body;
  if (productName !== undefined) product.productName = productName;
  if (cost !== undefined) product.cost = cost;

  res.json(product);
});

// PATCH update stockStatus only
app.patch('/products/:id/:status', (req, res) => {
  const { id, status } = req.params;
  const product = products.find(p => p.id === parseInt(id));
  if (!product) return res.status(404).json({ message: "Product not found" });

  if (!isValidStatus(status)) {
    return res.status(400).json({ message: "Invalid stock status" });
  }

  product.stockStatus = status;
  res.json(product);
});


app.delete('/products/:id', (req, res) => {
  const index = products.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: "Product not found" });

  products.splice(index, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
