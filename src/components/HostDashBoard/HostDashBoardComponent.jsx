import React from 'react';
import HostDashboard from './HostDashboard';
import ResponsiveAppBar from '../../UI/NavBar';
const HostDashBoardRoute = () => {
    return ( 
        <React.Fragment>
        <ResponsiveAppBar/>
        <HostDashboard/>
        </React.Fragment>
     );
}
 
export default HostDashBoardRoute;