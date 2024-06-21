import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useState } from "react";
import { db, auth } from "../../dbConfig/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import React from "react";
import "./ScanQR.css"; // Import the CSS file
import joinEventImage from "./scanqr.jfif";
import svgOne from "./svgviewer-output.png";
import svgTwo from "./svgviewer-output-two.png";

const ScanQR = () => {
  const [scanResult, setScanResult] = useState(null);
  const [manualSerialNumber, setManualSerialNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("join-event-reader", {});

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
      const userId = auth.currentUser ? auth.currentUser.uid : "test-user";
      const attendeeRef = doc(db, "Events", eventId, "Event_Attendees", userId);

      await setDoc(attendeeRef, {
        user_id: userId,
        join_date: serverTimestamp(),
      });

      console.log("User added to event attendees: ", userId);

      // Navigate to PhotoUpload component with event ID
      navigate("/upload-photos", {
        state: { eventId, userId },
      });
    } catch (err) {
      console.error("Error joining event: ", err);
      setError(err.message || "An error occurred while joining the event");
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSerialNumberChange = (event) => {
    setManualSerialNumber(event.target.value);
  };

  return (
    <div className="join-event-container">
     
    
      <div className="join-event-text-container">
      <div className="join-event-svg-one">
        <img src={svgOne} alt="svgOne" className="join-event-svg-one" />
      </div>
      <div className="join-event-svg-two">
        <img src={svgTwo} alt="svgTwo" className="join-event-svg-two" />
      </div>
        <div className="join-event-heading">
          Join us for a memorable
          <br /> celebration!
        </div>
        {scanResult ? (
          <div className="join-event-scan-qr">
            <p>
              Success: <a href={scanResult}>{scanResult}</a>
            </p>
            <p>Event ID: {scanResult}</p>
          </div>
        ) : (
          <div className="join-event-bottom">
            <div id="join-event-reader" className="join-event-qr-reader"></div>
            {/* <span className="join-event-center-text">Enter the Event ID</span> */}
            <div className="join-event-center-input">
              <input
                type="text"
                value={manualSerialNumber}
                onChange={handleManualSerialNumberChange}
                className="join-event-manual-input"
                placeholder="Scan QR or Enter Event ID"
              />
              <button
                onClick={() => handleJoinEvent(manualSerialNumber)}
                disabled={isLoading}
                className="join-event-join-button"
              >
                Join
              </button>
            </div>
          </div>
        )}
        {error && <p className="join-event-error-text">{error}</p>}
      </div>
      <div className="join-event-image-container">
        <img
          src={joinEventImage}
          alt="joinEvent"
          className="join-event-image"
        />
      </div>
    </div>
  );
};

export default ScanQR;
