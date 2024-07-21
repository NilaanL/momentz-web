import React from 'react';
import { Card, CardContent, Typography, Box, CardActionArea, CardMedia, Grid } from '@mui/material';
import { styled } from '@mui/system';

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 400,
  margin: 'auto',
  borderRadius: 16,
  overflow: 'hidden',
  position: 'relative',
  color: 'white',
}));

const CardBackground = styled(Box)(({ image }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundImage: `url(${image})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  zIndex: 0,
}));

const CardContentStyled = styled(CardContent)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
  color: 'white',
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  justifyContent: 'flex-end',
  background: 'rgba(0, 0, 0, 0.5)',
}));

const TitleTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  marginBottom: theme.spacing(1),
}));

const DateTypography = styled(Typography)({
  fontWeight: 'bold',
});

const WaveCard = ({ eventDetails, userDetails, userId }) => {
  return (
    <StyledCard>
      <CardBackground image={eventDetails.image_url} />
      <CardActionArea>
        <CardContentStyled>
          <TitleTypography variant="h3">
            {eventDetails.name}
          </TitleTypography>
          <DateTypography variant="h5">
            <strong>From: {eventDetails.start_date.toDate().toLocaleString()}</strong>
            <br />
            <br />
            <strong>To:</strong> {eventDetails.end_date ? eventDetails.end_date.toDate().toLocaleString() : "N/A"}
          </DateTypography>
          <br />
            <br />
          <Typography variant="body2" color="text.secondary" sx={{ color: 'white' }}>
            <strong>User ID:</strong> {userId}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ color: 'white' }}>
            <strong>Joined Date:</strong> {userDetails.join_date.toDate().toLocaleString()}
          </Typography>
          <Grid container spacing={2}>
            {userDetails.photos &&
              userDetails.photos.map((url, index) => (
                <Grid item xs={6} sm={4} key={index}>
                  <img src={url} alt={`User ${index + 1}`} className="user-photo" style={{ width: '100%', borderRadius: '8px' }} />
                </Grid>
              ))}
          </Grid>
        </CardContentStyled>
      </CardActionArea>
    </StyledCard>
  );
};

export default WaveCard;