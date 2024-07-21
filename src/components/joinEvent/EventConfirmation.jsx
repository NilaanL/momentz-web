import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "./../../dbConfig/firebase";
import { doc, getDoc } from "firebase/firestore";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import "./EventConfirmation.css";
import WaveCard from './WaveCard';

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
        const eventDoc = await getDoc(doc(db, "Events", eventId));
        const userDoc = await getDoc(
          doc(db, "Events", eventId, "Event_Attendees", userId)
        );

        if (eventDoc.exists() && userDoc.exists()) {
          setEventDetails(eventDoc.data());
          setUserDetails(userDoc.data());
        } else {
          setError("Event or user not found.");
        }
      } catch (err) {
        setError("An error occurred while fetching the details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [eventId, userId]);

  if (loading) {
    return (
      <Box className="loading-container">
        <CircularProgress />
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (error) {
    return <Typography className="error-message">{error}</Typography>;
  }

  const handleClick = () => {
    localStorage.setItem("eventId", eventId);
    localStorage.setItem("userId", userId);
    navigate("/guest-dashboard");
  };

  return (
    <Container className="event-confirmation-container">
      <Grid container spacing={4} justifyContent="center" alignItems="center">
        <Grid item xs={12} md={6}>
          <WaveCard eventDetails={eventDetails} userDetails={userDetails} userId={userId} />
        </Grid>
        <Grid item xs={12} md={6} className="centered-content">
          <Button
            variant="contained"
            color="primary"
            onClick={handleClick}
            className="event-confirmation-button"
          >
            Go to event dashboard
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default EventConfirmation;