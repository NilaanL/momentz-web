import React from 'react';
import { Avatar, Button } from '@mui/material';
import './SideBar.css';

const SideBar = ({ user, setCurrentSection }) => {
  return (
    <div className="sidebar">
      <div className="profile-section">
        <Avatar src={user.photoURL} alt={user.displayName} className="profile-picture" />
        <h2 className="profile-name">{user.displayName}</h2>
      </div>
      <div className="nav-section">
        <Button variant="contained" className="nav-button" onClick={() => setCurrentSection('yourPhotos')}>Your Event Photos</Button>
        <Button className="nav-button" onClick={() => setCurrentSection('uploadPhotos')}>Upload Event Photos</Button>
        <Button className="nav-button" onClick={() => setCurrentSection('favorites')}>Favorites</Button>
        <Button className="nav-button" onClick={() => setCurrentSection('list')}>List View</Button>
      </div>
      <div className="bottom-section">
        <Button className="logout-button">Logout</Button>
        <Button className="help-button">? Help</Button>
      </div>
    </div>
  );
};

export default SideBar;