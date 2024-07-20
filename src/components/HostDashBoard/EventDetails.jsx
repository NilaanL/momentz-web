import React, { useState } from 'react';
import { db, storage } from './../../dbConfig/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { TextField, Button, Typography, Grid, Box, IconButton, CircularProgress } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './EventDetails.css';

const EventDetails = ({ event }) => {
  const [name, setName] = useState(event.name);
  const [description, setDescription] = useState(event.description);
  const [startDate, setStartDate] = useState(event.start_date.toDate().toISOString().slice(0, -8));
  const [endDate, setEndDate] = useState(event.end_date.toDate().toISOString().slice(0, -8));
  const [imageUrl, setImageUrl] = useState(event.image_url);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async () => {
    if (imageFile) {
      setLoading(true);
      const storageRef = ref(storage, `eventImages/${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      const downloadURL = await getDownloadURL(storageRef);
      setImageUrl(downloadURL);
      setLoading(false);
      toast.success('Image uploaded successfully!');
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    const eventRef = doc(db, 'Events', event.id);
    await updateDoc(eventRef, {
      name,
      description,
      start_date: new Date(startDate),
      end_date: new Date(endDate),
      image_url: imageUrl,
    });
    setLoading(false);
    toast.success('Event details updated successfully!');
  };

  return (
    <div className="event-details-container">
      <ToastContainer />
      <Typography variant="h4" component="h2" className="event-details-title">Edit Event Details</Typography>
      <Box component="form" noValidate autoComplete="off">
        <TextField
          label="Event Name"
          fullWidth
          margin="normal"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Description"
          fullWidth
          margin="normal"
          variant="outlined"
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          label="Start Date"
          type="datetime-local"
          fullWidth
          margin="normal"
          variant="outlined"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="End Date"
          type="datetime-local"
          fullWidth
          margin="normal"
          variant="outlined"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Box className="image-upload-section">
          <Typography variant="subtitle1">Event Image</Typography>
          <img src={imageUrl} alt={name} className="event-image" />
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="icon-button-file"
            type="file"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
          <label htmlFor="icon-button-file">
            <IconButton color="primary" aria-label="upload picture" component="span">
              <PhotoCamera />
            </IconButton>
          </label>
          {imageFile && (
            <Button variant="contained" color="primary" onClick={handleImageUpload} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Upload Image'}
            </Button>
          )}
        </Box>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleUpdate}
          disabled={loading}
          className="update-button"
        >
          {loading ? <CircularProgress size={24} /> : 'Update Event'}
        </Button>
      </Box>
    </div>
  );
};

export default EventDetails;