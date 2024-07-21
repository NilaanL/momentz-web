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
import EventDashboard from "../components/eventDashBoard/EventDashBoard";
import HomePage from "../Pages/Homepage";
import CreateEventPage from "../Pages/CreateEventPage";
import GuestDashBoard from "../components/eventDashBoard/GuestDashboard";
import HostDashBoardRoute from "../components/HostDashBoard/HostDashBoardComponent";
import EventConfirmationPage from "../Pages/EventConfirmationPage";

const router = createBrowserRouter([
  { path: "/", element: <HomePage />},
  { path:"/home", element: <HomePage/>},
  { path: "/genQR", element: <GenQR /> },
  { path: "/joinEvent", element: <ScanQR/> },
  { path: "/login", element: <GoogleAuth/> },
  { path: "/getAllevent", element: <GetAllEventApp/> },
  { path: "/createEvent", element: <CreateEventPage/> },
  { path: "/myEvents", element: <MyEvents/> },
  { path: "/edit-event/:eventId", element: <EditEvent/> },
  { path: "/event-details", element: <EventDetails/> },
  { path: "/upload-photos", element: <PhotoUpload/> },
  { path:"/event-confirmation", element:<EventConfirmationPage/>},
  { path:"/event-dashboard", element:<EventDashboard/>},
  { path:"/guest-dashboard", element:<GuestDashBoard/>},
  { path:"/host-dashboard", element:<HostDashBoardRoute/>}

]);

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
