import React from 'react';
import HostDashboard from './HostDashboard';
import ResponsiveAppBar from '../../UI/NavBar';
import { useMediaQuery } from '@mui/material';

const HostDashBoardRoute = () => {
    const isDesktop = useMediaQuery('(min-width:768px)');

    return ( 
        <React.Fragment>
            {isDesktop && <ResponsiveAppBar />}
            <HostDashboard />
        </React.Fragment>
    );
}
 
export default HostDashBoardRoute;