import React from 'react';
import ResponsiveAppBar from '../UI/NavBar';
import PhotoUpload from '../components/joinEvent/PhotoUpload';
const UploadSelfies = () => {
    return ( 
        <React.Fragment>
            <ResponsiveAppBar/>
            <PhotoUpload/>
        </React.Fragment>
     );
}
 
export default UploadSelfies;