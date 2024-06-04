import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { db } from './../../dbConfig/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Box, Container, Typography, Grid, Paper } from '@mui/material';

const EventConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { eventId, userId } = location.state;
  const [eventDetails, setEventDetails] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
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
  
  const handleClick = () => {
    localStorage.setItem('eventId', eventId);
    localStorage.setItem('userId', userId);
    navigate('/event-dashboard');
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 5 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Event Confirmation
        </Typography>
        {eventDetails && userDetails && (
          <Paper elevation={3} sx={{ p: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <img src={eventDetails.image_url} alt="Event" style={{ width: '100%', height: 'auto' }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h5">{eventDetails.name}</Typography>
                <Typography variant="body1"><strong>Event ID:</strong> {eventDetails.id}</Typography>
                <Typography variant="body1"><strong>Start Date:</strong> {eventDetails.start_date.toDate().toLocaleString()}</Typography>
                <Typography variant="body1"><strong>End Date:</strong> {eventDetails.end_date ? eventDetails.end_date.toDate().toLocaleString() : 'N/A'}</Typography>
                <Typography variant="h6" sx={{ mt: 2 }}>User Details</Typography>
                <Typography variant="body1"><strong>User ID:</strong> {userId}</Typography>
                <Typography variant="body1"><strong>Join Date:</strong> {userDetails.join_date.toDate().toLocaleString()}</Typography>
                <Typography variant="h6" sx={{ mt: 2 }}>Uploaded Photos</Typography>
                <Grid container spacing={2}>
                  {userDetails.photos && userDetails.photos.map((url, index) => (
                    <Grid item xs={4} key={index}>
                      <img src={url} alt={`User Photo ${index + 1}`} style={{ width: '100%', height: 'auto' }} />
                    </Grid>
                  ))}
                </Grid>
                <button onClick={handleClick}>Go to Event Dashboard</button>
              </Grid>
            </Grid>
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default EventConfirmation;
