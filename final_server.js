const express = require('express');
const path = require('path');
const fsPromises = require('fs').promises;
const cors = require('cors');

// Dynamic import for node-fetch
let fetch;
(async () => {
  fetch = (await import('node-fetch')).default;
})();

// Paths to JSON files
const soilJsonFilePath = path.join(__dirname, 'soil_nutrients.json');
const cropJsonFilePath = path.join(__dirname, 'crop_nutrient.json');

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

// Create an Express application
const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// API endpoint to get nutrient deficiency
app.post('/api/deficiency', async (req, res) => {
  const { lat, lon, cropName } = req.body;

  if (!lat || !lon || !cropName) {
    return res.status(400).json({ error: 'Latitude, longitude, and crop name are required.' });
  }

  try {
    if (!fetch) {
      return res.status(500).json({ error: 'Fetch not initialized.' });
    }

    const response = await fetch(
      `https://api-test.openepi.io/soil/type?${new URLSearchParams({ lon, lat })}`
    );
    const json = await response.json();

    const responseTopK = await fetch(
      `https://api-test.openepi.io/soil/type?${new URLSearchParams({ lon, lat, top_k: '3' })}`
    );
    const jsonTopK = await responseTopK.json();

    if (jsonTopK.properties.probabilities.length >= 2) {
      const soilType2 = jsonTopK.properties.probabilities[1].soil_type;
      const probability2 = jsonTopK.properties.probabilities[1].probability;
      console.log(`Soil type: ${soilType2}, Probability: ${probability2}`);

      const soilData = await getSoilData(soilType2);
      const cropData = await getCropData(cropName);

      const comparisonResult = compareNutrients(soilData, cropData);
      const deficientNutrients = getDeficientNutrients(comparisonResult);
      res.json(deficientNutrients);
    } else {
      res.status(404).json({ error: 'Not enough data for top 2 soil types.' });
    }
  } catch (error) {
    console.error('Error fetching soil type:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(5001, () => {
  console.log('Server is running on http://localhost:3001');
});
