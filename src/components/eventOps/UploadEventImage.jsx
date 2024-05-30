import React, { useState } from 'react';
import { storage } from '../../dbConfig/firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

function UploadEventImage({ onImageUpload }) {
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
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
    <div>
      <input type="file" onChange={handleChange} />
      <button onClick={handleUpload}>Upload Image</button>
      <p>Uploaded {progress}%</p>
    </div>
  );
}

export default UploadEventImage;
