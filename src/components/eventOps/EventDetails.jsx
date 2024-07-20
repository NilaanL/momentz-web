import React from "react";
import { useLocation } from "react-router-dom";
import "./EventDetails.css";
import ResponsiveAppBar from "../../UI/NavBar";

const EventDetails = () => {
  const location = useLocation();
  const {
    eventId,
    eventName,
    description,
    startDate,
    endDate,
    qrCodeUrl,
    eventImageUrl,
  } = location.state;

  const downloadQR = () => {
    fetch(qrCodeUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", `qrcode-${eventId}.png`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
  };

  return (
    <React.Fragment>

    <ResponsiveAppBar/>
    <div className="event-details-container">
      <div className="event-details-top-color"></div>
      <div className="event-details-box">
        {/* <h1 className="event-details-title">Event Created Successfully</h1> */}

        <div className="event-details-left-box">
          {eventImageUrl && (
            <img
              src={eventImageUrl}
              alt="Event"
              className="event-details-image"
            />
          )}
          <div className="event-details-date-duration">
          <p className="event-details-start-date">
            <strong>Starts on:</strong> <br />
            {new Date(startDate).toLocaleString()}
          </p>
          <p className="event-details-end-date">
            <strong> Ends on: </strong>
            <br />
            {endDate ? new Date(endDate).toLocaleString() : "N/A"}
          </p>
          </div>
        </div>
        <div className="event-details-right-box">
          <div className="event-details-name-description-box">
            <h2 className="event-details-name">{eventName}</h2>
            <p className="event-details-description">{description}</p>
          </div>
          <img
            src={qrCodeUrl}
            alt="QR Code"
            className="event-details-qr-code"
          />
          <button className="event-details-button" onClick={downloadQR}>
            Download QR Code
          </button>
        </div>
      </div>
    </div>
    </React.Fragment>
  );
};

export default EventDetails;
