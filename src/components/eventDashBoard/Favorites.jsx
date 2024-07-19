import React, { useState, useEffect } from 'react';
import { db } from './../../dbConfig/firebase';
import { getDocs, query, collection, where } from 'firebase/firestore';
import { Grid, IconButton } from '@mui/material';
import { Download } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Favorites.css';

const Favorites = ({ eventId, userId }) => {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    const photosQuery = query(collection(db, 'Photos'), where('favorites', 'array-contains', userId));
    const photosSnapshot = await getDocs(photosQuery);
    const photosList = photosSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPhotos(photosList);
  };

  const handleDownloadPhoto = (photoUrl) => {
    const a = document.createElement('a');
    a.href = photoUrl;
    a.download = 'photo.jpg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success('Photo downloaded successfully!');
  };

  return (
    <div className="favorites-container">
      <Grid container spacing={2} className="photos-grid">
        {photos.map(photo => (
          <Grid item xs={6} sm={4} md={3} key={photo.id} className="photo-item">
            <div className="photo-wrapper">
              <img src={photo.photo_url} alt="Event" className="photo-img" />
              <IconButton className="download-icon" onClick={() => handleDownloadPhoto(photo.photo_url)}>
                <Download style={{ color: '#013220' }} />
              </IconButton>
            </div>
          </Grid>
        ))}
      </Grid>
      <ToastContainer />
    </div>
  );
};

export default Favorites;