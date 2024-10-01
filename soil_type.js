(async () => {
    const { default: fetch } = await import('node-fetch');
  
    // Fetch the most probable soil type at the queried location
    async function fetchSoilType(lat, lon) {
      try {
        const response = await fetch(
          "https://api-test.openepi.io/soil/type?" + new URLSearchParams({
            lon: lon,
            lat: lat,
          })
        );
        const json = await response.json();
  
        // Get the most probable soil type
        const mostProbableSoilType = json.properties.most_probable_soil_type;
        console.log(`Most probable soil type: ${mostProbableSoilType}`);
  
        // Fetch the top 3 most probable soil types and their probabilities
        const responseTopK = await fetch(
          "https://api-test.openepi.io/soil/type?" + new URLSearchParams({
            lon: lon,
            lat: lat,
            top_k: "3"
          })
        );
        const jsonTopK = await responseTopK.json();
  
        // Get the soil type and probability for the second most probable soil type
        if (jsonTopK.properties.probabilities.length >= 2) {
          const soilType2 = jsonTopK.properties.probabilities[1].soil_type;
          const probability2 = jsonTopK.properties.probabilities[1].probability;
          console.log(`Soil type: ${soilType2}, Probability: ${probability2}`);
        } else {
          console.log('Not enough data for top 2 soil types.');
        }
      } catch (error) {
        console.error('Error fetching soil type:', error);
      }
    }
  
    // Call the function with the desired latitude and longitude
    fetchSoilType("23.7", "86.4");
  })();
  