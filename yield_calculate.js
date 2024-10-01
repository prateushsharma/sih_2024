const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 5010;


// Middleware to parse JSON bodies
app.use(express.json());

// Load crop data from JSON file
const cropDataPath = path.join(__dirname, 'yield.json');
let cropData;

fs.readFile(cropDataPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading crop data file:', err);
    process.exit(1);
  }
  cropData = JSON.parse(data);
});

// Route to calculate yield
app.post('/calculate-yield', (req, res) => {
  const { cropName, areaHectares } = req.body;

  if (!cropName || !areaHectares) {
    return res.status(400).json({ error: 'Crop name and area in hectares are required.' });
  }

  const crop = cropData.crops.find(c => c.name.toLowerCase() === cropName.toLowerCase());
  
  if (!crop) {
    return res.status(404).json({ error: 'Crop not found.' });
  }

  // Calculate yield
  const yieldTons = areaHectares * crop.yield_tons_per_hectare;
  res.json({ yield: yieldTons });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
