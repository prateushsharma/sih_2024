// import React, { useState,useEffect } from "react";
// import axios from "axios";
// import '../diseaseDetection/diseaseDetection.scss';


// export default function YieldDetection() {

  

//   useEffect(() => {
    
//   }
//   ,[]);


//   const handleSubmit = (event) => {
//     event.preventDefault();

//     // const formData = new FormData();
//     // formData.append('lat', getCurrLocation[0]);
//     // formData.append('lon', getCurrLocation[1]);
//     // formData.append('crop', selectedCrop);
//     const newData=({'state':});

//     console.log(newData)

//     axios.post('http://localhost:5005/api/deficiency', newData)
//     .then(response => {
//       alert('Details submitted successfully!');
//       console.log(response.data);
//       // Handle the response data as needed
//     })
//     .catch(error => {
//       alert('Error submitting details');
//       console.error('There was an error submitting the details!', error);
//     });
//   };


//     return (
//         <div className="image-upload-container">
//           <form onSubmit={handleSubmit}>
//             <label for="crop-type">Select the type of crop you want to grow:</label>
//             <select id="crop-type" name="crop-type">
//               <option value="wheat">Wheat</option>
//               <option value="rice">Rice</option>
//               <option value="maize">Maize</option>
//               <option value="barley">Barley</option>
//             </select>
//             <br></br>

//             <label for="area">Input the Area (Hectares) of the land:</label>
//             <input type="number" id="area" name="area" required/>

//             <br></br>

//             <label for="state">Input the state:</label>
//             <input type="text" id="state" name="state" required/>

//             <br></br>

//             <label for="district">Give your current District:</label>
//             <input type="text" id="district" name="district" required/>

//             <br></br>

//             <button type="submit" className="submit-button">Submit</button>
//           </form>
//         </div>
//       );
// }

import React, { useState, useEffect } from "react";
import axios from "axios";
import '../diseaseDetection/diseaseDetection.scss';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function YieldDetection() {
  // State to store form data
  const [formData, setFormData] = useState({
    commodityName: '',
    areaHectares: '',
    state: '',
    district: ''
  });

  const [open, setOpen] = useState(false);
  

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // setFormData({...formData,areaHectares:parseInt(formData.areaHectares)});

    // Create a FormData object
    // const formDataToSend = new FormData();
    // Object.keys(formData).forEach(key => {
    //   formDataToSend.append(key, formData[key]);
    // });

    console.log('FormData submitted:', formData);

    axios.post('http://localhost:5005/calculate-details', formData )
    .then(response => {
      alert('Details submitted successfully!');
      console.log(response.data);
      // Handle the response data as needed
    })
    .catch(error => {
      alert('Error submitting details');
      console.error('There was an error submitting the details!', error);
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
            Working
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
        <label htmlFor="crop-type">Select the type of crop you want to grow:</label>
        <select
          id="crop-type"
          name="commodityName"
          value={formData.commodityName}
          onChange={handleChange}
        >
          <option value="">Select a crop</option>
          <option value="Wheat">Wheat</option>
          <option value="Rice">Rice</option>
          <option value="Maize">Maize</option>
          <option value="Barley">Barley</option>
          <option value="Mango">Mango</option>
        </select>
        <br />

        <label htmlFor="areaHectares">Input the Area (Hectares) of the land:</label>
        <input
          type="number"
          id="areaHectares"
          name="areaHectares"
          value={formData.areaHectares}
          onChange={handleChange}
          required
        />
        <br />

        <label htmlFor="state">Input the state:</label>
        <input
          type="text"
          id="state"
          name="state"
          value={formData.state}
          onChange={handleChange}
          required
        />
        <br />

        <label htmlFor="district">Give your current District:</label>
        <input
          type="text"
          id="district"
          name="district"
          value={formData.district}
          onChange={handleChange}
          required
        />
        <br />

        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
    </>
  );
}
