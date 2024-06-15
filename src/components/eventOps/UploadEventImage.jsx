import React, { useState } from 'react';
import { storage } from '../../dbConfig/firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import './UploadEventImage.css'; // Import the CSS file

function UploadEventImage({ onImageUpload }) {
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = (e) => {
    e.preventDefault(); // Prevent form submission if button is inside a form

    if (!image) return;

    const storageRef = ref(storage, `eventImages/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgress(prog);
      },
      (error) => console.log(error),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          onImageUpload(downloadURL); // Pass the download URL back to the parent
        });
      }
    );
  };

  return (
    <div className="create-event-image-uploader">
      <label className="choose-image-button">
        {/* Choose Image */}
        <input type="file" hidden onChange={handleChange} className='choose-file-input-type'/>
      </label>
      <button
        className="upload-button"
        onClick={handleUpload}
        disabled={!image}
      >
        Upload Image
      </button>
      {progress > 0 && (
        <div className="progress-bar">
          <progress value={progress} max="100"></progress>
          <span>{`Uploaded ${progress}%`}</span>
        </div>
      )}
    </div>
  );
}

export default UploadEventImage;
