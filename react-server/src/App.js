import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [image, setImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert("Please upload an image first.");
      return;
    }

    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await axios.post('http://localhost:5001/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Print the JSON response to the console
      console.log('Prediction Result:', response.data);

      // Update state to display prediction
      setPrediction(response.data);
    } catch (error) {
      console.error('Error uploading image or predicting:', error);
      setError('Error uploading image or predicting.');
    }
  };

  return (
    <div className="App">
      <h1>Image Prediction App</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleImageChange} 
        />
        <button type="submit">Submit</button>
      </form>
      
      {prediction && (
        <div>
          <h2>Prediction Result:</h2>
          <pre>{JSON.stringify(prediction, null, 2)}</pre>
        </div>
      )}

      {error && (
        <div>
          <h2>Error:</h2>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}

export default App;
