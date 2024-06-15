import React, { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db, storage } from "./../../dbConfig/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import CameraCapture from "./CameraCapture";
import "./PhotoUpload.css";
import uploadPhoto from "./uploadPhoto.png";
import { Box, Typography, Button, CircularProgress, TextField, LinearProgress } from "@mui/material";

const PhotoUpload = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { eventId, userId } = location.state;
  const [files, setFiles] = useState([]);
  const [cameraPhotos, setCameraPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const cameraRef = useRef();

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleCameraCapture = (dataUrl) => {
    setCameraPhotos((prevPhotos) => [...prevPhotos, dataUrl]);
  };

  const handleUpload = async () => {
    const totalPhotos = files.length + cameraPhotos.length;
    if (totalPhotos < 3) {
      setError("Please upload or capture at least 3 photos.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const uploadedUrls = [];
    try {
      const uploadPromises = [];

      for (const file of files) {
        const storageRef = ref(
          storage,
          `events/${eventId}/attendees/${userId}/${file.name}`
        );
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadPromises.push(
          new Promise((resolve, reject) => {
            uploadTask.on(
              "state_changed",
              (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(progress);
              },
              (error) => reject(error),
              async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                uploadedUrls.push(downloadURL);
                resolve();
              }
            );
          })
        );
      }

      for (const [index, dataUrl] of cameraPhotos.entries()) {
        const blob = await (await fetch(dataUrl)).blob();
        const storageRef = ref(
          storage,
          `events/${eventId}/attendees/${userId}/camera-photo-${index}.png`
        );
        const uploadTask = uploadBytesResumable(storageRef, blob);

        uploadPromises.push(
          new Promise((resolve, reject) => {
            uploadTask.on(
              "state_changed",
              (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(progress);
              },
              (error) => reject(error),
              async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                uploadedUrls.push(downloadURL);
                resolve();
              }
            );
          })
        );
      }

      await Promise.all(uploadPromises);

      const attendeeRef = doc(db, "Events", eventId, "Event_Attendees", userId);
      await updateDoc(attendeeRef, {
        photos: arrayUnion(...uploadedUrls),
      });

      cameraRef.current.stopCamera(); // Stop the camera
      navigate("/event-confirmation", { state: { eventId, userId } });
    } catch (err) {
      console.error("Error uploading photos: ", err);
      setError("An error occurred while uploading photos.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box className="upload-photo-join-event-container">
      <Box className="upload-photo-join-event">
        <Typography variant="h4" className="upload-photo-join-event-title">
          Your face, your key! <br /> Upload three photos <br /> To unlock face recognition
        </Typography>
        <CameraCapture ref={cameraRef} onCapture={handleCameraCapture} photoCount={cameraPhotos.length} />
        <Box className="join-event-upload-photo-line-container">
          <Box className="join-event-upload-photo-line"></Box>
          <Typography className="join-event-upload-photo-center-text-or">OR</Typography>
          <Box className="join-event-upload-photo-line"></Box>
        </Box>
        <TextField
          className="join-event-upload-photo-choose-file"
          type="file"
          inputProps={{ multiple: true }}
          onChange={handleFileChange}
          variant="outlined"
        />
        {isLoading ? (
          <>
            <CircularProgress />
            <LinearProgress variant="determinate" value={uploadProgress} sx={{ mt: 2, width: '100%' }} />
          </>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            className="join-event-upload-photos-button"
          >
            Upload Photos
          </Button>
        )}
        {error && <Typography color="error">{error}</Typography>}
      </Box>
      <Box className="upload-photo-join-event-image-container">
        <img src={uploadPhoto} alt="uploadPhoto" />
      </Box>
    </Box>
  );
};

export default PhotoUpload;