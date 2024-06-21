import React from 'react';
import ResponsiveAppBar from '../UI/NavBar';
import CreateEvent from '../components/eventOps/CreateNewEvent';
import Footer from '../UI/Footer';
const CreateEventPage = () => {
    return ( <div>
        <ResponsiveAppBar/>
        <CreateEvent/>
        <Footer/>
    </div> );
}
 
export default CreateEventPage;