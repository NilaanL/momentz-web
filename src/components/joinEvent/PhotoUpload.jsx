import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db, storage } from "./../../dbConfig/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import CameraCapture from "./CameraCapture";
import "./PhotoUpload.css";
import uploadPhoto from "./uploadPhoto.png";
const PhotoUpload = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { eventId, userId } = location.state;
  const [files, setFiles] = useState([]);
  const [cameraPhotos, setCameraPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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
      for (const file of files) {
        const storageRef = ref(
          storage,
          `events/${eventId}/attendees/${userId}/${file.name}`
        );
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        uploadedUrls.push(downloadURL);
      }

      for (const [index, dataUrl] of cameraPhotos.entries()) {
        const blob = await (await fetch(dataUrl)).blob();
        const storageRef = ref(
          storage,
          `events/${eventId}/attendees/${userId}/camera-photo-${index}.png`
        );
        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);
        uploadedUrls.push(downloadURL);
      }

      const attendeeRef = doc(db, "Events", eventId, "Event_Attendees", userId);
      await updateDoc(attendeeRef, {
        photos: arrayUnion(...uploadedUrls),
      });

      navigate("/event-confirmation", { state: { eventId, userId } });
    } catch (err) {
      console.error("Error uploading photos: ", err);
      setError("An error occurred while uploading photos.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="upload-photo-join-event-container">
      <div className="upload-photo-join-event">
        <span className="upload-photo-join-event-title">
          Your face, your key! <br /> Upload three photos <br /> To unlock face
          recognition
        </span>
        <CameraCapture onCapture={handleCameraCapture} />
        <div className="join-event-upload-photo-line-container">
          <div className="join-event-upload-photo-line"></div>
          <span className="join-event-upload-photo-center-text-or">OR</span>
          <div className="join-event-upload-photo-line"></div>
        </div>
        <input
          className="join-event-upload-photo-choose-file"
          type="file"
          multiple
          onChange={handleFileChange}
        />
        {isLoading ? (
          <div className="loading">Loading...</div>
        ) : (
          <button
            onClick={handleUpload}
            className="join-event-upload-photos-button"
          >
            Upload Photos
          </button>
        )}
        {error && <div className="error">{error}</div>}
      </div>
      <div className="upload-photo-join-event-image-container">
        <img src={uploadPhoto} alt="uploadPhoto" />
      </div>
    </div>
  );
};

export default PhotoUpload;
