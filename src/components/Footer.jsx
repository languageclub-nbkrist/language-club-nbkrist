import React from 'react';

function Footer({ siteSettings }) {
  // Access social links and contact info from siteSettings
  const socialLinks = siteSettings?.social_links || {};
  const contactInfo = siteSettings?.contact_info || {};
  const professionalSocieties = siteSettings?.professional_societies || [];
  const clubs = siteSettings?.clubs || [];

  return (
    <footer className="footer-section">
      <div className="footer-content-grid">
        {/* Professional Societies */}
        <div>
          <h3 className="text-2xl font-extrabold text-white mb-5 glow-text">Professional Societies</h3>
          <ul className="space-y-3">
            {professionalSocieties.map((society, index) => (
              <li key={index}>
                <a href={society.url} target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 hover-glow">
                  {society.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Clubs */}
        <div>
          <h3 className="text-2xl font-extrabold text-white mb-5 glow-text">Clubs</h3>
          <ul className="space-y-3">
            {clubs.map((club, index) => (
              <li key={index}>
                <a href={club.url} target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 hover-glow">
                  {club.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-2xl font-extrabold text-white mb-5 glow-text">Contact Us</h3>
          <ul className="space-y-3">
            {contactInfo.phone && (
              <li className="flex justify-center md:justify-start items-center">
                <i className="fas fa-phone text-white mr-3 text-lg"></i>
                <a href={`tel:${contactInfo.phone}`} className="text-white hover:text-gray-300 hover-glow">
                  {contactInfo.phone}
                </a>
              </li>
            )}
            {contactInfo.email && (
              <li className="flex justify-center md:justify-start items-center">
                <i className="fas fa-envelope text-white mr-3 text-lg"></i>
                <a href={`mailto:${contactInfo.email}`} className="text-white hover:text-gray-300 hover-glow">
                  {contactInfo.email}
                </a>
              </li>
            )}
            {contactInfo.address && (
              <li className="flex justify-center md:justify-start items-center">
                <i className="fas fa-map-marker-alt text-white mr-3 text-lg"></i>
                <span className="text-white">{contactInfo.address}</span>
              </li>
            )}
            <li>
              <div className="flex justify-center md:justify-start space-x-6">
                {socialLinks.instagram && (
                  <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 text-3xl transition-all duration-300 hover:scale-125 hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">
                    <i className="fab fa-instagram"></i>
                  </a>
                )}
                {socialLinks.facebook && (
                  <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 text-3xl transition-all duration-300 hover:scale-125 hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">
                    <i className="fab fa-facebook"></i>
                  </a>
                )}
                {socialLinks.linkedin && (
                  <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 text-3xl transition-all duration-300 hover:scale-125 hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">
                    <i className="fab fa-linkedin"></i>
                  </a>
                )}
                {socialLinks.twitter && (
                  <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 text-3xl transition-all duration-300 hover:scale-125 hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">
                    <i className="fab fa-twitter"></i>
                  </a>
                )}
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright Notice & Back to Top */}
      <div className="section-footer">
        <a href="#home" className="back-to-top-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          Back to Top<i className="fas fa-arrow-up ml-2"></i>
        </a>
        <h2 className="text-lg text-white drop-shadow-md font-semibold">© 2025 NBKR IST Language Club. All rights reserved.</h2>
      </div>
    </footer>
  );
}

export default Footer;