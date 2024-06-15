import React, { useState, useEffect } from 'react';
import { auth, db } from './../../dbConfig/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from "firebase/auth";
import SideBar from './SideBar';
import TopBar from './TopBar';
import YourEventPhotos from './YourEventPhotos';
import UploadEventPhotos from './UploadEventPhotos';
import Favorites from './Favorites';
import ListView from './ListView';
import CircularProgress from '@mui/material/CircularProgress';
import './MainComponent.css';
import { useMediaQuery } from '@mui/material';
import DashboardNavBar from './DashboardNavBar';

const MainComponent = () => {
  const [user, setUser] = useState(null);
  const [event, setEvent] = useState(null);
  const [currentSection, setCurrentSection] = useState('yourPhotos');
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);

  const isMobile = useMediaQuery('(max-width:768px)'); // Define your breakpoint here

  useEffect(() => {
    const fetchEvent = async () => {
      const eventId = localStorage.getItem('eventId');
      if (eventId) {
        const eventDoc = await getDoc(doc(db, 'Events', eventId));
        if (eventDoc.exists()) {
          setEvent(eventDoc.data());
        } else {
          console.log('Event document does not exist');
        }
      } else {
        console.log('No eventId found in localStorage');
      }
    };

    const initialize = async () => {
      setLoading(true);
      await fetchEvent();
      setLoading(false);
    };

    onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await initialize();
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });
  }, []);

  if (authLoading || loading) {
    return (
      <div className="loading-container">
        <CircularProgress />
        <div>Loading...</div>
      </div>
    );
  }

  if (!user || !event) {
    return <div>Loading failed. Please try again.</div>;
  }

  return (
    <React.Fragment>
      <div className="main-container">
        <SideBar user={user} setCurrentSection={setCurrentSection} />
        {isMobile && <DashboardNavBar user={user} setCurrentSection={setCurrentSection} />}
        <div className="main-content">
          <TopBar event={event} />
          <div className="content">
            {currentSection === 'yourPhotos' && <YourEventPhotos eventId={event.id} userId={user.uid} />}
            {currentSection === 'uploadPhotos' && <UploadEventPhotos eventId={event.id} userId={user.uid} />}
            {currentSection === 'favorites' && <Favorites eventId={event.id} userId={user.uid} />}
            {currentSection === 'list' && <ListView eventId={event.id} userId={user.uid} />}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default MainComponent;