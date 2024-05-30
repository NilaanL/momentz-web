import React, { useState } from 'react';
import { storage } from '../../dbConfig/firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { Box, Button, LinearProgress, Typography } from '@mui/material';

function UploadEventImage({ onImageUpload }) {
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = (e) => {
    e.preventDefault(); // Prevent form submission if button is inside a form

    if (!image) return;

    const storageRef = ref(storage, `eventImages/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgress(prog);
      },
      (error) => console.log(error),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          onImageUpload(downloadURL); // Pass the download URL back to the parent
        });
      }
    );
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Button variant="contained" component="label">
        Choose Image
        <input type="file" hidden onChange={handleChange} />
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleUpload}
        sx={{ ml: 2 }}
        disabled={!image}
      >
        Upload Image
      </Button>
      {progress > 0 && (
        <Box sx={{ mt: 2, width: '100%' }}>
          <LinearProgress variant="determinate" value={progress} />
          <Typography variant="body2" color="textSecondary">{`Uploaded ${progress}%`}</Typography>
        </Box>
      )}
    </Box>
  );
}

export default UploadEventImage;
