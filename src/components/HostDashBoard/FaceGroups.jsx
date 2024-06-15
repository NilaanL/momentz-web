import React, { useState, useEffect } from 'react';
import { db } from './../../dbConfig/firebase';
import { updateDoc, collection, getDocs, deleteDoc, doc, getDoc, query, where } from 'firebase/firestore';
import { Card, CardContent, Typography, Grid, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './FaceGroups.css';

const FaceGroups = ({ eventId }) => {
  const [faceGroups, setFaceGroups] = useState([]);

  useEffect(() => {
    fetchFaceGroups();
  }, []);

  const fetchFaceGroups = async () => {
    try {
      const photosCollection = collection(db, 'Photos');
      const photosQuery = query(photosCollection, where('event_id', '==', eventId));
      const photosSnapshot = await getDocs(photosQuery);

      const groupedPhotos = {};

      await Promise.all(photosSnapshot.docs.map(async (photoDoc) => {
        const photoData = photoDoc.data();
        const uploaderDoc = await getDoc(doc(db, 'Users', photoData.user_id));
        const uploaderData = uploaderDoc.exists() ? uploaderDoc.data() : {};

        const facesNames = await Promise.all(
          (photoData.faces || []).map(async (faceId) => {
            const faceDoc = await getDoc(doc(db, 'Users', faceId));
            const faceData = faceDoc.exists() ? faceDoc.data() : {};
            return { id: faceId, name: faceData.name || 'Unknown' };
          })
        );

        facesNames.forEach(face => {
          if (!groupedPhotos[face.id]) {
            groupedPhotos[face.id] = {
              faceId: face.id,
              faceName: face.name,
              photos: []
            };
          }
          groupedPhotos[face.id].photos.push({
            ...photoData,
            uploaderName: uploaderData.name || 'Unknown',
            photoId: photoDoc.id
          });
        });
      }));

      setFaceGroups(Object.values(groupedPhotos));
    } catch (error) {
      console.error('Error fetching face groups:', error);
      toast.error('Error fetching face groups');
    }
  };

  const handleDeletePhoto = async (photoId) => {
    try {
      await deleteDoc(doc(db, 'Photos', photoId));
      toast.success('Photo deleted successfully!');
      fetchFaceGroups();
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast.error('Error deleting photo');
    }
  };

  const handleDeleteFaceGroup = async (faceId) => {
    try {
      const photosQuery = query(collection(db, 'Photos'), where('faces', 'array-contains', faceId));
      const photosSnapshot = await getDocs(photosQuery);

      const deletePromises = photosSnapshot.docs.map(photoDoc => {
        const photoData = photoDoc.data();
        const updatedFaces = photoData.faces.filter(face => face !== faceId);
        if (updatedFaces.length === 0) {
          return deleteDoc(doc(db, 'Photos', photoDoc.id));
        } else {
          return updateDoc(doc(db, 'Photos', photoDoc.id), { faces: updatedFaces });
        }
      });

      await Promise.all(deletePromises);
      toast.success('Face group deleted successfully!');
      fetchFaceGroups();
    } catch (error) {
      console.error('Error deleting face group:', error);
      toast.error('Error deleting face group');
    }
  };

  return (
    <div className="face-groups-container">
      <ToastContainer />
      {faceGroups.map((group, index) => (
        <div key={index} className="face-group">
          <div className="face-group-header">
            <Typography variant="h5" component="div" className="face-group-title">
              {group.faceName}
            </Typography>
            <IconButton color="secondary" onClick={() => handleDeleteFaceGroup(group.faceId)}>
              <Delete />
            </IconButton>
          </div>
          <Grid container spacing={2}>
            {group.photos.map((photo, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <Card className="photo-card">
                  <CardContent>
                    <div className="photo-header">
                      <Typography variant="body2" component="div">
                        Uploaded by: {photo.uploaderName}
                      </Typography>
                      <IconButton color="secondary" onClick={() => handleDeletePhoto(photo.photoId)}>
                        <Delete />
                      </IconButton>
                    </div>
                    <img src={photo.photo_url} alt="Event" className="photo-img" />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>
      ))}
    </div>
  );
};

export default FaceGroups;