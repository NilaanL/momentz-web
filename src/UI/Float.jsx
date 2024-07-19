import React from 'react';
import "./Float.css";
const FloatContent = () => {
    return ( <React.Fragment>
        <div className='container-landing'>
            <div className="left">
                <div className='IntroText'>
                Unlock Event Memories with Face Recognition
                </div>
                <div className="SubText">
                Automate and simplify photo sharing for your events. <br/>
Let AI do the work!
                </div>
                <a href="#join" className="page-scroll">
                <div className="button_join">
                Start sharing memories
                </div>
                </a>
                
            </div>
            <div className="right">
                <img src='https://firebasestorage.googleapis.com/v0/b/momentz-dev.appspot.com/o/page_deco_images%2FnewLandingImg.png?alt=media&token=96a8f61d-0871-40ab-a50e-68a85958544e' className='ImgFormat' />
            </div>

        </div>


    </React.Fragment> );
}
 
export default FloatContent;