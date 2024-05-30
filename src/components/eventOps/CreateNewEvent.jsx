import React, { useState, useEffect } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db, auth } from './../../dbConfig/firebase'; // Import your firebase configuration
import { v4 as uuidv4 } from 'uuid'; // To generate unique IDs
import UploadEventImage from './UploadEventImage';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import './CreateNewEvent.css';

function CreateEvent() {
  const [eventName, setEventName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [organizerId, setOrganizerId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [eventImageUrl, setEventImageUrl] = useState(null);
  const [imageUploadComplete, setImageUploadComplete] = useState(false);

  const handleImageUpload = (url) => {
    setEventImageUrl(url);
    setImageUploadComplete(true);
  };

  useEffect(() => {
    // Fetch organizer ID from local storage or use default
    const organizer = auth.currentUser ? auth.currentUser.uid : 'test-user';
    setOrganizerId(organizer);

    // Generate QR code based on event name
    setQrCode(`${eventName}-${uuidv4()}`);
  }, [eventName]);

  const handleCreateEvent = async (e) => {
    e.preventDefault();

    // Check if image upload is complete
    if (!imageUploadComplete) {
      setError('Please upload an image before creating the event.');
      return;
    }

    setIsLoading(true);

    try {
      const eventRef = await addDoc(collection(db, 'Events'), {
        name: eventName,
        description,
        start_date: new Date(startDate), // Convert to Firestore Timestamp
        end_date: endDate ? new Date(endDate) : null, // Convert to Firestore Timestamp if provided
        qr_code: qrCode,
        organizer_id: organizerId,
        image_url: eventImageUrl,
      });

      console.log('Event created with ID: ', eventRef.id);
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
