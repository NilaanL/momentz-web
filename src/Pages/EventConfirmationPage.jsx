import React from 'react';
import ResponsiveAppBar from '../UI/NavBar';
import EventConfirmation from '../components/joinEvent/EventConfirmation';
import Footer from '../UI/Footer';
const EventConfirmationPage = () => {
    return ( 
        <React.Fragment>
        <ResponsiveAppBar/>
        <EventConfirmation/>
        <Footer/>
        </React.Fragment>
     );
}
 
export default EventConfirmationPage;