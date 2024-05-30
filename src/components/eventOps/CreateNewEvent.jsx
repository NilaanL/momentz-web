import React, { useState, useEffect } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from './../../dbConfig/firebase'; // Import your firebase configuration
import { v4 as uuidv4 } from 'uuid'; // To generate unique IDs
import UploadEventImage from './UploadEventImage';

function CreateEvent() {
  const [eventName, setEventName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [organizerId, setOrganizerId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [eventImageUrl, setEventImageUrl] = useState(null);
  const [imageUploadComplete, setImageUploadComplete] = useState(false);

  const handleImageUpload = (url) => {
    setEventImageUrl(url);
    setImageUploadComplete(true);
  };

  useEffect(() => {
    // Fetch organizer ID from local storage or use default
    const organizer = localStorage.getItem('username') || 'test_user';
    setOrganizerId(organizer);

    // Generate QR code based on event name
    setQrCode(`${eventName}-${uuidv4()}`);
  }, [eventName]);

  const handleCreateEvent = async (e) => {
    e.preventDefault();

    // Check if image upload is complete
    if (!imageUploadComplete) {
      setError('Please upload an image before creating the event.');
      return;
    }

    setIsLoading(true);

    try {
      const eventRef = await addDoc(collection(db, 'Events'), {
        name: eventName,
        description,
        start_date: new Date(startDate), // Convert to Firestore Timestamp
        end_date: endDate ? new Date(endDate) : null, // Convert to Firestore Timestamp if provided
        qr_code: qrCode,
        organizer_id: organizerId,
        image_url: eventImageUrl,
      });

      console.log('Event created with ID: ', eventRef.id);
    } catch (err) {
      console.error('Error adding event: ', err);
      setError(err.message || 'An error occurred while creating the event');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleCreateEvent}>
      <div>
        <label htmlFor="eventName">Event Name:</label>
        <input
          type="text"
          id="eventName"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="description">Description:</label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="startDate">Start Date:</label>
        <input
          type="datetime-local"
          id="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="endDate">End Date:</label>
        <input
          type="datetime-local"
          id="endDate"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <UploadEventImage onImageUpload={handleImageUpload} />

      <button type="submit" disabled={isLoading || !imageUploadComplete}>
        {isLoading ? 'Creating...' : 'Create Event'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}

export default CreateEvent;
