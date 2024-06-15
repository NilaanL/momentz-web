import React from 'react';
import ResponsiveAppBar from '../UI/NavBar';
import ScanQR from '../components/joinEvent/ScanQR';
const JoinEventPage = () => {
    return ( 
        <React.Fragment>
            <ResponsiveAppBar/>
            <ScanQR/>
        </React.Fragment>
     );
}
 
export default JoinEventPage;