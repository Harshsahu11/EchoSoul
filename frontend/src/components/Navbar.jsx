import React, { useEffect, useRef, useState } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [token, setToken] = useState(null);

  const user = {
    image: "https://i.pravatar.cc/40",
  };

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) {
      setToken(t);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setDropdownOpen(false);
  };

  const handleLogoClick = () => {
    setMenuOpen(false);
    setDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCreateAccountClick = () => {
    setMenuOpen(false);
    setDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate("/login?mode=signup");
  };

  const navLink = ({ isActive }) =>
    `relative px-1 py-1 text-sm transition
    ${isActive ? "text-white" : "text-white/80"}
    after:content-[''] after:absolute after:left-0 after:-bottom-1
    after:h-[2px] after:w-0 after:bg-white
    after:transition-all after:duration-300
    hover:after:w-full hover:text-white`;

  return (
    <div className="fixed top-3 left-1/2 z-50 w-[96%] -translate-x-1/2 md:w-[90%] lg:w-[85%]">
      <div
        className={`flex items-center justify-between rounded-xl px-5 transition-all duration-300 ${
          isScrolled
            ? "border border-white/20 bg-black/60 py-2 shadow-md backdrop-blur-lg"
            : "border border-transparent bg-transparent py-3"
        }`}
      >
        <NavLink
          to="/"
          aria-label="Go to home page"
          onClick={handleLogoClick}
        >
          <img
            src={assets.logo}
            alt="logo"
            className={`cursor-pointer transition-all duration-300 ${
              isScrolled ? "w-14" : "w-16"
            }`}
          />
        </NavLink>

        <div className="hidden items-center gap-8 font-medium md:flex">
          <NavLink to="/" className={navLink}>
            Home
          </NavLink>
          <NavLink to="/services" className={navLink}>
            Services
          </NavLink>
          <NavLink to="/about" className={navLink}>
            About
          </NavLink>
          <NavLink to="/contact" className={navLink}>
            Contact
          </NavLink>
        </div>

        <div className="relative flex items-center gap-3" ref={dropdownRef}>
          {token ? (
            <>
              <img
                src={user.image}
                alt="profile"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="h-8 w-8 cursor-pointer rounded-full border border-white/30 object-cover"
              />

              {dropdownOpen && (
                <div className="absolute top-10 right-0 w-44 rounded-xl border border-white/20 bg-black/60 p-2 shadow-lg backdrop-blur-lg">
                  <NavLink
                    to="/my-profile"
                    onClick={() => setDropdownOpen(false)}
                    className="block rounded-md px-3 py-2 text-sm text-white hover:bg-white/10"
                  >
                    Profile
                  </NavLink>

                  <NavLink
                    to="/my-appointments"
                    onClick={() => setDropdownOpen(false)}
                    className="block rounded-md px-3 py-2 text-sm text-white hover:bg-white/10"
                  >
                    My Appointments
                  </NavLink>

                  <div className="my-1 h-px bg-white/20"></div>

                  <button
                    onClick={handleLogout}
                    className="w-full rounded-md px-3 py-2 text-left text-sm text-red-400 hover:bg-red-500/10"
                  >
                    Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            <button
              onClick={handleCreateAccountClick}
              className="rounded-full bg-blue-600 px-4 py-1.5 text-sm font-medium text-white shadow-md transition hover:bg-blue-700 hover:shadow-lg"
            >
              Create Account
            </button>
          )}

          <div
            className="cursor-pointer text-xl text-white md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ||
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="mt-2 flex flex-col gap-3 rounded-xl border border-white/20 bg-black/60 p-4 backdrop-blur-lg md:hidden">
          <NavLink to="/" onClick={() => setMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/services" onClick={() => setMenuOpen(false)}>
            Services
          </NavLink>
          <NavLink to="/about" onClick={() => setMenuOpen(false)}>
            About
          </NavLink>
          <NavLink to="/contact" onClick={() => setMenuOpen(false)}>
            Contact
          </NavLink>

          {token ? (
            <>
              <NavLink to="/my-profile" onClick={() => setMenuOpen(false)}>
                Profile
              </NavLink>
              <NavLink
                to="/my-appointments"
                onClick={() => setMenuOpen(false)}
              >
                My Appointments
              </NavLink>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <button
              onClick={handleCreateAccountClick}
              className="rounded-md bg-blue-600 py-2 text-white"
            >
              Create Account
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;
