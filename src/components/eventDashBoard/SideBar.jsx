import React, { useState } from 'react';
import { Avatar, Button, IconButton, Drawer } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import './SideBar.css';

const GuestSidebar = ({ user, setCurrentSection }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setIsDrawerOpen(open);
  };

  const sidebarContent = (
    <>
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
    </>
  );

  return (
    <>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={toggleDrawer(true)}
        className="guest-sidebar-menu-button"
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        anchor="left"
        open={isDrawerOpen}
        onClose={toggleDrawer(false)}
        classes={{ paper: 'guest-sidebar' }}
      >
        <IconButton onClick={toggleDrawer(false)} className="guest-sidebar-close-button">
          <CloseIcon />
        </IconButton>
        {sidebarContent}
      </Drawer>
      <div className="guest-sidebar guest-sidebar-desktop">
        {sidebarContent}
      </div>
    </>
  );
};

export default GuestSidebar;