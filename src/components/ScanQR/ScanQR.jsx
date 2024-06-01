import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect, useState } from 'react';
import { db, auth } from './../../dbConfig/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import React from 'react';

const ScanQR = () => {
  const [scanResult, setScanResult] = useState(null);
  const [manualSerialNumber, setManualSerialNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: { width: 250, height: 250 },
      fps: 5,
    });

    let isScanning = true;

    scanner.render(success, error);

    function success(result) {
      if (isScanning) {
        scanner.clear();
        setScanResult(result);
        handleJoinEvent(result); // Add attendee to event
        isScanning = false;
      }
    }

    function error(err) {
      console.warn(err);
    }
  }, []);

  const handleJoinEvent = async (eventId) => {
    setIsLoading(true);

    try {
      const userId = auth.currentUser ? auth.currentUser.uid : 'test-user';
      const attendeeRef = doc(db, 'Events', eventId, 'Event_Attendees', userId);

      await setDoc(attendeeRef, {
        user_id: userId,
        join_date: serverTimestamp(),
      });

      console.log('User added to event attendees: ', userId);
    } catch (err) {
      console.error('Error joining event: ', err);
      setError(err.message || 'An error occurred while joining the event');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSerialNumberChange = (event) => {
    setManualSerialNumber(event.target.value);
  };

  return (
    <div className="App">
      <h1>QR Scanning Code</h1>
      {scanResult ? (
        <div>
          <p>Success: <a href={scanResult}>{scanResult}</a></p>
          <p>Event ID: {scanResult}</p>
        </div>
      ) : (
        <div>
          <div id="reader"></div>
          <p className="center-text">Or enter the event ID manually:</p>
          <div className="center-input">
            <input
              type="text"
              value={manualSerialNumber}
              onChange={handleManualSerialNumberChange}
            />
            <button
              onClick={() => handleJoinEvent(manualSerialNumber)}
              disabled={isLoading}
            >
              Join Event
            </button>
          </div>
        </div>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ScanQR;
