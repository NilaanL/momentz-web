// PhotoGallery.jsx

import React, { useState, useEffect } from 'react';
import { db } from './../../dbConfig/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Grid, Box, Button, CircularProgress, Typography } from '@mui/material';

const PhotoGallery = ({ eventId }) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const photosQuery = query(collection(db, 'Photos'), where('event_id', '==', eventId));
        const photosSnapshot = await getDocs(photosQuery);
        const photosList = photosSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPhotos(photosList);
      } catch (error) {
        console.error('Error fetching photos: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, [eventId]);

  const handleDownload = async (photoUrl) => {
    // Implement the function to download the photo
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Event Photos
      </Typography>
      <Grid container spacing={2}>
        {photos.map((photo) => (
          <Grid item key={photo.id} xs={12} sm={6} md={4}>
            <Box>
              <img src={photo.photo_url} alt={`Event photo ${photo.id}`} style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }} />
              <Button variant="contained" color="primary" onClick={() => handleDownload(photo.photo_url)}>
                Download
              </Button>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PhotoGallery;
