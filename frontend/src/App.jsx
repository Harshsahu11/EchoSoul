import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Services from "./pages/Services";
import Login from "./pages/Login";
import About from "./pages/About";
import Contact from "./pages/Contact";
import MyProfile from "./pages/MyProfile";
import MyAppointments from "./pages/MyAppointments";
import Appointment from "./pages/Appointment";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const App = () => {
  const [token, setToken] = useState(null);

  // Load token from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) setToken(savedToken);
  }, []);

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
            element={token ? <MyProfile /> : <Navigate to="/login" />}
          />
          <Route
            path="/my-appointments"
            element={token ? <MyAppointments /> : <Navigate to="/login" />}
          />

          <Route path="/appointment/:serviceId" element={<Appointment />} />

        </Routes>
      </div>

      <Footer />
    </div>
  );
};

export default App;
