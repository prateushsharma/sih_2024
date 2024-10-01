const express = require('express');
const fs = require('fs');
const path = require('path');
const fsPromises = require('fs').promises;
const cors = require('cors');

// Initialize the Express app
const app = express();
const port = 5005;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// Paths to JSON files
const cropDataPath = path.join(__dirname, 'yield.json');
const priceDataPath = path.join(__dirname, 'crop_price.json');
const soilJsonFilePath = path.join(__dirname, 'soil_nutrients.json');
const cropJsonFilePath = path.join(__dirname, 'crop_nutrient.json');

// Load data from JSON files
let cropData, records;

// Load crop yield data
fs.readFile(cropDataPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading crop data file:', err);
    process.exit(1);
  }
  cropData = JSON.parse(data);
});

// Load price data
fs.readFile(priceDataPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading price data file:', err);
    process.exit(1);
  }
  records = JSON.parse(data).records;
});

// Function to read JSON file
const readJsonFile = async (filePath) => {
  try {
    const data = await fsPromises.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading JSON file:', err);
    return {};
  }
};

// Function to get soil data
const getSoilData = async (soilName) => {
  const soilData = await readJsonFile(soilJsonFilePath);
  return soilData[soilName] || 'Soil name not found';
};

// Function to get crop data
const getCropData = async (cropName) => {
  const cropData = await readJsonFile(cropJsonFilePath);
  return cropData[cropName] || 'Crop name not found';
};

// Function to compare soil and crop nutrients
const compareNutrients = (soilData, cropData) => {
  const result = {};
  if (soilData === 'Soil name not found' || cropData === 'Crop name not found') {
    return 'Soil or crop data not found';
  }
  const nutrientKeys = ['P', 'K', 'S'];
  result['N'] = {
    soil: soilData['N'],
    crop: cropData['N'],
  };
  nutrientKeys.forEach((key) => {
    result[key] = {
      soil: parseFloat(soilData[key].match(/[\d.]+/)[0]) / 10000,
      crop: cropData[key],
    };
  });
  return result;
};

// Function to get deficient nutrients
const getDeficientNutrients = (comparisonResult) => {
  const deficientNutrients = {};
  for (const [nutrient, values] of Object.entries(comparisonResult)) {
    if (values.soil && values.crop) {
      const soilValue = typeof values.soil === 'string' ? parseFloat(values.soil.replace('%', '')) : values.soil;
      const cropValue = typeof values.crop === 'string' ? parseFloat(values.crop.replace('%', '')) : values.crop;
      if (soilValue < cropValue) {
        const deficiencyPercentage = cropValue - soilValue;
        deficientNutrients[nutrient] = {
          deficiency: deficiencyPercentage.toFixed(2) + '%'
        };
      }
    }
  }
  return deficientNutrients;
};

// Route to calculate yield and query price details
app.post('/calculate-details', (req, res) => {
  const { state, district, commodityName, areaHectares } = req.body;
console.log(req.body);
  if (!state || !district || !commodityName || !areaHectares) {
    console.log("Hello");
    return res.status(400).json({ error: 'State, district, commodity name, and area in hectares are required.' });
  }
  

  // Find the crop record for yield calculation
  const crop = cropData.crops.find(c => c.name.toLowerCase() === commodityName.toLowerCase());

  if (!crop) {
    console.log("hello");
    return res.status(404).json({ error: 'Crop not found in yield data.' });
  }

  // Calculate yield
  const yieldTons = areaHectares * crop.yield_tons_per_hectare;

  // Find the record for market price
  const record = records.find(r =>
    r.state.toLowerCase() === state.toLowerCase() &&
    r.district.toLowerCase() === district.toLowerCase() &&
    r.commodity.toLowerCase() === commodityName.toLowerCase()
  );

  if (!record) {
    console.log("hello");
    return res.status(404).json({ error: 'Record not found in price data.' });
  }

  // Calculate total price
  const totalPrice = yieldTons * parseFloat(record.modal_price);

  // Return the details
  res.json({
    marketPrice: record.modal_price,
    totalYield: yieldTons,
    totalPrice: totalPrice.toFixed(2)
  });
});

// API endpoint to get nutrient deficiency
app.post('/api/deficiency', async (req, res) => {
  const { lat, lon, cropName } = req.body;
  console.log(req.body);

  if (!lat || !lon || !cropName) {
    return res.status(400).json({ error: 'Latitude, longitude, and crop name are required.' });
  }

  try {
    // Dynamic import for node-fetch
    const fetch = (await import('node-fetch')).default;

    const response = await fetch(
      `https://api-test.openepi.io/soil/type?${new URLSearchParams({ lon, lat })}`
    );
    const json = await response.json();

    const responseTopK = await fetch(
      `https://api-test.openepi.io/soil/type?${new URLSearchParams({ lon, lat, top_k: '3' })}`
    );
    const jsonTopK = await responseTopK.json();

    if (jsonTopK.properties.probabilities.length >= 2) {
     // Include soil type in the response
const soilType2 = jsonTopK.properties.probabilities[1].soil_type;
const probability2 = jsonTopK.properties.probabilities[1].probability;
console.log(`Soil type: ${soilType2}, Probability: ${probability2}`);

const soilData = await getSoilData(soilType2);
const cropData = await getCropData(cropName);

const comparisonResult = compareNutrients(soilData, cropData);
const deficientNutrients = getDeficientNutrients(comparisonResult);

// Construct the response object with soil type and nutrient deficiencies
const response = {
  soilType: soilType2,
  nutrients: deficientNutrients
};

// Send the response
res.json(response);

    } else {
      res.status(404).json({ error: 'Not enough data for top 2 soil types.' });
    }
  } catch (error) {
    console.error('Error fetching soil type:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
