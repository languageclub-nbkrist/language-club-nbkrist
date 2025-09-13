import React, { useState, useEffect, useRef } from 'react';
import { Home as HomeIcon, Info, Calendar, Users, Users2 } from "lucide-react";

// Note: Ensure your Supabase client is passed as a prop to this component.

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-10">
    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-purple-400"></div>
  </div>
);

// Modal Component
const EventModal = ({ event, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-[#2a2a2a] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-purple-500/30 shadow-lg shadow-purple-500/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-purple-300">{event.title}</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl font-bold transition-colors"
            >
              &times;
            </button>
          </div>
          <div className="space-y-4">
            <p className="text-gray-300">{event.detailed_description}</p>
            {event.event_date && (
              <div>
                <h3 className="text-lg font-semibold text-purple-200 mb-1">Date & Time</h3>
                <p className="text-gray-300">{new Date(event.event_date).toLocaleString()}</p>
              </div>
            )}
            {event.location && (
              <div>
                <h3 className="text-lg font-semibold text-purple-200 mb-1">Location</h3>
                <p className="text-gray-300">{event.location}</p>
              </div>
            )}
            {event.gallery_link && (
              <a 
                href={event.gallery_link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block mt-4 bg-gradient-to-r from-teal-400 to-blue-500 text-white font-bold py-2 px-6 rounded-lg hover:scale-105 transition-transform"
              >
                View Gallery or Updates
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Slideshow Component
const Slideshow = ({ images = [] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const timeoutRef = useRef(null);

    const resetTimeout = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }

    useEffect(() => {
        if (images.length === 0) return;
        resetTimeout();
        timeoutRef.current = setTimeout(
            () => setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length),
            4000
        );
        return () => resetTimeout();
    }, [currentIndex, images.length]);

    const goToSlide = (index) => setCurrentIndex(index);

    if (images.length === 0) {
        return <div className="w-full h-64 md:h-80 bg-white/10 rounded-lg flex items-center justify-center text-gray-400">No images available</div>;
    }

    return (
        <div className="relative w-full h-64 md:h-80 overflow-hidden rounded-lg perspective-1000">
            {images.map((src, index) => (
                <img key={index} src={src} alt={`Slide ${index + 1}`} className={`absolute top-0 left-0 w-full h-full object-contain bg-white p-2 rounded-lg transition-all duration-700 ease-in-out ${index === currentIndex ? 'opacity-100 transform-none' : 'opacity-0 transform -translate-x-full rotate-y-90'}`} />
            ))}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {images.map((_, index) => (
                    <button key={index} onClick={() => goToSlide(index)} className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-purple-400 scale-125' : 'bg-white/50'}`} aria-label={`Go to slide ${index + 1}`}></button>
                ))}
            </div>
        </div>
    );
}

function Events({ supabase }) {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [completedEvents, setCompletedEvents] = useState([]);
  const [slideshowImages, setSlideshowImages] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navLinks = [
    { href: '#home', label: 'Home', icon: <HomeIcon size={20} /> },
    { href: '#about', label: 'About', icon: <Info size={20} /> },
    { href: '#events', label: 'Events', icon: <Calendar size={20} /> },
    { href: '#panel', label: 'Panel', icon: <Users2 size={20} /> },
    { href: '#execom', label: 'execom', icon: <Users size={20} /> },
  ];

  useEffect(() => {
    if (window.AOS) window.AOS.init({ duration: 1000, once: false });
    
    const fetchData = async () => {
        if (!supabase) {
            setError("Supabase client is not available.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            
            const { data: eventsData, error: eventsError } = await supabase.from('club_events').select('*').order('event_date', { ascending: true });
            if (eventsError) throw eventsError;

            // Automatically filter events into upcoming and completed
            const now = new Date();
            const upcoming = (eventsData || []).filter(event => new Date(event.event_date) >= now);
            const completed = (eventsData || []).filter(event => new Date(event.event_date) < now).sort((a, b) => new Date(b.event_date) - new Date(a.event_date)); // Sort most recent first

            setUpcomingEvents(upcoming);
            setCompletedEvents(completed);
            
            const { data: imagesData, error: imagesError } = await supabase.from('slideshow_images').select('image_url').order('order_index', { ascending: true });
            if (imagesError) throw imagesError;
            setSlideshowImages(imagesData ? imagesData.map(img => img.image_url) : []);

        } catch (err) {
            console.error('Error fetching data:', err.message);
            setError('Failed to load event data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    fetchData();
  }, [supabase]);

  const handleMoreInfo = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div className="main-container">
        <div className="mobile-nav-menu">
            {navLinks.map(link => ( <a key={link.href} href={link.href} className="mobile-nav-link">{link.icon}<span>{link.label}</span></a> ))}
        </div>
        <div className="background-container">
            <div className="blob blob-1"></div>
            <div className="blob blob-2"></div>
            <div className="blob blob-3"></div>
        </div>

        <div className="content-wrapper text-white min-h-screen p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-12">
                {loading ? <LoadingSpinner /> : error ? <p className="text-center text-red-400 bg-red-500/10 p-4 rounded-lg">{error}</p> : (
                    <>
                        {/* Hero Section */}
                        <section data-aos="fade-up" className="grid md:grid-cols-2 gap-8 items-center bg-[rgba(26,24,82,0.6)] backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl shadow-purple-500/10">
                            <div className="text-section">
                                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-purple-300">Language Club Events</h2>
                                <p className="text-gray-300 mb-6">Join us for a journey through languages and cultures! Whether you're a beginner or fluent, there's something for everyone!</p>
                                {upcomingEvents.length > 0 && (
                                    <div className="flex gap-4 flex-wrap">
                                        <button onClick={() => handleMoreInfo(upcomingEvents[0])} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-8 rounded-lg hover:scale-105 transition-transform shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 active:scale-95">Next Event Info</button>
                                        <a href={upcomingEvents[0].gallery_link || '#'} target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-teal-400 to-blue-500 text-white font-bold py-3 px-8 rounded-lg hover:scale-105 transition-transform shadow-lg shadow-teal-400/30 hover:shadow-teal-400/50 active:scale-95">Updates</a>
                                    </div>
                                )}
                            </div>
                            <div className="domain-card"><Slideshow images={slideshowImages} /></div>
                        </section>

                        {/* Upcoming Events Section */}
                        <section data-aos="fade-up" data-aos-delay="100">
                            <h2 className="text-2xl font-bold text-purple-300 mb-6">Upcoming Events</h2>
                            {upcomingEvents.length > 0 ? (
                                <div className="grid md:grid-cols-2 gap-6">
                                    {upcomingEvents.map((event) => (
                                        <div key={event.id} className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-400/30 rounded-xl p-6 backdrop-blur-sm transform hover:-translate-y-1 transition-transform duration-300 shadow-lg shadow-purple-500/10">
                                            <h3 className="text-xl font-bold text-purple-200 mb-2">{event.title}</h3>
                                            <p className="text-gray-300 mb-4">{event.description}</p>
                                            <div className="flex justify-between items-center">
                                            <p className="text-gray-300">
                                              {new Date(event.event_date).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true })}</p>                                                <button onClick={() => handleMoreInfo(event)} className="text-sm bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded transition-colors">Details</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-gray-400 bg-black/20 p-4 rounded-lg">No upcoming events scheduled. Please check back soon!</p>
                            )}
                        </section>

                        {/* Completed Events Section */}
                        <section data-aos="fade-up" data-aos-delay="200">
                            <h2 className="text-2xl font-bold text-purple-300 mb-6">Completed Events</h2>
                            {completedEvents.length > 0 ? (
                                <div className="grid md:grid-cols-2 gap-6">
                                    {completedEvents.map((event) => (
                                        <div key={event.id} className="bg-[rgba(26,24,82,0.4)] border border-white/10 rounded-xl p-6 backdrop-blur-sm transform hover:-translate-y-1 transition-transform duration-300">
                                            <h3 className="text-xl font-bold text-purple-200 mb-2">{event.title}</h3>
                                            <p className="text-gray-300 mb-4">{event.description}</p>
                                            <div className="flex justify-between items-center">
                                            <p className="text-gray-300">
                                              {new Date(event.event_date).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true })}</p>                                                <button onClick={() => handleMoreInfo(event)} className="text-sm bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded transition-colors">Details</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-gray-400 bg-black/20 p-4 rounded-lg">No past event data available.</p>
                            )}
                        </section>
                    </>
                )}
            </div>

            {selectedEvent && ( <EventModal event={selectedEvent} isOpen={isModalOpen} onClose={closeModal} /> )}
        </div>
    </div>
  );
}

export default Events;