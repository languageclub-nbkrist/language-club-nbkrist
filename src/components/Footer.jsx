import React from 'react';

// You can import icons from a library like react-icons if you prefer
// import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaInstagram, FaFacebook, FaLinkedin, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  // Hardcoded data based on the provided image.
  // You can replace '#' with the actual URLs.
  const professionalSocieties = [
    { name: 'IEEE', url: 'https://ieeesbnbkrist2k24.netlify.app/' },
    { name: 'ISTE', url: 'https://www.nbkrist.co.in/iste.php' },
    { name: 'CSI', url: 'https://www.nbkrist.co.in/csi_sb.php' },
    { name: 'IETE', url: 'https://www.nbkrist.co.in/iete.php' },
    { name: 'IEI', url: 'https://www.nbkrist.co.in/iei.php' },
    { name: 'RSI', url: 'https://www.nbkrist.co.in/rsi.php' },
    { name: 'SAE', url: 'https://www.nbkrist.co.in/sae.php' },
  ];

  const clubs = [
    { name: 'Language Club', url: '#' },
    { name: 'Literary Club', url: 'https://www.nbkrist.co.in/Literaryclub.php' },
    { name: 'Coding Club', url: 'https://www.nbkrist.co.in/Codingclub.php' },
    { name: 'Painting Club', url: 'https://www.nbkrist.co.in/Paintingclub.php' },
    { name: 'Cultural Club', url: 'https://www.nbkrist.co.in/Cultural.php' },
    { name: 'Yoga Club', url: 'https://www.nbkrist.co.in/yogaclub.php' },
  ];

  const contactInfo = {
    phone: '+91 9063918326',
    email: 'languageclub@nbkrist.org',
    address: 'NBKRIST, Vidyanagar, A.P, India',
  };

  const socialLinks = {
    instagram: 'https://www.instagram.com/languageclubnbkrist?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
    facebook: 'https://www.facebook.com/nbkrist.nbkrist',
    linkedin: 'https://www.linkedin.com/in/languageclub/',
    twitter: 'https://x.com/NBKRIST2',
  };

  return (
    <footer className="bg-gradient-to-r from-[#2c3e50] to-black text-white p-8 md:p-12">
      <div className="container mx-auto">
        {/* Main content grid - UPDATED */}
        {/* Changed to md:grid-cols-3 to enforce a 3-column layout on medium screens and up */}
        <div className="footer-content-grid">
          
          {/* Professional Societies */}
          <div>
            <h3 className="text-xl font-bold mb-4">Professional Societies</h3>
            <ul className="space-y-2">
              {professionalSocieties.map((society) => (
                <li key={society.name}>
                  <a href={society.url} className="text-gray-300 hover:text-white transition-colors duration-300">
                    {society.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Clubs */}
          <div>
            <h3 className="text-xl font-bold mb-4">Clubs</h3>
            <ul className="space-y-2">
              {clubs.map((club) => (
                <li key={club.name}>
                  <a href={club.url} className="text-gray-300 hover:text-white transition-colors duration-300">
                    {club.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center justify-center md:justify-start">
                <i className="fas fa-phone mr-3"></i>
                <a href={`tel:${contactInfo.phone}`} className="text-gray-300 hover:text-white transition-colors duration-300">
                  {contactInfo.phone}
                </a>
              </li>
              <li className="flex items-center justify-center md:justify-start">
                <i className="fas fa-envelope mr-3"></i>
                <a href={`mailto:${contactInfo.email}`} className="text-gray-300 hover:text-white transition-colors duration-300">
                  {contactInfo.email}
                </a>
              </li>
              <li className="flex items-center justify-center md:justify-start">
                <i className="fas fa-map-marker-alt mr-3"></i>
                <span className="text-gray-300">{contactInfo.address}</span>
              </li>
            </ul>
            {/* Social Media Icons */}
            <div className="flex justify-center md:justify-start space-x-5 mt-5">
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-2xl text-gray-300 hover:text-white transition-transform duration-300 hover:scale-110">
                <i className="fab fa-instagram"></i>
              </a>
              <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-2xl text-gray-300 hover:text-white transition-transform duration-300 hover:scale-110">
                <i className="fab fa-facebook"></i>
              </a>
              <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-2xl text-gray-300 hover:text-white transition-transform duration-300 hover:scale-110">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-2xl text-gray-300 hover:text-white transition-transform duration-300 hover:scale-110">
                <i className="fab fa-twitter"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Notice */}
        <div className="text-center text-gray-400 border-t border-gray-700 mt-8 pt-6">
          <p>© 2025 NBKR IST Language Club. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
