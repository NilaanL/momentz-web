import React from 'react';
import MainComponent from './MainComponent';
import ResponsiveAppBar from '../../UI/NavBar';
import { useMediaQuery } from '@mui/material';

const GuestDashBoard = () => {
  const isDesktop = useMediaQuery('(min-width:768px)'); // Define your breakpoint here

  return (
    <React.Fragment>
      {isDesktop && <ResponsiveAppBar />}
      <MainComponent />
    </React.Fragment>
  );
}

export default GuestDashBoard;