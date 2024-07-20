import React, { useState, useEffect } from 'react';
import { db } from './../../dbConfig/firebase';
import { collection, doc, getDocs, deleteDoc, getDoc, query, where } from 'firebase/firestore';
import { Card, CardContent, CardActions, Button, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Avatar, Grid, Box } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './GuestList.css';

const GuestList = ({ eventId }) => {
  const [guests, setGuests] = useState([]);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    try {
      const guestsCollection = collection(db, 'Events', eventId, 'Event_Attendees');
      const guestSnapshot = await getDocs(guestsCollection);
      const guestList = await Promise.all(guestSnapshot.docs.map(async (guestDoc) => {
        const guestData = guestDoc.data();
        const userDoc = await getDoc(doc(db, 'Users', guestData.user_id));
        const userData = userDoc.exists() ? userDoc.data() : {};

        // Fetch the count of photos uploaded by this guest
        const photosQuery = query(collection(db, 'Photos'), where('user_id', '==', guestData.user_id), where('event_id', '==', eventId));
        const photosSnapshot = await getDocs(photosQuery);
        const uploadedPhotoCount = photosSnapshot.size;

        // Fetch the count of photos where this guest's face appears
        const facePhotosQuery = query(collection(db, 'Photos'), where('event_id', '==', eventId), where('faces', 'array-contains', guestData.user_id));
        const facePhotosSnapshot = await getDocs(facePhotosQuery);
        const facePhotoCount = facePhotosSnapshot.size;

        return {
          id: guestDoc.id,
          name: userData.name || 'Unknown',
          uploadedPhotoCount,
          facePhotoCount,
          ...guestData
        };
      }));
      setGuests(guestList);
    } catch (error) {
      console.error('Error fetching guests:', error);
      toast.error('Error fetching guests');
    }
  };

  const handleKickout = async (guestId) => {
    try {
      await deleteDoc(doc(db, 'Events', eventId, 'Event_Attendees', guestId));
      toast.success('Guest kicked out successfully!');
      fetchGuests();
    } catch (error) {
      console.error('Error kicking out guest:', error);
      toast.error('Error kicking out guest');
    }
    setOpen(false);
  };

  const handleOpenDialog = (guest) => {
    setSelectedGuest(guest);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedGuest(null);
  };

  return (
    <div className="guest-list-container">
      <ToastContainer />
      <Grid container spacing={2}>
        {guests.map(guest => (
          <Grid item xs={12} sm={6} md={4} key={guest.id}>
            <Card className="guest-card">
              <CardContent>
                <div className="guest-photos">
                  {guest.photos.map((photo, index) => (
                    <Avatar key={index} src={photo} alt={guest.name} className="guest-avatar" />
                  ))}
                </div>
                <Typography variant="h6" component="div">
                  {guest.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Joined: {guest.joined_date ? new Date(guest.joined_date.seconds * 1000).toLocaleDateString() : 'N/A'}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Uploaded Photos: {guest.uploadedPhotoCount}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Photos with Guest: {guest.facePhotoCount}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" onClick={() => handleOpenDialog(guest)}>Kick Out</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box className="total-guests-card-container">
        <Card className="total-guests-card">
          <CardContent>
            <Typography variant="h5" component="div">
              Total Guests
            </Typography>
            <Typography variant="h3" component="div">
              {guests.length}
            </Typography>
          </CardContent>
        </Card>
      </Box>
      <Dialog
        open={open}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Kick Out"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to kick out {selectedGuest?.name} from the event?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleKickout(selectedGuest.id)} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default GuestList;