import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { db, storage } from './../../dbConfig/firebase'; // Add storage import
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Add Firebase storage functions
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import CameraCapture from './CameraCapture'; // Import the new CameraCapture component

const PhotoUpload = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { eventId, userId } = location.state;
  const [files, setFiles] = useState([]);
  const [cameraPhotos, setCameraPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleCameraCapture = (dataUrl) => {
    setCameraPhotos((prevPhotos) => [...prevPhotos, dataUrl]);
  };

  const handleUpload = async () => {
    const totalPhotos = files.length + cameraPhotos.length;
    if (totalPhotos < 3) {
      setError('Please upload or capture at least 3 photos.');
      return;
    }
  
    setIsLoading(true);
    setError(null);
  
    const uploadedUrls = [];
    try {
      for (const file of files) {
        const storageRef = ref(storage, `events/${eventId}/attendees/${userId}/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        uploadedUrls.push(downloadURL);
      }
  
      for (const [index, dataUrl] of cameraPhotos.entries()) {
        const blob = await (await fetch(dataUrl)).blob();
        const storageRef = ref(storage, `events/${eventId}/attendees/${userId}/camera-photo-${index}.png`);
        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);
        uploadedUrls.push(downloadURL);
      }
  
      const attendeeRef = doc(db, 'Events', eventId, 'Event_Attendees', userId);
      await updateDoc(attendeeRef, {
        photos: arrayUnion(...uploadedUrls)
      });
  
      navigate('/event-confirmation', { state: { eventId, userId } });
    } catch (err) {
      console.error('Error uploading photos: ', err);
      setError('An error occurred while uploading photos.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 5, textAlign: 'center' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Upload Photos
      </Typography>
      <input type="file" multiple onChange={handleFileChange} />
      <CameraCapture onCapture={handleCameraCapture} />
      {isLoading ? (
        <CircularProgress />
      ) : (
        <Button variant="contained" color="primary" onClick={handleUpload}>
          Upload Photos
        </Button>
      )}
      {error && <Typography color="error">{error}</Typography>}
    </Box>
  );
};

export default PhotoUpload;
