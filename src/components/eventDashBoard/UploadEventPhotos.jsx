import React, { useState, useEffect } from 'react';
import { storage, db } from './../../dbConfig/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { collection, addDoc, Timestamp, getDocs, query, where, deleteDoc, doc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import { Button, Grid, Modal, Box, Typography, IconButton } from '@mui/material';
import { Delete, Upload, Favorite, FavoriteBorder } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './UploadEventPhotos.css';

const UploadEventPhotos = ({ eventId, userId }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    const photosQuery = query(collection(db, 'Photos'), where('event_id', '==', eventId), where('user_id', '==', userId));
    const photosSnapshot = await getDocs(photosQuery);
    const photosList = photosSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPhotos(photosList);
  };

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
          file_name: file.name,
          favorites: [], // Initialize favorites as an empty array
        });
      });

      await Promise.all(uploadPromises);
      toast.success('Photos uploaded successfully!');
      setFiles([]);
      fetchPhotos();
      setOpen(false);
    } catch (error) {
      console.error('Error uploading photos: ', error);
      toast.error('Error uploading photos');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPhoto = (id) => {
    setSelectedPhotos(prev =>
      prev.includes(id) ? prev.filter(photoId => photoId !== id) : [...prev, id]
    );
  };

  const handleDeletePhoto = async (photoId) => {
    try {
      const photoDoc = photos.find(photo => photo.id === photoId);
      const storageRef = ref(storage, `event_photos/${eventId}/${photoDoc.file_name}`);
      await deleteObject(storageRef);
      await deleteDoc(doc(db, 'Photos', photoId));
      toast.success('Photo deleted successfully!');
      fetchPhotos();
    } catch (error) {
      console.error('Error deleting photo: ', error);
      toast.error('Error deleting photo');
    }
  };

  const handleDeleteSelectedPhotos = async () => {
    const deletePromises = selectedPhotos.map(async (photoId) => {
      const photoDoc = photos.find(photo => photo.id === photoId);
      const storageRef = ref(storage, `event_photos/${eventId}/${photoDoc.file_name}`);
      await deleteObject(storageRef);
      await deleteDoc(doc(db, 'Photos', photoId));
    });

    await Promise.all(deletePromises);
    toast.success('Selected photos deleted successfully!');
    setSelectedPhotos([]);
    fetchPhotos();
  };

  const handleFavoritePhoto = async (photoId, isFavorited) => {
    try {
      const photoDoc = doc(db, 'Photos', photoId);
      if (isFavorited) {
        await updateDoc(photoDoc, {
          favorites: arrayRemove(userId),
        });
      } else {
        await updateDoc(photoDoc, {
          favorites: arrayUnion(userId),
        });
      }
      fetchPhotos();
    } catch (error) {
      console.error('Error updating favorite status: ', error);
      toast.error('Error updating favorite status');
    }
  };

  return (
    <div className="upload-event-photos-container">
    <Box display={'flex'} justifyContent={'space-between'} >
      <Button variant="contained" startIcon={<Upload />} sx={{width:200}} onClick={() => setOpen(true)  } className="upload-button">
        Upload Photos
      </Button>
      {selectedPhotos.length > 0 && (
          <Button variant="contained" startIcon={<Delete />} sx={{width:200}} onClick={handleDeleteSelectedPhotos} className="upload-button">
            Delete Selected
          </Button>
      )}

    </Box>
      <Grid container spacing={2} className="photos-grid">
        {photos.map(photo => {
          const isFavorited = photo.favorites && photo.favorites.includes(userId);
          return (
            <Grid item xs={6} sm={4} md={3} key={photo.id} className="photo-item">
              <div className={`photo-wrapper ${selectedPhotos.includes(photo.id) ? 'selected' : ''}`} onClick={() => handleSelectPhoto(photo.id)}>
                <img src={photo.photo_url} alt="Event" className="photo-img" />
                <IconButton className="favorite-icon" onClick={(e) => { e.stopPropagation(); handleFavoritePhoto(photo.id, isFavorited); }}>
                  {isFavorited ? <Favorite style={{ color: '#e74c3c' }} /> : <FavoriteBorder style={{ color: '#e74c3c' }} />}
                </IconButton>
                <IconButton className="delete-icon" onClick={(e) => { e.stopPropagation(); handleDeletePhoto(photo.id); }}>
                  <Delete style={{ color: '#e74c3c' }} />
                </IconButton>
              </div>
            </Grid>
          );
        })}
      </Grid>
      <Modal open={open} onClose={() => setOpen(false)} className="upload-modal">
        <Box className="upload-modal-content">
          <Typography variant="h6" component="h2">
            Upload Event Photos
          </Typography>
          <input type="file" multiple onChange={handleFileChange} />
          <Button variant="contained" onClick={handleUpload} disabled={loading || files.length === 0} className="upload-button">
            {loading ? 'Uploading...' : 'Upload Photos'}
          </Button>
        </Box>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default UploadEventPhotos;