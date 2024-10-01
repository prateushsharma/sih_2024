import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fetch from 'node-fetch';
import { promises as fsPromises } from 'fs';
import readline from 'readline';

// Determine the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Paths to JSON files
const soilJsonFilePath = join(__dirname, 'soil_nutrients.json');
const cropJsonFilePath = join(__dirname, 'crop_nutrient.json');

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

  // Convert soil nitrogen to ppm and compare
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

// Fetch the most probable soil type at the queried location
const fetchSoilType = async (lat, lon) => {
  try {
    // Fetch the most probable soil type
    const response = await fetch(
      `https://api-test.openepi.io/soil/type?${new URLSearchParams({ lon, lat })}`
    );
    const json = await response.json();

    // Fetch the top 3 most probable soil types and their probabilities
    const responseTopK = await fetch(
      `https://api-test.openepi.io/soil/type?${new URLSearchParams({ lon, lat, top_k: '3' })}`
    );
    const jsonTopK = await responseTopK.json();

    // Get the soil type and probability for the second most probable soil type
    if (jsonTopK.properties.probabilities.length >= 2) {
      const soilType2 = jsonTopK.properties.probabilities[1].soil_type;
      const probability2 = jsonTopK.properties.probabilities[1].probability;
      console.log(`Soil type: ${soilType2}, Probability: ${probability2}`);
      
      // Get soil data for the second most probable soil type
      const soilData = await getSoilData(soilType2);

      // Ask for crop name and fetch crop data
      const cropName = await askQuestion('Enter crop name: ');
      const cropData = await getCropData(cropName);
      
      // Compare nutrients
      const comparisonResult = compareNutrients(soilData, cropData);
      console.log('Nutrient comparison:', comparisonResult);
    } else {
      console.log('Not enough data for top 2 soil types.');
    }
  } catch (error) {
    console.error('Error fetching soil type:', error);
  }
};

// Function to prompt user input
const askQuestion = (question) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => rl.question(question, (answer) => {
    rl.close();
    resolve(answer);
  }));
};

// Main function to execute
const main = async () => {
  try {
    // Prompt for latitude and longitude
    const lat = await askQuestion('Enter latitude: ');
    const lon = await askQuestion('Enter longitude: ');

    // Fetch soil type and compare nutrients
    await fetchSoilType(lat, lon);
  } catch (error) {
    console.error('Error in main execution:', error);
  }
};

// Run the main function
main();
