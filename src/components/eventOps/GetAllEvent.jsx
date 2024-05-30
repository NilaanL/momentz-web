import React, { useState, useEffect } from 'react';
import { db } from '../../dbConfig/firebase';
import { collection, getDocs } from 'firebase/firestore';

const GetAllEventApp = () => {
    const [eventList, setEventList] = useState([]);
    const eventsCollectionRef = collection(db, "event");

    const getEventList = async () => {
        try {
          const data = await getDocs(eventsCollectionRef);
          const filteredData = data.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          setEventList(filteredData);
          console.log(filteredData);
        } catch (err) {
          console.error(err);
        }
      };
    
      useEffect(() => {
        getEventList();
      }, []);

    return ( 
        <div>
            {eventList.map(event => (
                <div key={event.id}>
                    {event.eventName}
                    {event.eventDate}
                    {event.eventDescription}
                </div>
            ))}
        </div>
     );
}

export default GetAllEventApp;



