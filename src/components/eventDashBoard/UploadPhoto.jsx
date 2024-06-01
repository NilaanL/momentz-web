// UploadPhoto.jsx

import React, { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from './../../dbConfig/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Box, Button, CircularProgress, Typography } from '@mui/material';

const UploadPhoto = ({ eventId }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    setIsUploading(true);

    try {
      const userId = auth.currentUser ? auth.currentUser.uid : 'test-user';
      const fileRef = ref(storage, `events/${eventId}/photos/${file.name}`);
      await uploadBytes(fileRef, file);
      const photoUrl = await getDownloadURL(fileRef);

      await addDoc(collection(db, 'Photos'), {
        event_id: eventId,
        user_id: userId,
        upload_date: serverTimestamp(),
        photo_url: photoUrl,
        faces: [], // Assuming faces are detected and added later
      });

      setFile(null);
    } catch (err) {
      console.error('Error uploading photo: ', err);
      setError(err.message || 'An error occurred while uploading the photo.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Upload Photo
      </Typography>
      <input type="file" onChange={handleFileChange} />
      <Button variant="contained" color="primary" onClick={handleUpload} disabled={isUploading}>
        {isUploading ? <CircularProgress size={24} /> : 'Upload'}
      </Button>
      {error && <Typography color="error">{error}</Typography>}
    </Box>
  );
};

export default UploadPhoto;
