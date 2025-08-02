import React, { useState, useEffect, useRef } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';

function Execom({ supabase, showMessageBox }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const carouselTrackRef = useRef(null);

  useEffect(() => {
    const fetchExecomMembers = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('execom_members')
          .select('*')
          .order('order_index', { ascending: true });

        if (error) throw error;
        setMembers(data);
        if (data.length > 0) {
          setSelectedMember(data[0]); // Select the first member initially
        }
      } catch (err) {
        console.error('Error fetching execom members:', err.message);
        setError('Failed to load execom members. Please try again later.');
        showMessageBox('error', 'Failed to load execom members. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchExecomMembers();
  }, [showMessageBox]);

  // Handle carousel item click to show member info
  const handleProfileClick = (member) => {
    setSelectedMember(member);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p className="text-xl">Error: {error}</p>
      </div>
    );
  }

  return (
    <>
      {/* Our Services Section */}
      <section id="execom" className="execom-section">
        <h2 className="text-blue-900">👥 Our services</h2>
        <p className="execom-subtext">Meet the visionaries steering LanguageClub NBKRIST forward.</p>

        <div className="execom-cards-grid">
          {/* These are static services from original HTML, can be made dynamic from Supabase if needed */}
          <div className="execom-card">
            <h3 className="text-indigo-900">Website translation</h3>
            <p className="role">LanguageClub</p>
          </div>
          <div className="execom-card">
            <h3 className="text-indigo-900">Content preparation</h3>
            <p className="role">LanguageClub</p>
          </div>
          <div className="execom-card">
            <h3 className="text-indigo-900">Social media</h3>
            <p className="role">LanguageClub</p>
          </div>
        </div>
      </section>

      {/* Developers Team Section */}
      <section className="py-12 px-6 body-container-dev">
        <div className="developercontainer">
          <div className="text-center mb-5">
            <h1 className="display-4 fw-bold mb-3 animate_animated animate_fadeInDown">
              Developers Team
            </h1>
            <h2 className="h3 text-uppercase animate_animated animatefadeIn animate_delay-1s">
              <span className="badge bg-dark bg-opacity-50">2023 Batch</span>
            </h2>
          </div>

          <div className="carousel-container">
            <div className="carousel-track auto-scroll" ref={carouselTrackRef}>
              {members.length > 0 ? (
                // Duplicate members for continuous scroll effect
                [...members, ...members].map((member, index) => (
                  <div
                    key={`${member.id}-${index}`} // Unique key for duplicated items
                    className={`profile-item ${selectedMember && selectedMember.id === member.id ? 'center' : ''}`}
                    onClick={() => handleProfileClick(member)}
                  >
                    <img src={member.image_url} alt={member.name} />
                    <div className="profile-role">{member.role}</div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center w-full">No execom members available. Please add content to Supabase.</p>
              )}
            </div>
          </div>

          {selectedMember && (
            <div className="profile-info-card">
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/3 text-center mb-4 md:mb-0">
                  <img
                    src={selectedMember.image_url}
                    alt={selectedMember.name}
                    className="rounded-full w-1/2 md:w-full max-w-xs mx-auto border border-3 border-red-500"
                  />
                </div>
                <div className="md:w-2/3 md:ml-8 text-center md:text-left">
                  <h3 className="text-3xl font-bold mb-3 text-white">{selectedMember.name}</h3>
                  <div className="mb-3">
                    <span className="badge bg-danger mr-2">{selectedMember.role}</span>
                    <span className="badge bg-dark mr-2">{selectedMember.roll_no}</span>
                    <span className="badge bg-dark">{selectedMember.branch}</span>
                  </div>
                  {selectedMember.linkedin && (
                    <a
                      href={selectedMember.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-light rounded-full px-4 py-2 mt-2 inline-flex items-center"
                    >
                      <i className="fab fa-linkedin-in mr-2"></i>Connect on LinkedIn
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default Execom;