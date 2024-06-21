import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from './../../dbConfig/firebase';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  CircularProgress,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import UploadEventImage from './UploadEventImage';

function EditEvent() {
    const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState({});
  const [currentUserId, setCurrentUserId] = useState(null);
  const [imageUploadComplete, setImageUploadComplete] = useState(true);
  

  useEffect(() => {
    const fetchEvent = async () => {
        try {
                    const eventIdString = eventId.toString(); // Convert to string

          console.log('Fetching event with ID:', eventId);
          const eventDoc = await getDoc(doc(db, 'Events', eventId));
          if (eventDoc.exists()) {
            setEvent(eventDoc.data());
            setCurrentUserId(auth.currentUser ? auth.currentUser.uid : null);
          } else {
            setError('Event not found');
          }
        } catch (err) {
          console.error('Error fetching event:', err);
          setError('Error fetching event');
        } finally {
          setIsLoading(false);
        }
      };
      

    fetchEvent();
  }, [eventId]);

  const handleEditClick = (field) => {
    setIsEditing((prev) => ({ ...prev, [field]: true }));
  };

  const handleInputChange = (field, value) => {
    setEvent((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (url) => {
    setEvent((prev) => ({ ...prev, image_url: url }));
    setImageUploadComplete(true);
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);

    try {
      await updateDoc(doc(db, 'Events', eventId), event);
      console.log('Event updated successfully');
      setIsEditing({});
    } catch (err) {
      console.error('Error updating event:', err);
      setError('Error updating event');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 5, textAlign: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 5, textAlign: 'center' }}>
          <Typography color="error">{error}</Typography>
        </Box>
      </Container>
    );
  }

  if (!event) {
    return null;
  }

  if (currentUserId !== event.organizer_id) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 5, textAlign: 'center' }}>
          <Typography color="error">You are not authorized to edit this event</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Edit Event
        </Typography>
        <form>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <TextField
              label="Event Name"
              variant="outlined"
              fullWidth
              value={event.name}
              disabled={!isEditing.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={() => handleEditClick('name')}>
                    <EditIcon />
                  </IconButton>
                ),
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              value={event.description}
              disabled={!isEditing.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={() => handleEditClick('description')}>
                    <EditIcon />
                  </IconButton>
                ),
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <TextField
              label="Start Date"
              type="datetime-local"
              variant="outlined"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              value={event.start_date && event.start_date instanceof Date ? event.start_date.toISOString().slice(0, -8) : ''}
              disabled={!isEditing.start_date}
              onChange={(e) => handleInputChange('start_date', e.target.value)}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={() => handleEditClick('start_date')}>
                    <EditIcon />
                  </IconButton>
                ),
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <TextField
              label="End Date"
              type="datetime-local"
              variant="outlined"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              value={event.end_date && event.end_date instanceof Date ? event.end_date.toISOString().slice(0, -8) : ''}
              disabled={!isEditing.end_date}
              onChange={(e) => handleInputChange('end_date', e.target.value)}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={() => handleEditClick('end_date')}>
                    <EditIcon />
                  </IconButton>
                ),
              }}
            />
          </Box>
          <UploadEventImage onImageUpload={handleImageUpload} />
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button
              type="button"
              variant="contained"
              color="primary"
              onClick={handleSaveChanges}
              disabled={isLoading || !imageUploadComplete}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
          {error && <Typography color="error">{error}</Typography>}
        </form>
      </Box>
    </Container>
  );
}

export default EditEvent;