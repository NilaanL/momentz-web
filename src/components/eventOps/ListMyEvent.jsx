import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../../dbConfig/firebase'; 
import {
    Container,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    IconButton,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ShareIcon from '@mui/icons-material/Share';

function MyEvents() {
    const [events, setEvents] = useState([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [eventIdToDelete, setEventIdToDelete] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            if (!auth.currentUser) return; // Check if user is authenticated
            
            const q = query(collection(db, 'Events'), where('organizer_id', '==', auth.currentUser.uid));
            const querySnapshot = await getDocs(q);
            const eventsData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            setEvents(eventsData);
        };
    
        // Call fetchEvents initially and whenever auth.currentUser changes
        fetchEvents();
    
        // Subscribe to authentication state changes
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                // If user is authenticated, fetch events
                fetchEvents();
            } else {
                // If user is not authenticated, clear events
                setEvents([]);
            }
        });
    
        // Clean up subscription
        return () => unsubscribe();
    }, []);

    const handleDelete = async () => {
        try {
            await deleteDoc(doc(db, "Events", eventIdToDelete));
            setEvents(events.filter(event => event.id !== eventIdToDelete));
            setDeleteDialogOpen(false);
        } catch (error) {
            console.error("Error deleting document: ", error);
            // Handle error (e.g., show error message to user)
        }
    };
    const navigate = useNavigate(); // Get the navigate function

    const handleEditClick = (eventId) => {
        navigate(`/edit-event/${eventId}`); // Navigate to the EditEvent component
    };

    return (
        <Container maxWidth="md" sx={{ mt: 5 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                My Events
            </Typography>
            <List>
                {events.map(event => (
                    <ListItem key={event.id} secondaryAction={
                        <>
                            <IconButton edge="end" aria-label="edit" onClick={() => handleEditClick(event.id)}> 
                                <EditIcon />
                            </IconButton>
                            <IconButton edge="end" aria-label="delete" onClick={() => { setEventIdToDelete(event.id); setDeleteDialogOpen(true);}}>
                                <DeleteIcon />
                            </IconButton>
                            <IconButton edge="end" aria-label="share" onClick={() => console.log('Share', event.id)}>
                                <ShareIcon />
                            </IconButton>
                        </>
                    }>
                        <ListItemAvatar>
                            <Avatar src={event.image_url} alt={event.name} />
                        </ListItemAvatar>
                        <ListItemText primary={event.name} secondary={event.description} />
                    </ListItem>
                ))}
            </List>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this event? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleDelete} color="error" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default MyEvents;
