import React from 'react';
import ResponsiveAppBar from '../UI/NavBar';
import FloatContent from '../UI/Float';
import EventDemoCard from '../UI/EventDemoCard';
import StepProcessCard from '../UI/StepProcess';
import Footer from '../UI/Footer';
const HomePage = () => {
    return ( <React.Fragment>
        <ResponsiveAppBar/>
        <FloatContent/>
        <EventDemoCard/>
        <StepProcessCard/>
        <Footer/>
        


    </React.Fragment> );
}
 
export default HomePage;