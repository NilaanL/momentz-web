import React from 'react';
import './TopBar.css';

const TopBar = ({ event }) => {
  return (
    <div className="topbar">
      <div className="event-details">
      <h1 className='event-title' >{event.name}</h1>
        <h2 className="event-title">{event.title}</h2>
        <p className="event-description">{event.description}</p>
        <p className="event-dates">
          From {new Date(event.startDate).toLocaleString()} to {new Date(event.endDate).toLocaleString()}
        </p>
        <p className="event-id">Event ID: {event.id}</p>
      </div>
    </div>
  );
};

export default TopBar;