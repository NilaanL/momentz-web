// src/SmartCameraFeatures.js
import React from "react";
import "./EventDemoCard.css";

const events = [
  {
    icon: "https://firebasestorage.googleapis.com/v0/b/momentz-dev.appspot.com/o/page_deco_images%2Fbday.png?alt=media&token=7993cdc0-d9e1-46df-9af9-6813e6d4afe3",
    title: "Birth Day",
    description: "Cake, candles, and cherished memories!",
  },
  {
    icon: "https://firebasestorage.googleapis.com/v0/b/momentz-dev.appspot.com/o/page_deco_images%2Fimage.png?alt=media&token=b19c4b7f-c1f2-4d37-8b79-30f3ba374cb6",
    title: "Weddings",
    description: "A day filled with love and unforgettable moments!",
  },
  {
    icon: "https://firebasestorage.googleapis.com/v0/b/momentz-dev.appspot.com/o/page_deco_images%2Fimage-5.png?alt=media&token=ab4729da-113a-4685-beb6-4a41867838d3",
    title: "Convocations",
    description: "Walking the stage and turning the page.",
  },
  {
    icon: "https://firebasestorage.googleapis.com/v0/b/momentz-dev.appspot.com/o/page_deco_images%2Fsports%20meet.png?alt=media&token=d1b60fc7-7358-4ea2-9a54-28a10ee6dab9",
    title: "Sports meet",
    description: "Pushing limits and breaking barriers.",
  },
  {
    icon: "https://firebasestorage.googleapis.com/v0/b/momentz-dev.appspot.com/o/page_deco_images%2Fcampings.png?alt=media&token=074770c6-74f3-4485-a8c5-69f960b21e56",
    title: "Campings",
    description: "Making memories under the open sky.",
  },
  {
    icon: "https://firebasestorage.googleapis.com/v0/b/momentz-dev.appspot.com/o/page_deco_images%2Fcorporateevent.png?alt=media&token=e1e19b92-20df-4011-8b5f-f8085786d798",
    title: "Corporate Events",
    description: "Fostering collaboration and driving innovation.",
  },
];

const SmartCameraFeatures = () => {
  return (
    <div className="container-card">
      <p className="para-head">
        Our smart camera captures every perspective, making photo sharing
        seamless and automated with AI.
      </p>
      <div className="grid-x">
        {events.map((event, index) => (
          <div className="item-card" key={index}>
            <img className="item-img" src={event.icon} alt={event.title} />

            <div className="item-details-new">
              <h2 className="card-head">{event.title}</h2>
              <p className="card-sub">{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SmartCameraFeatures;
