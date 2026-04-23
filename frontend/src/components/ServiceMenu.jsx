import React from "react";
import { servicesData } from "../assets/assets";
import { Link } from "react-router-dom";

const ServiceMenu = () => {
  return (
    <div id="serviceMenu" className="px-6 md:px-16 py-16 scroll-mt-24">
      {/* Heading */}
      <h1 className="text-3xl md:text-4xl font-semibold text-center text-white mb-4">
        Services You Would Like to Have
      </h1>

      <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
        Here are all the services that help you improve your mental well-being
        and personal growth.
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {servicesData.map((item, idx) => (
          <Link
            key={idx}
            to={`/services/${item.service}`}
            className="group"
            onClick={() => window.scrollTo(0, 0)}
          >
            {/* Main Card */}
            <div
              className="relative rounded-2xl overflow-hidden 
            bg-white/10 backdrop-blur-lg border border-white/20
            transition-all duration-300 
            hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-500/10"
            >
              {/* Image Full Cover */}
              <img
                src={item.image}
                alt={item.service}
                className="w-full h-48 md:h-56 object-cover 
                group-hover:scale-105 transition duration-300"
              />

              {/* Optional Overlay for readability */}
              <div className="absolute inset-0 bg-black/20"></div>
            </div>

            {/* Small Title Card */}
            <div
              className="mt-3 mx-auto w-[85%] text-center 
            px-4 py-2 rounded-xl 
            bg-white/10 backdrop-blur-md border border-white/20
            text-white font-medium text-sm
            transition group-hover:bg-white/20"
            >
              {item.service}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ServiceMenu;
