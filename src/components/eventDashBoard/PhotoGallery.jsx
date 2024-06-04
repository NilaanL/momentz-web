import React, { useEffect, useState } from 'react';
import { db } from './../../dbConfig/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Grid, Box, Typography, Button } from '@mui/material';

const PhotoGallery = ({ eventId, userId }) => {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const fetchPhotos = async () => {
      const photosQuery = query(collection(db, 'Photos'), where('event_id', '==', eventId));
      const photosSnapshot = await getDocs(photosQuery);
      const photosList = photosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPhotos(photosList);
    };

    fetchPhotos();
  }, [eventId]);

  const handleDownload = (url) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = 'event_photo.jpg'; // You can customize the file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        Photo Gallery
      </Typography>
      <Grid container spacing={2}>
        {photos.map(photo => (
          <Grid item xs={12} sm={6} md={4} key={photo.id}>
            <Box>
              <img src={photo.photo_url} alt="Event Photo" style={{ width: '100%', height: 'auto' }} />
              <Button onClick={() => handleDownload(photo.photo_url)}>Download</Button>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PhotoGallery;
