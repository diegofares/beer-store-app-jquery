import express from "express";
import { fileURLToPath } from 'url';
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//const express = require('express');
const app = express();
//const path = require('path');

// const stockData = require('./stock-price.js');
import stockData from './stock-price.js';


// app.use(express.static('/public'));
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/public/img')));
app.use(express.static(path.join(__dirname, '/node_modules/axios')));
app.use(express.static('public'));


// API endpoint for getting stock and price information
app.get('/api/stockprice/:code', (req, res) => {
  const stockCode = req.params.code.toUpperCase();

  // Check if stock code exists in the mock data
  if (stockData.hasOwnProperty(stockCode)) {
    const stockInfo = stockData[stockCode];
    res.json(stockInfo);
  } else {
    res.status(404).json({ error: 'Stock code not found' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
  // res.sendFile('/public/index.html');
});
app.get('/:pidbrand', (req, res) => {
  const id = req.params.pidbrand.match(/\d+/g);
  const model = req.params.pidbrand.match(/[a-zA-Z]+/g); 
  res.sendFile(path.join(__dirname, '/public/product-page.html'), { id: id, model: model });
});



// Start the server
const port = 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});