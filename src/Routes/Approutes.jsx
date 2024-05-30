import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import GenQR from "../components/GenQR/GenQR";
import App from "../App";
import ScanQR from "../components/ScanQR/ScanQR";
import GoogleAuth from "../components/googleAuth/GoogleAuth";
import GetAllEventApp from "../components/eventOps/GetAllEvent";
import CreateEvent from "../components/eventOps/CreateNewEvent";

const router = createBrowserRouter([
  { path: "/", element: <App />},
  { path: "/genQR", element: <GenQR /> },
  { path: "/joinEvent", element: <ScanQR/> },
  { path: "/login", element: <GoogleAuth/> },
  { path: "/getAllevent", element: <GetAllEventApp/> },
  { path: "/createEvent", element: <CreateEvent/> },
]);

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
