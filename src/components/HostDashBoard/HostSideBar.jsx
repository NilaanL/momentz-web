import React from 'react';
import { Avatar, Button } from '@mui/material';
import './HostSideBar.css';

const HostSideBar = ({ user, setCurrentSection }) => {
  return (
    <div className="host-sidebar">
      <div className="profile-section">
        <Avatar src={user.photoURL} alt={user.displayName} className="profile-picture" />
        <h2 className="profile-name">{user.displayName}</h2>
      </div>
      <div className="nav-section">
        <Button variant="contained" className="nav-button" onClick={() => setCurrentSection('eventDetails')}>Event Details</Button>
        <Button className="nav-button" onClick={() => setCurrentSection('guestList')}>Guest List</Button>
        <Button className="nav-button" onClick={() => setCurrentSection('allPhotos')}>All Photos</Button>
        <Button className="nav-button" onClick={() => setCurrentSection('reports')}>Reports</Button>
        <Button className="nav-button" onClick={() => setCurrentSection('faceGroups')}>Face Groups</Button>
      </div>
      <div className="bottom-section">
        <Button className="logout-button">Logout</Button>
        <Button className="help-button">? Help</Button>
      </div>
    </div>
  );
};

export default HostSideBar;