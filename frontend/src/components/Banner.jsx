import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Banner = () => {
  const navigate = useNavigate();
  
  const handleCreateAccount = () => {
    window.scrollTo(0, 0);
    navigate("/login");
  };

  return (
    <div className="px-6 md:px-16 py-16">

      <div className="flex flex-col md:flex-row items-center justify-between gap-10 
      rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 p-8 md:p-12">

        {/* Left Content */}
        <div className="flex-1 text-center md:text-left">

          {/* 🔥 Bigger Heading */}
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-semibold text-white leading-tight">
            Book Consultation <br />
            <span className="text-blue-400">with Expert</span>
          </h2>

          {/* 🔥 Bigger Subtext */}
          <p className="text-gray-300 mt-5 text-base md:text-lg max-w-md">
            Get personalized guidance and support to improve your mental well-being and achieve your goals.
          </p>

          {/* Button */}
          <button
            type="button"
            onClick={handleCreateAccount}
            className="mt-6 px-6 py-3 rounded-full 
          bg-blue-600 text-white font-medium text-sm md:text-base
          hover:bg-blue-700 transition shadow-md hover:shadow-lg"
          >
            Create Account
          </button>

        </div>

        {/* Right Image */}
        <div className="flex-1 flex justify-center">

          <img
            src={assets.appointment_img}
            alt="consultation"
            className="w-full max-w-sm md:max-w-md object-contain 
            drop-shadow-lg"
          />

        </div>

      </div>
    </div>
  );
};

export default Banner;
