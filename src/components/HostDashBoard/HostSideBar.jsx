import React from 'react';
import { Avatar, Button } from '@mui/material';
import './HostSideBar.css';

const HostSideBar = ({ user, setCurrentSection }) => {
  return (
    <div className="host-sidebar-container">
      <div className="host-sidebar-profile-section">
        <Avatar src={user.photoURL} alt={user.displayName} className="host-sidebar-profile-picture" />
        <h2 className="host-sidebar-profile-name">{user.displayName}</h2>
      </div>
      <div className="host-sidebar-nav-section">
        <Button variant="contained" className="host-sidebar-nav-button" onClick={() => setCurrentSection('eventDetails')}>Event Details</Button>
        <Button className="host-sidebar-nav-button" onClick={() => setCurrentSection('guestList')}>Guest List</Button>
        <Button className="host-sidebar-nav-button" onClick={() => setCurrentSection('allPhotos')}>All Photos</Button>
        <Button className="host-sidebar-nav-button" onClick={() => setCurrentSection('reports')}>Reports</Button>
        <Button className="host-sidebar-nav-button" onClick={() => setCurrentSection('faceGroups')}>Face Groups</Button>
      </div>
      <div className="host-sidebar-bottom-section">
        <Button className="host-sidebar-logout-button">Logout</Button>
        <Button className="host-sidebar-help-button">? Help</Button>
      </div>
    </div>
  );
};

export default HostSideBar;