import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Box, Button, Typography } from '@mui/material';

const CameraCapture = forwardRef(({ onCapture, photoCount }, ref) => {
  const videoRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);

  useImperativeHandle(ref, () => ({
    stopCamera() {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
      setIsCameraOn(false);
    }
  }));

  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    setIsCameraOn(true);
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
  };

  const capturePhoto = () => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/png');
    onCapture(dataUrl);
  };

  return (
    <Box>
      {isCameraOn ? (
        <Box className='join-event-camera-container' sx={{ textAlign: 'center', mb: 2 }}>
          <video ref={videoRef} autoPlay style={{ width: '100%', maxWidth: '400px', marginBottom: '10px' }}></video>
          <Box>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={capturePhoto}
              sx={{ mr: 1 }}
            >
              Capture Photo
            </Button>
            <Button 
              variant="outlined" 
              color="secondary" 
              onClick={() => ref.current.stopCamera()}
            >
              Stop Camera
            </Button>
          </Box>
          <Typography variant="body2" sx={{ mt: 1 }}>Photos Taken: {photoCount}</Typography>
        </Box>
      ) : (
        <Button 
          variant="contained" 
          color="primary" 
          onClick={startCamera}
          startIcon={<i className="fa fa-camera" aria-hidden="true"></i>}
        >
          Use Camera
        </Button>
      )}
    </Box>
  );
});

export default CameraCapture;