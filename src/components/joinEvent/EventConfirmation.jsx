import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "./../../dbConfig/firebase";
import { doc, getDoc } from "firebase/firestore";
import "./EventConfirmation.css";
import eventPng from "./eventConfirmation.png";

const EventConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { eventId, userId } = location.state;
  const [eventDetails, setEventDetails] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const eventDoc = await getDoc(doc(db, "Events", eventId));
        const userDoc = await getDoc(
          doc(db, "Events", eventId, "Event_Attendees", userId)
        );

        if (eventDoc.exists() && userDoc.exists()) {
          setEventDetails(eventDoc.data());
          setUserDetails(userDoc.data());
        } else {
          setError("Event or user not found.");
        }
      } catch (err) {
        setError("An error occurred while fetching the details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [eventId, userId]);

  if (loading) {
    return <span className="event-confirmation-loading">Loading...</span>;
  }

  if (error) {
    return <span className="event-confirmation-error">{error}</span>;
  }

  const handleClick = () => {
    localStorage.setItem("eventId", eventId);
    localStorage.setItem("userId", userId);
    navigate("/event-dashboard");
  };

  return (
    <div className="event-confirmation-container">
      <div className="event-confirmation-header-container">
        <div className="event-confirmation-header">
          <span className="event-confirmation-title">{eventDetails.name}</span>
          <span className="event-confirmation-description">
            Let's keep the birthday spirit alive and celebrate the beautiful
            memories we created together!
          </span>
          <button className="event-confirmation-button" onClick={handleClick}>
            Go to event dashboard
          </button>
        </div>
        <div className="event-confirmation-png">
          <img src={eventPng} alt="png" />
        </div>
      </div>

      <div className="event-confirmation-twitter-post">
        <div className="event-confirmation-post-content-one">
          <div className="event-confirmation-event-image">
            <img src={eventDetails.image_url} alt="Event" />
          </div>
          <div className="event-confirmation-event-info">
            <span className="event-confirmation-subtitle">Join Us</span>
            <div className="event-confirmation-detail">
              <strong>From:</strong><br/>{" "}
              {eventDetails.start_date.toDate().toLocaleString()}
            </div>
            <div className="event-confirmation-detail">
              <strong>To:</strong><br/>{" "}
              {eventDetails.end_date
                ? eventDetails.end_date.toDate().toLocaleString()
                : "N/A"}
            </div>
          </div>
        </div>
      </div>

      <div className="event-confirmation-twitter-post">
        <div className="event-confirmation-post-content-two">
          <div className="event-confirmation-user-info">
            <div className="event-confirmation-detail">
              <strong>User ID:</strong><br/> {userId}
            </div>
            <div className="event-confirmation-detail">
              <strong>Joined Date:</strong><br/>{" "}
              {userDetails.join_date.toDate().toLocaleString()}
            </div>
          </div>
          <div className="event-confirmation-user-photos-container">
            <div className="event-confirmation-user-photos">
              {userDetails.photos &&
                userDetails.photos.map((url, index) => (
                  <div className="event-confirmation-photo" key={index}>
                    <img src={url} alt={`User ${index + 1}`} />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventConfirmation;
