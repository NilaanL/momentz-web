import React, { useState, useEffect } from 'react';
import { db } from './../../dbConfig/firebase';
import { collection, query, where, getDocs, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { Button, Grid, IconButton } from '@mui/material';
import { Download, Report, Favorite } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './YourEventPhotos.css';

const YourEventPhotos = ({ eventId, userId }) => {
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
    const downloadPromises = selectedPhotos.map(photoId => {
      const photo = photos.find(p => p.id === photoId);
      return fetch(photo.photo_url).then(response => response.blob()).then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `${photoId}.jpg`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      });
    });
    
    await Promise.all(downloadPromises);
    toast.success('Photos downloaded successfully!');
    setSelectedPhotos([]);
  };

  const handleReportPhotos = async () => {
    const reportPromises = selectedPhotos.map(async (photoId) => {
      const photoDoc = doc(db, 'Photos', photoId);
      await updateDoc(photoDoc, {
        reports: arrayUnion(userId),
      });
    });

    await Promise.all(reportPromises);
    toast.success('Photos reported successfully!');
    setSelectedPhotos([]);
  };

  const handleFavoritePhotos = async () => {
    const favoritePromises = selectedPhotos.map(async (photoId) => {
      const photoDoc = doc(db, 'Photos', photoId);
      await updateDoc(photoDoc, {
        favorites: arrayUnion(userId),
      });
    });

    await Promise.all(favoritePromises);
    toast.success('Photos marked as favorite successfully!');
    setSelectedPhotos([]);
  };

  return (
    <div className="your-event-photos-container">
      <Grid container spacing={2} className="photos-grid">
        {photos.map(photo => (
          <Grid item xs={6} sm={4} md={3} key={photo.id} className="photo-item">
            <div className="photo-wrapper" onClick={() => handleSelectPhoto(photo.id)}>
              {selectedPhotos.includes(photo.id) && <div className="photo-overlay"></div>}
              <img src={photo.photo_url} alt="Event" className="photo-img" />
              <div className="photo-actions-overlay">
                <IconButton onClick={() => handleDownloadPhotos([photo.id])}>
                  <Download style={{ color: '#fff' }} />
                </IconButton>
                <IconButton onClick={() => handleReportPhotos([photo.id])}>
                  <Report style={{ color: '#fff' }} />
                </IconButton>
                <IconButton onClick={() => handleFavoritePhotos([photo.id])}>
                  <Favorite style={{ color: '#fff' }} />
                </IconButton>
              </div>
            </div>
          </Grid>
        ))}
      </Grid>
      {selectedPhotos.length > 0 && (
        <div className="bulk-actions">
          <Button variant="contained" startIcon={<Download />} onClick={handleDownloadPhotos}>
            Download
          </Button>
          <Button variant="contained" color="secondary" startIcon={<Report />} onClick={handleReportPhotos}>
            Report
          </Button>
          <Button variant="contained" color="primary" startIcon={<Favorite />} onClick={handleFavoritePhotos}>
            Make Favorite
          </Button>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default YourEventPhotos;