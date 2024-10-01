const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 5000;

// Middleware to parse JSON bodies
app.use(express.json());

// Load crop yield data from JSON file
const cropDataPath = path.join(__dirname, 'yield.json');
let cropData;

fs.readFile(cropDataPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading crop data file:', err);
    process.exit(1);
  }
  cropData = JSON.parse(data);
});

// Load price data from JSON file
const priceDataPath = path.join(__dirname, 'crop_price.json');
let records;

fs.readFile(priceDataPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading price data file:', err);
    process.exit(1);
  }
  records = JSON.parse(data).records;
});

// Route to calculate yield and query price details
app.post('/calculate-details', (req, res) => {
  const { state, district, commodityName, areaHectares } = req.body;
  
  if (!state || !district || !commodityName || !areaHectares) {
    return res.status(400).json({ error: 'State, district, commodity name, and area in hectares are required.' });
  }

  // Log the request data
  console.log('Request data:', { state, district, commodityName, areaHectares });

  const crop = cropData.crops.find(c => c.name.toLowerCase() === commodityName.toLowerCase());

  if (!crop) {
    return res.status(404).json({ error: 'Crop not found in yield data.' });
  }

  // Log crop data
  console.log('Crop data:', crop);

  const yieldTons = areaHectares * crop.yield_tons_per_hectare;

  const record = records.find(r =>
    r.state.toLowerCase() === state.toLowerCase() &&
    r.district.toLowerCase() === district.toLowerCase() &&
    r.commodity.toLowerCase() === commodityName.toLowerCase()
  );

  if (!record) {
    // Log records data for debugging
    console.log('Price data records:', records);
    return res.status(404).json({ error: 'Record not found in price data.' });
  }

  // Log record data
  console.log('Price data record:', record);

  const totalPrice = yieldTons * parseFloat(record.modal_price);

  res.json({
    marketPrice: record.modal_price,
    totalYield: yieldTons,
    totalPrice: totalPrice.toFixed(2)
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
