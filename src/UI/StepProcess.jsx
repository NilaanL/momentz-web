import React from 'react';
import './StepProcess.css';

const StepProcessCard = () => {
  const cardData = [
    {
      title: "Create Event & Invite guests",
      description: "Create an event, upload photos and invite all guests",
      imageUrl: "https://firebasestorage.googleapis.com/v0/b/momentz-dev.appspot.com/o/page_deco_images%2FRectangle%206.png?alt=media&token=852ff268-9384-4654-adb5-ba2aa759996c", // Replace with your actual image path
    },
    {
      title: "Click a Selfie to register you",
      description: "Guest opens the link & clicks a selfie to find their photos",
      imageUrl: "https://firebasestorage.googleapis.com/v0/b/momentz-dev.appspot.com/o/page_deco_images%2FRectangle%206-1.png?alt=media&token=3c66c8a3-3773-4716-8b2b-f562a1bf2b25", // Replace with your actual image path
    },
    {
      title: "Save and share photos",
      description: "Guests can view, buy, download & share photos",
      imageUrl: "https://firebasestorage.googleapis.com/v0/b/momentz-dev.appspot.com/o/page_deco_images%2FRectangle%206-2.png?alt=media&token=9ac9fb77-bb2c-4232-b887-88b7484ab6f6", // Replace with your actual image path
    },
  ];

  return (
    <div className='container-card-step'>
        <hr/>
        <p className="para-head-card">
        Discover the simplicity of our process
      </p>

    <div className="step-card-list">
      {cardData.map((card, index) => (
        <Card
          key={index}
          title={card.title}
          description={card.description}
          imageUrl={card.imageUrl}
        />
      ))}
    </div>

    </div>
  );
};

const Card = ({ title, description, imageUrl }) => {
  return (
    <div className="step-card">
      <h3>{title}</h3>
      <p>{description}</p>
      <img src={imageUrl} alt={title} />
    </div>
  );
};

export default StepProcessCard;
