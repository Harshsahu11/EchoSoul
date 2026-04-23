import React from "react";
import headerImg from "../assets/headerImg.jpeg";

const Header = () => {
  return (
    <div className="relative w-full h-screen flex items-center">
      {/* Background */}
      <img
        src={headerImg}
        alt="header"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>

      {/* Content */}
      <div className="relative z-10 w-full px-6 md:px-16 lg:px-24">
        <div className="max-w-3xl">
          <p className="text-gray-300 tracking-widest text-sm mb-4">
            REACH YOUR PEAK COACHING
          </p>

          <h1 className="text-3xl md:text-6xl font-semibold text-white leading-tight">
            EMPOWER. GROW. ACHIEVE.
          </h1>

          <p className="mt-4 text-lg md:text-2xl text-gray-200">
            YOUR JOURNEY TO A MORE FULFILLING LIFE BEGINS HERE.
          </p>

          <p className="mt-3 text-sm text-gray-300">
            CAREER STRATEGY • PERSONAL GUIDANCE •WELL-BEING
          </p>

          <a
            href="#serviceMenu"
            className="mt-6 px-6 py-3 rounded-full 
          bg-white/20 backdrop-blur-md border border-white/30 
          text-white inline-block 
          hover:bg-white/40 hover:scale-105 hover:shadow-lg hover:shadow-white/20 
          transition-all duration-300 ease-in-out"
          >
            <span className="flex items-center gap-3">
              BOOK A CONSULTATION
              <span
                className="bg-white text-black rounded-full w-6 h-6 flex items-center justify-center 
              group-hover:translate-x-1 transition-transform duration-300"
              >
                →
              </span>
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Header;
