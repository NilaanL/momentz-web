import React, { useState } from 'react';
import { storage, db } from './../../dbConfig/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { Box, Button, CircularProgress } from '@mui/material';

const UploadPhoto = ({ eventId, userId }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setLoading(true);
    try {
      const uploadPromises = files.map(async (file) => {
        const storageRef = ref(storage, `event_photos/${eventId}/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        await addDoc(collection(db, 'Photos'), {
          event_id: eventId,
          user_id: userId,
          upload_date: Timestamp.now(),
          photo_url: downloadURL,
          faces: [], // This can be populated later with detected face IDs
        });
      });

      await Promise.all(uploadPromises);
      alert('Photos uploaded successfully!');
      setFiles([]);
    } catch (error) {
      console.error('Error uploading photos: ', error);
      alert('Error uploading photos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <input type="file" multiple onChange={handleFileChange} />
      <Button variant="contained" color="primary" onClick={handleUpload} disabled={loading || files.length === 0}>
        {loading ? <CircularProgress size={24} /> : 'Upload Photos'}
      </Button>
    </Box>
  );
};

export default UploadPhoto;
