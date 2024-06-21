import React, { useState, useEffect } from 'react';
import { db, auth } from './../../dbConfig/firebase';
import { doc, getDoc, collection, query, getDocs,where } from 'firebase/firestore';
import { Container, Typography, Box, Button, CircularProgress, Grid, Avatar } from '@mui/material';
import UploadPhoto from './UploadPhoto';
import PhotoGallery from './PhotoGallery';
import JSZip from 'jszip';

const EventDashboard = () => {
  const [eventDetails, setEventDetails] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const eventId = localStorage.getItem('eventId');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const eventDoc = await getDoc(doc(db, 'Events', eventId));
        if (eventDoc.exists()) {
          setEventDetails(eventDoc.data());
        }

        const attendeesQuery = query(collection(db, 'Events', eventId, 'Event_Attendees'));
        const attendeesSnapshot = await getDocs(attendeesQuery);
        const attendeesList = attendeesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAttendees(attendeesList);
      } catch (error) {
        console.error('Error fetching event details: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const handleDownloadUserPhotos = async () => {
    try {
      const photosQuery = query(collection(db, 'Photos'), where('user_id', '==', userId), where('event_id', '==', eventId));
      const photosSnapshot = await getDocs(photosQuery);
      const userPhotos = photosSnapshot.docs.map(doc => doc.data().photo_url);

      const zip = new JSZip();
      const imgFolder = zip.folder('images');
      await Promise.all(userPhotos.map(async (url, index) => {
        const response = await fetch(url);
        const blob = await response.blob();
        imgFolder.file(`photo_${index + 1}.jpg`, blob);
      }));

      const content = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = 'user_photos.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error('Error downloading user photos: ', error);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 5, mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {eventDetails?.name}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {eventDetails?.description}
        </Typography>
        <Typography variant="body2" gutterBottom>
          Start Date: {eventDetails?.start_date.toDate().toLocaleString()}
        </Typography>
        {eventDetails?.end_date && (
          <Typography variant="body2" gutterBottom>
            End Date: {eventDetails?.end_date.toDate().toLocaleString()}
          </Typography>
        )}
        {eventDetails?.image_url && (
          <img src={eventDetails.image_url} alt={eventDetails.name} style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }} />
        )}
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Attendees
        </Typography>
        <Grid container spacing={2}>
          {attendees.map((attendee) => (
            <Grid item key={attendee.id} xs={12} sm={6} md={4}>
              <Box display="flex" alignItems="center">
                <Avatar src={attendee.profile_picture} alt={attendee.name} />
                <Typography variant="body1" ml={2}>{attendee.name}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      <UploadPhoto eventId={eventId} userId={userId} />

      <PhotoGallery eventId={eventId} userId={userId} />

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Button variant="contained" color="primary" onClick={handleDownloadUserPhotos}>
          Group and Download My Photos
        </Button>
      </Box>
    </Container>
  );
};

export default EventDashboard;
