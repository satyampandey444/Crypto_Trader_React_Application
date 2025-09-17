import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBitcoin, FaBars, FaTimes } from "react-icons/fa";

function Navbar({ onSearch, currency, setCurrency }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Charts", path: "/exchanges" },
    { name: "Get Recommendations", path: "/recommendations" },
    { name: "News", path: "/news" },
    { name: "About", path: "/about" },
  ];

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-xl p-4 sticky top-0 z-50">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <FaBitcoin className="text-yellow-400 text-3xl animate-bounce" />
          <h1 className="text-2xl font-bold text-yellow-400 tracking-wide">
            Crypto Trader
          </h1>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`relative text-white font-medium transition-all duration-300 hover:text-yellow-400 ${
                location.pathname === link.path ? "text-yellow-400" : ""
              }`}
            >
              {link.name}
              <span
                className={`absolute left-0 -bottom-1 w-0 h-0.5 bg-yellow-400 transition-all duration-300 ${
                  location.pathname === link.path ? "w-full" : "hover:w-full"
                }`}
              ></span>
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden text-white text-2xl" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-4 bg-gray-800 p-4 rounded-lg shadow-lg animate-slide-down">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-white font-medium transition-colors duration-300 hover:text-yellow-400 ${
                location.pathname === link.path ? "text-yellow-400" : ""
              }`}
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
