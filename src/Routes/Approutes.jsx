import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import GenQR from "../components/GenQR/GenQR";
import App from "../App";
import ScanQR from "../components/ScanQR/ScanQR";

const router = createBrowserRouter([
  { path: "/", element: <App />},
  { path: "/genQR", element: <GenQR /> },
  { path: "/joinEvent", element: <ScanQR/> },
]);

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
