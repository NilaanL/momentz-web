import React, { useState, useEffect } from 'react';
import { auth, db } from './../../dbConfig/firebase';
import { doc, getDoc } from 'firebase/firestore';
import SideBar from './SideBar';
import TopBar from './TopBar';
import YourEventPhotos from './YourEventPhotos';
import UploadEventPhotos from './UploadEventPhotos';
import Favorites from './Favorites';
import ListView from './ListView';
import CircularProgress from '@mui/material/CircularProgress';
import './MainComponent.css';

const MainComponent = () => {
  const [user, setUser] = useState(null);
  const [event, setEvent] = useState(null);
  const [currentSection, setCurrentSection] = useState('yourPhotos');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        setUser(currentUser);
        console.log('Current user:', currentUser);
      } else {
        console.log('No current user');
      }
    };

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
      await fetchUser();
      await fetchEvent();
      setLoading(false);
    };

    initialize();
  }, []);

  if (loading) {
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
    <div className="main-container">
      <SideBar user={user} setCurrentSection={setCurrentSection} />
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
  );
};

export default MainComponent;