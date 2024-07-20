import React from 'react';
import MainComponent from './MainComponent';
import ResponsiveAppBar from '../../UI/NavBar';
const GuestDashBoard = () => {
    return ( <React.Fragment>
    <ResponsiveAppBar/>
        <MainComponent/>
    </React.Fragment> );
}
 
export default GuestDashBoard;