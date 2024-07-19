import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';

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
    <div>
      {isCameraOn ? (
        <div className='join-event-camera-container'>
          <video ref={videoRef} autoPlay></video>
          <button className='join-event-use-camera-button' onClick={capturePhoto}>
            Capture Photo
          </button>
          <button className='join-event-use-camera-button' onClick={() => ref.current.stopCamera()}>
            Stop Camera
          </button>
          <div>Photos Taken: {photoCount}</div>
        </div>
      ) : (
        <button className='join-event-use-camera-button' onClick={startCamera}>
          <i className="fa fa-camera" aria-hidden="true"></i> Use Camera
        </button>
      )}
    </div>
  );
});

export default CameraCapture;