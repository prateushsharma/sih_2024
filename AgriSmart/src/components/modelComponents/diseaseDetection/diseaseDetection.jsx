import React, { useState } from 'react';
import axios from 'axios';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import './diseaseDetection.scss'; // Import the SCSS file

const DiseaseDetection = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const [open, setOpen] = useState(false);
  const [result,setResult] = useState({});

  const [prediction,setPrediction] = useState();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!selectedFile) {
      alert('Please select a file first!');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    axios.post('http://localhost:5010/predict', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(response => {
      alert('Image uploaded successfully!');
      console.log(response.data);

      setPrediction(response.data);
      handleClickOpen();
    })
    .catch(error => {
      alert('Error uploading image');
      console.error('There was an error uploading the image!', error);
    });
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Use Google's location service?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {prediction.prediction}
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
      <form onSubmit={handleSubmit}>
        <label htmlFor="image-upload" className="upload-label">
          Upload an image of the soil: 
          <input
            type="file"
            id="image-upload"
            name="image"
            accept="image/*"
            className="upload-input"
            onChange={handleFileChange}
          />
        </label>
        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
    </>
  );
};

export default DiseaseDetection;
