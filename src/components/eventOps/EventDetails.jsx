import React from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Typography, Box, Button } from '@mui/material';

const EventDetails = () => {
  const location = useLocation();
  const {
    eventId,
    eventName,
    description,
    startDate,
    endDate,
    qrCodeUrl,
    eventImageUrl
  } = location.state;

  const downloadQR = () => {
    fetch(qrCodeUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', `qrcode-${eventId}.png`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Event Created Successfully
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          {eventName}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {description}
        </Typography>
        <Typography variant="body2" gutterBottom>
          Starts on: {new Date(startDate).toLocaleString()}
        </Typography>
        <Typography variant="body2" gutterBottom>
          Ends on: {endDate ? new Date(endDate).toLocaleString() : 'N/A'}
        </Typography>
        {eventImageUrl && <img src={eventImageUrl} alt="Event" width="100%" />}
        <Box sx={{ mt: 3 }}>
          <img src={qrCodeUrl} alt="QR Code" />
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" color="primary" onClick={downloadQR}>
              Download QR Code
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default EventDetails;
