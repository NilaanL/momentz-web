import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import GenQR from "../components/GenQR/GenQR";
import App from "../App";
import ScanQR from "../components/joinEvent/ScanQR";
import GoogleAuth from "../components/googleAuth/GoogleAuth";
import GetAllEventApp from "../components/eventOps/GetAllEvent";
import CreateEvent from "../components/eventOps/CreateNewEvent";
import MyEvents from "../components/eventOps/ListMyEvent";
import EditEvent from "../components/eventOps/EditEvent";
import EventDetails from "../components/eventOps/EventDetails";
import PhotoUpload from "../components/joinEvent/PhotoUpload";
import EventConfirmation from "../components/joinEvent/EventConfirmation";
import EventDashboard from "../components/eventDashBoard/EventDashBoard";
import HomePage from "../Pages/Homepage";

const router = createBrowserRouter([
  { path: "/", element: <App />},
  { path:"/home", element: <HomePage/>},
  { path: "/genQR", element: <GenQR /> },
  { path: "/joinEvent", element: <ScanQR/> },
  { path: "/login", element: <GoogleAuth/> },
  { path: "/getAllevent", element: <GetAllEventApp/> },
  { path: "/createEvent", element: <CreateEvent/> },
  { path: "/myEvents", element: <MyEvents/> },
  { path: "/edit-event/:eventId", element: <EditEvent/> },
  { path: "/event-details", element: <EventDetails/> },
  { path: "/upload-photos", element: <PhotoUpload/> },
  {path:"/event-confirmation", element:<EventConfirmation/>},
  {path:"/event-dashboard", element:<EventDashboard/>}

]);

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
