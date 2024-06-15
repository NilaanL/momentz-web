import React from 'react';
import GoogleAuth from '../components/googleAuth/GoogleAuth';
import ResponsiveAppBar from '../UI/NavBar';
const LoginPage = () => {
    return ( 
        <React.Fragment>
            <ResponsiveAppBar/>
            <GoogleAuth/>
        </React.Fragment>
     );
}
 
export default LoginPage;