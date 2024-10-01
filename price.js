const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 5010;

// Middleware to parse JSON bodies
app.use(express.json());

// Load data from JSON file
const dataFilePath = path.join(__dirname, 'crop_price.json'); // Adjust the filename if needed
let records;

fs.readFile(dataFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading data file:', err);
    process.exit(1);
  }
  records = JSON.parse(data).records; // Use 'records' instead of 'crops'
  console.log('Loaded records:', records); // Debug log
});

// Route to query details
app.post('/query-details', (req, res) => {
  const { state, district, commodityName } = req.body;

  if (!state || !district || !commodityName) {
    return res.status(400).json({ error: 'State, district, and commodity name are required.' });
  }

  // Find the record that matches the given state, district, and commodity name
  const record = records.find(r =>
    r.state.toLowerCase() === state.toLowerCase() &&
    r.district.toLowerCase() === district.toLowerCase() &&
    r.commodity.toLowerCase() === commodityName.toLowerCase()
  );

  if (!record) {
    return res.status(404).json({ error: 'Record not found.' });
  }

  // Return the record details
  res.json(record.max_price);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
