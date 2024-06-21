import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./JoinAs.css";
const JoinAsRole = () => {
    const navigate = useNavigate();

    const handleClickGuest = () => {  
        navigate('/joinEvent');
      };
    const handleClickHost=()=>{
        navigate('/createEvent')
    };
     

    return ( <React.Fragment>
        <div className='container-landing-join' id='join'>
        <div className="left-join">
                <img src='https://firebasestorage.googleapis.com/v0/b/momentz-dev.appspot.com/o/page_deco_images%2FnewLandingImg.png?alt=media&token=96a8f61d-0871-40ab-a50e-68a85958544e' className='ImgFormat-join' />
            </div>
            <div className="mid-join">
                <div className='IntroText-join'>
                Transform your event photos into an unforgettable experience with 'MomentZ'                </div>
        <div className="SubText-join">
                Our AI-powered platform makes sharing and reliving your<br/> special moments effortless. 
                </div>
            <div className='joinasrole'>
                <div className="button_join-join host" onClick={handleClickHost}>
                Join as Host
                </div>
                <div className='button_join-join guest' onClick={handleClickGuest} >
                Join as Guest
                </div>
            </div>             
         </div>
            <div className="right-join">
                <img src='https://firebasestorage.googleapis.com/v0/b/momentz-dev.appspot.com/o/page_deco_images%2FnewLandingImg.png?alt=media&token=96a8f61d-0871-40ab-a50e-68a85958544e' className='ImgFormat-join' />
            </div>

        </div>


    </React.Fragment> );
}
 
export default JoinAsRole;