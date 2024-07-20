import React, { useState, useEffect } from 'react';
import { db } from './../../dbConfig/firebase';
import { collection, getDocs, deleteDoc, doc, getDoc, query, where } from 'firebase/firestore';
import { Card, CardContent, CardActions, Button, Typography, Avatar, Grid, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AllPhotos.css';

const AllPhotos = ({ eventId }) => {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const photosCollection = collection(db, 'Photos');
      const photosQuery = query(photosCollection, where('event_id', '==', eventId));
      const photosSnapshot = await getDocs(photosQuery);
      const photosList = await Promise.all(photosSnapshot.docs.map(async (photoDoc) => {
        const photoData = photoDoc.data();
        const userDoc = await getDoc(doc(db, 'Users', photoData.user_id));
        const userData = userDoc.exists() ? userDoc.data() : {};

        const facesNames = await Promise.all(
          (photoData.faces || []).map(async (faceId) => {
            const faceDoc = await getDoc(doc(db, 'Users', faceId));
            const faceData = faceDoc.exists() ? faceDoc.data() : {};
            return faceData.name || faceId;
          })
        );

        return {
          id: photoDoc.id,
          userName: userData.name || 'Unknown',
          facesNames,
          ...photoData
        };
      }));
      setPhotos(photosList);
    } catch (error) {
      console.error('Error fetching photos:', error);
      toast.error('Error fetching photos');
    }
  };

  const handleDeletePhoto = async (photoId) => {
    try {
      await deleteDoc(doc(db, 'Photos', photoId));
      toast.success('Photo deleted successfully!');
      fetchPhotos();
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast.error('Error deleting photo');
    }
  };

  return (
    <div className="all-photos-container">
      <ToastContainer />
      <Grid container spacing={2}>
        {photos.map(photo => (
          <Grid item xs={12} sm={6} md={4} key={photo.id}>
            <Card className="photo-card">
              <CardContent>
                <div className="photo-header">
                  <Avatar src={photo.userProfilePic} alt={photo.userName} className="photo-avatar" />
                  <Typography variant="h6" component="div">
                    {photo.userName}
                  </Typography>
                </div>
                <img src={photo.photo_url} alt="Event" className="photo-img" />
                <div className="photo-details">
                  <Typography variant="body2" color="textSecondary">
                    Uploaded by: {photo.userName}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Faces: {photo.facesNames ? photo.facesNames.join(', ') : 'N/A'}
                  </Typography>
                </div>
              </CardContent>
              <CardActions>
                <IconButton color="secondary" onClick={() => handleDeletePhoto(photo.id)}>
                  <Delete />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default AllPhotos;