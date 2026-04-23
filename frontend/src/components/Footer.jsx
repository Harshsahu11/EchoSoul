import React from "react";
import { Link } from "react-router-dom";

const socialLinks = [
  {
    name: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-4 w-4 fill-none stroke-current"
        strokeWidth="1.8"
      >
        <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.3" cy="6.7" r="0.9" className="fill-current stroke-none" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: "https://facebook.com",
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-4 w-4 fill-current"
      >
        <path d="M13.4 21v-7.5H16l.4-3h-3V8.6c0-.9.2-1.5 1.5-1.5h1.6V4.4c-.8-.1-1.6-.2-2.4-.2-2.4 0-4 1.5-4 4.2v2.1H7.5v3h2.6V21h3.3Z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "https://youtube.com/",
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-4 w-4 fill-current"
      >
        <path d="M21.6 8.4a2.9 2.9 0 0 0-2.1-2.1C17.7 5.8 12 5.8 12 5.8s-5.7 0-7.5.5A2.9 2.9 0 0 0 2.4 8.4 30.4 30.4 0 0 0 2 12a30.4 30.4 0 0 0 .4 3.6 2.9 2.9 0 0 0 2.1 2.1c1.8.5 7.5.5 7.5.5s5.7 0 7.5-.5a2.9 2.9 0 0 0 2.1-2.1A30.4 30.4 0 0 0 22 12a30.4 30.4 0 0 0-.4-3.6ZM10 15.5v-7l6 3.5-6 3.5Z" />
      </svg>
    ),
  },
];

const Footer = () => {
  return (
    <footer className="text-white">
      {/* Main Section */}
      <div className="px-6 md:px-16 py-10 border-t border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Left */}
          <div>
            <p className="text-xs tracking-widest text-blue-400 mb-2">
              GUIDANCE PHILOSOPHY
            </p>

            <h2 className="text-2xl md:text-3xl font-semibold leading-snug">
              Empowering Your <span className="text-blue-400">Next Step</span>{" "}
              in Life.
            </h2>

            <p className="text-gray-400 mt-3 text-sm max-w-sm">
              Focused on emotional well-being and personal growth.
            </p>

            {/* Icons */}
            <div className="flex gap-3 mt-4">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={item.name}
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-white/10 text-slate-200 transition hover:border-blue-400 hover:text-blue-300"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-base font-medium mb-3">Navigation</h3>

            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Card */}
          <div className="border border-white/10 rounded-lg p-4 bg-white/5 backdrop-blur-md">
            <h3 className="text-base font-medium mb-3 flex items-center gap-2">
              <span className="text-blue-400">{">"}</span> Contact
            </h3>

            <div className="space-y-3 text-sm text-gray-400">
              <div>
                <p className="text-xs text-gray-500">EMAIL</p>
                <p className="text-white text-sm">echosoul.connect@gmail.com</p>
              </div>

              <div>
                <p className="text-xs text-gray-500">PHONE</p>
                <p className="text-white text-sm">+91 XXXXX XXXXX</p>
              </div>

              <div>
                <p className="text-xs text-gray-500">LOCATION</p>
                <p className="text-white text-sm">India</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="relative mt-8 pt-4 border-t border-white/10 flex justify-center items-center text-gray-500">
          <p className="text-sm md:text-base text-center">
            Copyright 2026 <span className="text-white">EchoSoul</span>. All
            rights reserved.
          </p>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="absolute right-0 w-8 h-8 flex items-center justify-center rounded-md border border-white/10 hover:border-blue-400 transition"
          >
            ↑
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
