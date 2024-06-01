// EventDashboard.jsx

import React, { useState, useEffect } from 'react';
import { db, auth } from './../../dbConfig/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { Container, Typography, Box, Button, CircularProgress, Grid, Avatar } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const EventDashboard = () => {

  const [eventDetails, setEventDetails] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { eventId, userId } = location.state;
  const [eventName, setEventName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [organizerId, setOrganizerId] = useState('');
  const[eventImageUrl, setEventImageUrl] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState(null);



  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const eventDoc = await getDoc(doc(db, 'Events', eventId));
        const userDoc = await getDoc(doc(db, 'Events', eventId, 'Event_Attendees', userId));
        
        if (eventDoc.exists() && userDoc.exists()) {
          setEventDetails(eventDoc.data());
          setUserDetails(userDoc.data());
        } else {
          setError('Event or user not found.');
        }
      } catch (err) {
        setError('An error occurred while fetching the details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [eventId, userId]);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  const handleDownloadUserPhotos = async () => {
    // Implement the function to group and download photos for the logged-in user
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 5, mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {eventName}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {description}
        </Typography>
        <Typography variant="body2" gutterBottom>
          Start Date: {new Date(startDate).toLocaleString()}
        </Typography>
        {endDate && (
          <Typography variant="body2" gutterBottom>
            End Date: {new Date(endDate).toLocaleString()}
          </Typography>
        )}
        {eventImageUrl && <img src={eventImageUrl} alt={eventName} style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }} />}
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

      {/* <UploadPhoto eventId={eventId} /> */}

      {/* <PhotoGallery eventId={eventId} /> */}

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Button variant="contained" color="primary" onClick={handleDownloadUserPhotos}>
          Group and Download My Photos
        </Button>
      </Box>
    </Container>
  );
};

export default EventDashboard;
