import React from "react";
import { FaTwitter, FaGithub, FaLinkedin, FaDiscord } from "react-icons/fa";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-10">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <h2 className="text-yellow-400 font-bold text-xl mb-3">Crypto Trader</h2>
          <p className="text-sm">
            Stay ahead with live crypto market data, charts, and insights.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-yellow-400">Home</Link></li>
            <li><Link to="/exchanges" className="hover:text-yellow-400">Exchanges</Link></li>
            <li><Link to="/news" className="hover:text-yellow-400">News</Link></li>
            <li><Link to="/about" className="hover:text-yellow-400">About</Link></li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="text-white font-semibold mb-3">Follow Us</h3>
          <div className="flex space-x-4 text-xl">
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-yellow-400"><FaTwitter /></a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-yellow-400"><FaGithub /></a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-yellow-400"><FaLinkedin /></a>
            <a href="https://discord.com" target="_blank" rel="noreferrer" className="hover:text-yellow-400"><FaDiscord /></a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 text-center py-4 text-sm">
        © {new Date().getFullYear()} Crypto Trader. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
