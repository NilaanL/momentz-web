import React, { useState, useEffect } from 'react';
import { db } from './../../dbConfig/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Button, Grid, IconButton } from '@mui/material';
import { Download } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './DownloadPhotos.css';

const DownloadPhotos = ({ eventId, userId }) => {
  const [photos, setPhotos] = useState([]);
  const [selectedPhotos, setSelectedPhotos] = useState([]);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    const photosQuery = query(collection(db, 'Photos'), where('event_id', '==', eventId), where('faces', 'array-contains', userId));
    const photosSnapshot = await getDocs(photosQuery);
    const photosList = photosSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPhotos(photosList);
  };

  const handleSelectPhoto = (id) => {
    setSelectedPhotos(prev =>
      prev.includes(id) ? prev.filter(photoId => photoId !== id) : [...prev, id]
    );
  };

  const handleDownloadPhotos = async () => {
    try {
      const downloadPromises = selectedPhotos.map(async (photoId) => {
        const photo = photos.find(p => p.id === photoId);
        const response = await fetch(photo.photo_url);
  
        if (!response.ok) {
          throw new Error(`Failed to fetch photo with id ${photoId}`);
        }
  
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `${photoId}.jpg`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      });
  
      await Promise.all(downloadPromises);
      toast.success('Photos downloaded successfully!');
      setSelectedPhotos([]);
    } catch (error) {
      console.error('Error downloading photos:', error);
      toast.error(`Error downloading photos: ${error.message}`);
    }
  };

  return (
    <div className="download-photos-container">
      <Grid container spacing={2} className="photos-grid">
        {photos.map(photo => (
          <Grid item xs={6} sm={4} md={3} key={photo.id} className="photo-item">
            <div className="photo-wrapper" onClick={() => handleSelectPhoto(photo.id)}>
              {selectedPhotos.includes(photo.id) && <div className="photo-overlay"></div>}
              <img src={photo.photo_url} alt="Event" className="photo-img" />
            </div>
          </Grid>
        ))}
      </Grid>
      {selectedPhotos.length > 0 && (
        <div className="bulk-actions">
          <Button variant="contained" startIcon={<Download />} onClick={handleDownloadPhotos}>
            Download Selected Photos
          </Button>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default DownloadPhotos;