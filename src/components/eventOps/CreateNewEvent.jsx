import React, { useState, useEffect } from 'react';
import { setDoc, doc } from 'firebase/firestore';
import { db, auth } from './../../dbConfig/firebase';
import UploadEventImage from './UploadEventImage';
import { TextField, Button, Container, Typography, Box, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './CreateNewEvent.css';

// Custom event ID generator
const generateCustomEventId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 3; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  result += '-';
  for (let i = 0; i < 3; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  result += '-';
  for (let i = 0; i < 3; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

function CreateEvent() {
  const [eventName, setEventName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [organizerId, setOrganizerId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [eventImageUrl, setEventImageUrl] = useState(null);
  const [imageUploadComplete, setImageUploadComplete] = useState(false);
  const navigate = useNavigate();

  const handleImageUpload = (url) => {
    setEventImageUrl(url);
    setImageUploadComplete(true);
  };

  useEffect(() => {
    const organizer = auth.currentUser ? auth.currentUser.uid : 'test-user';
    setOrganizerId(organizer);
  }, []);

  const handleCreateEvent = async (e) => {
    e.preventDefault();

    if (!imageUploadComplete) {
      setError('Please upload an image before creating the event.');
      return;
    }

    setIsLoading(true);

    try {
      const newEventId = generateCustomEventId();
      const qrCodeValue = newEventId;

      await setDoc(doc(db, 'Events', newEventId), {
        id: newEventId,
        name: eventName,
        description,
        start_date: new Date(startDate),
        end_date: endDate ? new Date(endDate) : null,
        qr_code: qrCodeValue,
        organizer_id: organizerId,
        image_url: eventImageUrl,
      });

      // Generate QR code URL
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrCodeValue}`;

      // Redirect to EventDetails component
      navigate('/event-details', {
        state: {
          eventId: newEventId,
          eventName,
          description,
          startDate,
          endDate,
          qrCodeUrl,
          eventImageUrl
        }
      });
    } catch (err) {
      console.error('Error adding event: ', err);
      setError(err.message || 'An error occurred while creating the event');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create Event
        </Typography>
        <form onSubmit={handleCreateEvent}>
          <TextField
            label="Event Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            required
          />
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            margin="normal"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            label="Start Date"
            type="datetime-local"
            variant="outlined"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
          <TextField
            label="End Date"
            type="datetime-local"
            variant="outlined"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <UploadEventImage onImageUpload={handleImageUpload} />
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            {isLoading ? (
              <CircularProgress />
            ) : (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isLoading || !imageUploadComplete}
              >
                Create Event
              </Button>
            )}
          </Box>
          {error && <Typography color="error">{error}</Typography>}
        </form>
      </Box>
    </Container>
  );
}

export default CreateEvent;
