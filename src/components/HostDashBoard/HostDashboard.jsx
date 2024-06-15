import React, { useState, useEffect } from 'react';
import { auth, db } from './../../dbConfig/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from "firebase/auth";
import HostSideBar from './HostSideBar';
import EventDetails from './EventDetails';
import GuestList from './GuestList';
import AllPhotos from './AllPhotos';
import Reports from './Reports';
import FaceGroups from './FaceGroups';
import CircularProgress from '@mui/material/CircularProgress';
import './HostDashboard.css';
import HostDashboardNavBar from './HostDashBoardNavBar';
import { useMediaQuery } from '@mui/material';


const HostDashboard = () => {
  const [user, setUser] = useState(null);
  const [event, setEvent] = useState(null);
  const [currentSection, setCurrentSection] = useState('eventDetails');
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const isMobile = useMediaQuery('(max-width:768px)');


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
      <div className="host-dashboard-loading-container">
        <CircularProgress />
        <div>Loading...</div>
      </div>
    );
  }

  if (!user || !event) {
    return <div className="host-dashboard-loading-failed">Loading failed. Please try again.</div>;
  }

  return (
    <div className="host-dashboard-container">
      { !isMobile && <HostSideBar user={user} setCurrentSection={setCurrentSection} />}
      {isMobile && <HostDashboardNavBar user={user} setCurrentSection={setCurrentSection} />}
      <div className="host-dashboard-main-content">
        {currentSection === 'eventDetails' && <EventDetails event={event} />}
        {currentSection === 'guestList' && <GuestList eventId={event.id} />}
        {currentSection === 'allPhotos' && <AllPhotos eventId={event.id} />}
        {currentSection === 'reports' && <Reports eventId={event.id} />}
        {currentSection === 'faceGroups' && <FaceGroups eventId={event.id} />}
      </div>
    </div>
  );
};

export default HostDashboard;