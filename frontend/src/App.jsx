import React, { useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { AppContext } from "./context/AppContext";

import Home from "./pages/Home";
import Services from "./pages/Services";
import Login from "./pages/Login";
import About from "./pages/About";
import Contact from "./pages/Contact";
import MyProfile from "./pages/MyProfile";
import MyAppointments from "./pages/MyAppointments";
import Appointment from "./pages/Appointment";
import Payment from "./pages/Payment";
import VideoCall from "./pages/VideoCall";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const App = () => {
  const { token } = useContext(AppContext);
  const authToken = token || window.localStorage.getItem("adminToken");

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Navbar */}
      <Navbar />

      {/* Content */}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:speciality" element={<Services />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          <Route
            path="/my-profile"
            element={authToken ? <MyProfile /> : <Navigate to="/login" />}
          />
          <Route
            path="/my-appointments"
            element={authToken ? <MyAppointments /> : <Navigate to="/login" />}
          />

          <Route path="/appointment/:serviceId" element={<Appointment />} />
          <Route
            path="/payment/:appointmentId"
            element={authToken ? <Payment /> : <Navigate to="/login" />}
          />
          <Route
            path="/call/:appointmentId"
            element={authToken ? <VideoCall /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>

      <Footer />
    </div>
  );
};

export default App;
