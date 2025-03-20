import React from "react";
import "./Header.css";
import collegeLogo from "../assets/college-logo.png";  // Add your college logo image

function Header() {
  return (
    <header className="header">
      <div className="headerContent">
        <div className="logoGroup">
          <img
            src={collegeLogo}
            alt="College Logo"
            className="logo"
          />
        </div>

        <nav className="navigation">
          <a href="#home" className="navLink">
            Home
          </a>
          <a href="#college" className="navLink">
            College
          </a>
        </nav>

        <button className="mobileMenuButton" aria-label="Toggle menu">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M4 6l16 0"></path>
            <path d="M4 12l16 0"></path>
            <path d="M4 18l16 0"></path>
          </svg>
        </button>
      </div>
    </header>
  );
}

export default Header;