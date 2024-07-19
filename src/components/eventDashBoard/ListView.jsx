import React, { useState, useEffect } from 'react';
import { db } from './../../dbConfig/firebase';
import { getDocs, query, collection, where, deleteDoc, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Typography, Divider } from '@mui/material';
import { Delete, Report, Download } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ListView.css';

const ListView = ({ eventId, userId }) => {
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [myEventPhotos, setMyEventPhotos] = useState([]);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const uploadedPhotosQuery = query(collection(db, 'Photos'), where('event_id', '==', eventId), where('user_id', '==', userId));
      const myEventPhotosQuery = query(collection(db, 'Photos'), where('event_id', '==', eventId), where('faces', 'array-contains', userId));
      
      const [uploadedPhotosSnapshot, myEventPhotosSnapshot] = await Promise.all([
        getDocs(uploadedPhotosQuery),
        getDocs(myEventPhotosQuery)
      ]);

      const uploadedPhotosList = uploadedPhotosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      const myEventPhotosList = myEventPhotosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setUploadedPhotos(uploadedPhotosList);
      setMyEventPhotos(myEventPhotosList);
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

  const handleReportPhoto = async (photoId) => {
    try {
      const photoDoc = doc(db, 'Photos', photoId);
      await updateDoc(photoDoc, {
        reports: arrayUnion(userId),
      });
      toast.success('Photo reported successfully!');
    } catch (error) {
      console.error('Error reporting photo:', error);
      toast.error('Error reporting photo');
    }
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
    <div className="list-view-container">
      <Typography variant="h6" component="h2" className="list-view-title">
        Uploaded Event Photos
      </Typography>
      <List>
        {uploadedPhotos.map(photo => (
          <div key={photo.id}>
            <ListItem>
              <ListItemText primary={`Uploaded on: ${photo.upload_date.toDate().toLocaleString()}`} secondary={`Photo ID: ${photo.id}`} />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="delete" onClick={() => handleDeletePhoto(photo.id)}>
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
          </div>
        ))}
      </List>

      <Typography variant="h6" component="h2" className="list-view-title">
        My Event Photos
      </Typography>
      <List>
        {myEventPhotos.map(photo => (
          <div key={photo.id}>
            <ListItem>
              <ListItemText primary={`Uploaded by: ${photo.user_id}`} secondary={`Photo ID: ${photo.id}`} />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="report" onClick={() => handleReportPhoto(photo.id)}>
                  <Report />
                </IconButton>
                <IconButton edge="end" aria-label="download" onClick={() => handleDownloadPhoto(photo.photo_url)}>
                  <Download />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
          </div>
        ))}
      </List>
      <ToastContainer />
    </div>
  );
};

export default ListView;