import React, { useState, useEffect } from "react";
import axios from 'axios';
import '../diseaseDetection/diseaseDetection.scss';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function FertilizerRequired() {
  const [getCurrLocation, setCurrLocation] = useState({});
  const [selectedCrop, setSelectedCrop] = useState('');
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState({});

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const currLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrLocation({ latitude, longitude });
        },
        (error) => {
          let errorMsg = '';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMsg = "User denied the request for Geolocation.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMsg = "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              errorMsg = "The request to get user location timed out.";
              break;
            case error.UNKNOWN_ERROR:
              errorMsg = "An unknown error occurred.";
              break;
            default:
              errorMsg = "An unexpected error occurred.";
          }
          setCurrLocation({ error: errorMsg });
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      setCurrLocation({ error: "Geolocation is not supported by this browser." });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!selectedCrop) {
      alert('Please select a crop!');
      return;
    }

    const newData = {
      lat: String(getCurrLocation.latitude),
      lon: String(getCurrLocation.longitude),
      cropName: selectedCrop
    };

    console.log(newData);

    axios.post('http://localhost:5005/api/deficiency', newData)
      .then(response => {
        alert('Details submitted successfully!');
        console.log(response.data);
        setResult(response.data);
        handleClickOpen();
      })
      .catch(error => {
        alert('Error submitting details');
        console.error('There was an error submitting the details!', error);
      });
  };

  useEffect(() => {
    currLocation();
  }, []);

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Results"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {/* {Object.keys(result).map(key => (
              <div key={key}>
                {key}: {result[key]}
              </div>
            ))} */}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button onClick={handleClose} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
      <div className="image-upload-container">
        <p>Your current location:
          {getCurrLocation.error ? (
            <span>{getCurrLocation.error}</span>
          ) : (
            <span>Latitude: {getCurrLocation.latitude}, Longitude: {getCurrLocation.longitude}</span>
          )}
        </p>
        <form onSubmit={handleSubmit}>
          <label>
            Select the type of crop you want to grow:
          </label>
          <select value={selectedCrop} onChange={(e) => setSelectedCrop(e.target.value)}>
            <option value="">Select a crop</option>
            <option value="wheat">Wheat</option>
            <option value="rice">Rice</option>
            <option value="maize">Maize</option>
            <option value="barley">Barley</option>
          </select>
          <button type="submit" className="submit-button">Submit</button>
        </form>
      </div>
    </>
  );
}
