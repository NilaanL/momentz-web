import React, { useState, useEffect } from 'react';
import { auth, db } from './../../dbConfig/firebase';
import { doc, getDoc } from 'firebase/firestore';
import HostSideBar from './HostSideBar';
import EventDetails from './EventDetails';
import GuestList from './GuestList';
import AllPhotos from './AllPhotos';
import Reports from './Reports';
import FaceGroups from './FaceGroups';
import './HostDashboard.css';

const HostDashboard = () => {
  const [user, setUser] = useState(null);
  const [event, setEvent] = useState(null);
  const [currentSection, setCurrentSection] = useState('eventDetails');

  useEffect(() => {
    const fetchUser = () => {
      const currentUser = auth.currentUser;
      setUser(currentUser);
      console.log('Current user:', currentUser);
      
    };

    const fetchEvent = async () => {
      const eventId = localStorage.getItem('eventId');
      const eventDoc = await getDoc(doc(db, 'Events', eventId));
      if (eventDoc.exists()) {
        setEvent(eventDoc.data());
      }
    };

    fetchUser();
    fetchEvent();
  }, []);

  if (!user || !event) {
    return <div>Loading...</div>;
  }

  return (
    <div className="host-dashboard-container">
      <HostSideBar user={user} setCurrentSection={setCurrentSection} />
      <div className="host-main-content">
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