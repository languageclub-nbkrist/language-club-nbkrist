import React from 'react';

function Header({ navigate, siteSettings }) {
  // Access social links from siteSettings if available
  const socialLinks = siteSettings?.social_links || {};

  return (
    <header className="header-bar">
      <a href="https://www.nbkrist.co.in/" className="flex items-center">
        {/* Placeholder for logo.png - replace with actual path or Supabase Storage URL */}
        <img src="logo.png" alt="Logo" className="logo" />
      </a>
      {/* Placeholder for title.png - hidden on larger screens by CSS */}
      <img src="title.png" alt="Title Image" className="title-image" />

      <div className="nav-container">
        <nav>
          <ul className="nav-links">
            <li><a href="#home" onClick={() => navigate('home')}>Home</a></li>
            <li><a href="#about" onClick={() => navigate('about')}>About</a></li>
            <li><a href="#events" onClick={() => navigate('events')}>Events</a></li>
            <li><a href="#panel" onClick={() => navigate('panel')}>Panel</a></li>
            <li><a href="#execom" onClick={() => navigate('execom')}>Execom</a></li>
            {/* Add more navigation links as needed */}
          </ul>
        </nav>
      </div>
      {/* Placeholder for clublogo.png */}
      <img src="clublogo.png" alt="Club Logo" className="clublogo" />
    </header>
  );
}

export default Header;