import React, { useState, useEffect } from "react";
import { setDoc, doc } from "firebase/firestore";
import { db, auth } from "./../../dbConfig/firebase";
import UploadEventImage from "./UploadEventImage";
import { useNavigate } from "react-router-dom";
import "./CreateNewEvent.css"; // Import the CSS file
import createEventImage from "./createEvent.png";

const generateCustomEventId = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 3; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  result += "-";
  for (let i = 0; i < 3; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  result += "-";
  for (let i = 0; i < 3; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

function CreateEvent() {
  const [eventName, setEventName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [organizerId, setOrganizerId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [eventImageUrl, setEventImageUrl] = useState(null);
  const [imageUploadComplete, setImageUploadComplete] = useState(false);
  const navigate = useNavigate();

  const handleImageUpload = (url) => {
    setEventImageUrl(url);
    setImageUploadComplete(true);
  };

  useEffect(() => {
    const organizer = auth.currentUser ? auth.currentUser.uid : "test-user";
    setOrganizerId(organizer);
  }, []);

  const handleCreateEvent = async (e) => {
    e.preventDefault();

    if (!imageUploadComplete) {
      setError("Please upload an image before creating the event.");
      return;
    }

    setIsLoading(true);

    try {
      const newEventId = generateCustomEventId();
      const qrCodeValue = newEventId;

      await setDoc(doc(db, "Events", newEventId), {
        id: newEventId,
        name: eventName,
        description,
        start_date: new Date(startDate),
        end_date: endDate ? new Date(endDate) : null,
        qr_code: qrCodeValue,
        organizer_id: organizerId,
        image_url: eventImageUrl,
      });

      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrCodeValue}`;

      navigate("/event-details", {
        state: {
          eventId: newEventId,
          eventName,
          description,
          startDate,
          endDate,
          qrCodeUrl,
          eventImageUrl,
        },
      });
    } catch (err) {
      console.error("Error adding event: ", err);
      setError(err.message || "An error occurred while creating the event");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-event-main-container">
      <div className="create-event-container">
        <div className="create-event-image">
          <img src={createEventImage} alt="Event" />
        </div>
        <div className="create-event-form-main-container">
          <div className="create-event-form-container">
            <p className="create-event-title">Create Event</p>
            <form className="create-event-form" onSubmit={handleCreateEvent}>
              <div className="create-event-form-group">
                <label className="create-event-label" htmlFor="eventName">
                  Event Name
                </label>
                <input
                  type="text"
                  id="eventName"
                  placeholder="Enter event name"
                  className="create-event-form-control"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  required
                />
              </div>
              <div className="create-event-form-group">
                <label className="create-event-label" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  placeholder="Enter event description"
                  className="create-event-form-control"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="create-event-form-group-date-container">
              <div className="create-event-form-group">
                <label className="create-event-label" htmlFor="startDate">
                  Start Date
                </label>
                <input
                  type="datetime-local"
                  id="startDate"
                  className="create-event-form-control"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              <div className="create-event-form-group">
                <label className="create-event-label" htmlFor="endDate">
                  End Date
                </label>
                <input
                  type="datetime-local"
                  id="endDate"
                  className="create-event-form-control"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              </div>
              <UploadEventImage onImageUpload={handleImageUpload} />
              <div className="create-event-form-group">
                {isLoading ? (
                  <div className="loading-spinner"></div>
                ) : (
                  <button
                    type="submit"
                    className="create-event-button"
                    disabled={isLoading || !imageUploadComplete}
                  >
                    Create Event
                  </button>
                )}
              </div>
              {error && <p className="error-message">{error}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateEvent;
