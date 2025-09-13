import React, { useState, useEffect, useRef, useCallback } from 'react';
import LoadingSpinner from '../components/LoadingSpinner'; // Assuming this component exists
import SocialLinks from "../components/SocialLinks"; // Assuming this component exists

// External libraries
import AOS from 'aos';
import 'aos/dist/aos.css';
import Swal from "sweetalert2";
import axios from "axios";
// Icons for the contact form and mobile navigation
import { Share2, User, Mail, MessageSquare, Send, Menu, X, Home as HomeIcon, Info, Calendar, Users, Phone, Users2 } from "lucide-react";


// Typewriter Hook for the hero section text
const useTypewriter = (text, speed = 100) => {
    const [displayText, setDisplayText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [loopNum, setLoopNum] = useState(0);
    const [typingSpeed, setTypingSpeed] = useState(speed);
    const i = useRef(0);

    useEffect(() => {
        if (text.length === 0) return;
        const handleType = () => {
            const currentText = text[loopNum % text.length];
            if (isDeleting) {
                setDisplayText(currentText.substring(0, i.current - 1));
                i.current--;
            } else {
                setDisplayText(currentText.substring(0, i.current + 1));
                i.current++;
            }

            if (!isDeleting && i.current === currentText.length) {
                setTimeout(() => setIsDeleting(true), 2000);
                setTypingSpeed(speed / 2);
            } else if (isDeleting && i.current === 0) {
                setIsDeleting(false);
                setLoopNum(prev => prev + 1);
                setTypingSpeed(speed);
            }
        };

        const timer = setTimeout(handleType, typingSpeed);
        return () => clearTimeout(timer);
    }, [displayText, isDeleting, typingSpeed, loopNum, text, speed]);

    return displayText;
};


// Main Home Component
function Home({ supabase, showMessageBox }) {
  // State Management
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aboutCards, setAboutCards] = useState([]);
  const [events, setEvents] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // State to pause auto-cycling on user interaction
  const [isPaused, setIsPaused] = useState(false);
  const pauseTimeoutRef = useRef(null);


  // Typewriter text initialization
  const heroTitles = slides.map(s => s.title_h1).filter(Boolean);
  const typedTitle = useTypewriter(heroTitles.length > 0 ? heroTitles : ["Welcome to LanguageClub"], 150);

  // Data for the mobile navigation links

  const navLinks = [
    { href: '/', label: 'Home', icon: <HomeIcon size={20} /> },
    { href: '\#about', label: 'About', icon: <Info size={20} /> },
    { href: '\#events', label: 'Events', icon: <Calendar size={20} /> },
    { href: '\#panel', label: 'Panel', icon: <Users2 size={20} /> },
    { href: '\#execom', label: 'execom', icon: <Users size={20} /> },  ];

  // Initial Data Fetching & AOS Initialization
  useEffect(() => {
    AOS.init({
        duration: 1000,
        once: false, 
    });

    const fetchAllData = async () => {
      try {
        const [slidesRes, aboutRes, eventsRes, panelRes, execomRes] = await Promise.all([
            supabase.from('home_slides').select('*').order('order_index', { ascending: true }),
            supabase.from('about_cards').select('*').order('order_index', { ascending: true }),
            supabase.from('events').select('*').order('order_index', { ascending: true }),
            supabase.from('panel_testimonials').select('*').order('order_index', { ascending: true }),
            supabase.from('panel_members').select('*').order('order_index', { ascending: true })
        ]);

        if (slidesRes.error) throw slidesRes.error;
        setSlides(slidesRes.data);

        if (aboutRes.error) throw aboutRes.error;
        setAboutCards(aboutRes.data);

        if (eventsRes.error) throw eventsRes.error;
        setEvents(eventsRes.data);

        if (panelRes.error) throw panelRes.error;
        setTestimonials(panelRes.data);

        if (execomRes.error) throw execomRes.error;
        setMembers(execomRes.data);
        
        if (execomRes.data?.length > 0) {
            setSelectedMember(execomRes.data[0]);
        }

      } catch (err) {
        console.error('Error fetching data:', err.message);
        setError('Failed to load content. Please try again later.');
        if(showMessageBox) showMessageBox('error', 'Failed to load content.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [supabase, showMessageBox]);

  // useEffect for hero section auto-sliding
  useEffect(() => {
    if (slides.length > 1) {
      const slideInterval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 7000);
      return () => clearInterval(slideInterval);
    }
  }, [slides.length]);
  
  // useEffect for auto-cycling profiles every 4 seconds
  useEffect(() => {
    if (members.length === 0 || isPaused) {
        return;
    }

    const profileInterval = setInterval(() => {
        const currentIndex = members.findIndex(m => m.id === selectedMember?.id);
        const nextIndex = (currentIndex + 1) % members.length;
        setSelectedMember(members[nextIndex]);
    }, 4000); // Change profile every 4 seconds

    return () => clearInterval(profileInterval);

  }, [members, selectedMember, isPaused]);


  // Event Handlers
  const handleProfileClick = (member) => {
      // Set the clicked member as selected
      setSelectedMember(member);
      // Pause the auto-cycle so the user can view the card
      setIsPaused(true);
      clearTimeout(pauseTimeoutRef.current);
      pauseTimeoutRef.current = setTimeout(() => setIsPaused(false), 8000); // Resume after 8 seconds
  };
  
  // Hero slider navigation functions
  const goToSlide = (n) => setCurrentSlide(n);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    Swal.fire({
      title: 'Sending Message...',
      background: '#030014',
      color: '#e5e7eb',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const formSubmitUrl = 'https://formsubmit.co/languageclub@nbkrist.org'; // IMPORTANT: Change this to your email
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('email', formData.email);
      submitData.append('message', formData.message);
      submitData.append('_subject', 'New Message from LanguageClub Website!');
      submitData.append('_captcha', 'false');
      submitData.append('_template', 'table');

      await axios.post(formSubmitUrl, submitData);
      
      Swal.fire({
        title: 'Success!',
        text: 'Your message has been sent successfully!',
        icon: 'success',
        background: '#030014',
        color: '#e5e7eb',
        confirmButtonColor: '#a855f7',
      });
      setFormData({ name: "", email: "", message: "" });

    } catch (error) {
      console.error("Form submission error", error);
      Swal.fire({
        title: 'Error!',
        text: 'An error occurred. Please try again later.',
        icon: 'error',
        background: '#030014',
        color: '#e5e7eb',
        confirmButtonColor: '#f43f5e',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render Logic
  if (loading) return <LoadingSpinner />;
  if (error) return <div className="flex items-center justify-center min-h-screen text-red-500"><p className="text-xl">{error}</p></div>;

  return (
    <div className="main-container">
      <div className="background-container">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>
      
      <div className="mobile-nav-menu">
        {navLinks.map(link => (
            <a key={link.href} href={link.href} className="mobile-nav-link">
            {link.icon}
            <span>{link.label}</span>
            </a>
        ))}
         </div>

      <section id="home" className="home-section">
        <div className="video-slides-container">
            {slides.map((slide, index) => (
                <video key={slide.id} className={`video-slide ${index === currentSlide ? 'active' : ''}`} src={slide.video_url} autoPlay muted loop></video>
            ))}
        </div>
        <div className="slider-contents">
            <div className={`content-slide ${slides.length > 0 ? 'active' : ''}`}>
                <h1 className="text-white text-shadow-lg min-h-[80px] md:min-h-[100px] text-[2.5rem] md:text-[3rem] font-bold" style={{fontFamily: 'Roboto, sans-serif'}}>
                    <span className="typing-cursor">{typedTitle}</span>
                </h1>
                                {slides[currentSlide] && <>
                    <h2 data-aos="fade-up" data-aos-delay="200" className="text-purple-300">{slides[currentSlide].title_h2}</h2>
                    <p data-aos="fade-up" data-aos-delay="400" className="text-gray-100">{slides[currentSlide].description}</p>
                    <a href="https://docs.google.com/forms/d/e/1FAIpQLSfmGLdHnn9Rm1gZXGk8Svaspzb32Oy-AaqzjR_bdVxw_Og-gQ/viewform?usp=header" data-aos="zoom-in" data-aos-delay="600" className="animated-btn mt-4">{slides[currentSlide].button_text}</a>
                </>}
            </div>
        </div>
        <div className="slider-navigation">
            <div className="nav-prev" onClick={prevSlide}>&#10094;</div>
            <div className="nav-dots">
                {slides.map((_, index) => (
                    <div key={index} className={`nav-btn ${index === currentSlide ? 'active' : ''}`} onClick={() => goToSlide(index)}></div>
                ))}
            </div>
            <div className="nav-next" onClick={nextSlide}>&#10095;</div>
        </div>
      </section>

      <section id="about" className="about-section section-padding">
          <h2 data-aos="fade-up" className="section-title">About LanguageClub</h2>
          <p data-aos="fade-up" data-aos-delay="200" className="section-subtitle">Where words meet innovation, and ideas find their voice.</p>
          <div className="about-cards-grid">
              {aboutCards.map((card, index) => (
                  <div key={card.id} data-aos="fade-up" data-aos-delay={index * 100} className="about-card glass-card">
                      <i className={`${card.icon || 'fas fa-lightbulb'} text-4xl mb-4 text-secondary`}></i>
                      <h2>{card.title}</h2>
                      <p>{card.description}</p>
                  </div>
              ))}
          </div>
      </section>

      <section id="events" className="events-section section-padding">
          <h2 data-aos="fade-up" className="section-title">WHAT WE DO?</h2>
          <p data-aos="fade-up" data-aos-delay="200" className="section-subtitle">Get ready to explore, learn, and lead—on a club time.</p>
          <div className="events-container">
              {events.map((event, index) => (
                  <div key={event.id} data-aos="zoom-in" data-aos-delay={index * 100} className="event-card glass-card">
                      <h3>{event.title}</h3>
                      <p>{event.description}</p>
                  </div>
              ))}
          </div>
      </section>

            <section id="services-team" className="services-team-section section-padding">
        <h2 data-aos="fade-up" className="section-title">Our Services & Team</h2>
        <p data-aos="fade-up" data-aos-delay="200" className="section-subtitle">
            Meet the visionaries steering LanguageClub NBKRIST forward.
        </p>
        <div className="execom-cards-grid mb-12">
            <div data-aos="fade-up" data-aos-delay="100" className="execom-card glass-card">
            <h2>Website translation</h2>
            <p className="role">LanguageClub</p>
            </div>
            <div data-aos="fade-up" data-aos-delay="200" className="execom-card glass-card">
            <h2>Content preparation</h2>
            <p className="role">LanguageClub</p>
            </div>
            <div data-aos="fade-up" data-aos-delay="300" className="execom-card glass-card">
            <h2>Social media</h2>
            <p className="role">LanguageClub</p>
            </div>
        </div>
        </section>

        <section id="panel-members" className="panel-members-section section-padding">
        <div className="body-container-dev glass-card max-w-4xl mx-auto" data-aos="zoom-in-up">
            <h2 className="text-xl font-bold text-center mb-1 text-text-main">Panel members</h2>
            <h3 className="text-sm text-primary text-center mb-4">2025 Batch</h3>
            <div className="carousel-container">
            <div className="carousel-track auto-scroll">
                {members.length > 0 &&
                [...members, ...members].map((member, index) => (
                    <div
                    key={`${member.id}-${index}`}
                    className="profile-item"
                    onClick={() => handleProfileClick(member)}
                    >
                    <img src={member.image_url} alt={member.name} />
                    </div>
                ))}
            </div>
            </div>

            {selectedMember && (
            <div className="profile-info-card glass-card mt-6 border-t-2 border-primary/20">
                <div className="flex flex-col md:flex-row items-center text-center md:text-left gap-6">
                <div className="md:w-1/3">
                    <img
                    src={selectedMember.image_url}
                    alt={selectedMember.name}
                    className="rounded-full w-28 h-28 mx-auto border-4 border-primary"
                    />
                </div>
                <div className="md:w-2/3">
                    <h3 className="member-name">{selectedMember.name}</h3>
                    <div className="my-2 flex flex-wrap gap-2 justify-center md:justify-start">
                    <span className="badge bg-accent text-white px-3 py-1 rounded-full text-sm">
                        {selectedMember.role}
                    </span>
                    <span className="badge bg-surface text-text-muted px-3 py-1 rounded-full text-sm">
                        {selectedMember.roll_no}
                    </span>
                    <span className="badge bg-surface text-text-muted px-3 py-1 rounded-full text-sm">
                        {selectedMember.branch}
                    </span>
                    </div>
                    {selectedMember.linkedin && (
                    <a
                        href={selectedMember.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2 text-sm text-primary hover:underline"
                    >
                        <i className="fab fa-linkedin-in mr-1"></i> LinkedIn
                    </a>
                    )}
                </div>
                </div>
            </div>
            )}
        </div>
        </section>


      <section id="contact" className="contact-section section-padding">
           <h2 data-aos="fade-up" className="section-title">Get In Touch</h2>
           <p data-aos="fade-up" data-aos-delay="200" className="section-subtitle">Have a question or a ideas in mind? Let's talk.</p>
          <div className="container mx-auto max-w-lg">
              <div data-aos="fade-right" className="glass-card">
                  <div className="flex justify-between items-start mb-8">
                      <div>
                          <h3 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-secondary to-primary">
                            Contact
                          </h3>
                          <p className="text-text-muted">Got something to discuss? Send me a message.</p>
                      </div>
                      <Share2 className="w-10 h-10 text-primary opacity-50" />
                  </div>
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                      <div className="relative group">
                          <User className="absolute left-4 top-4 w-5 h-5 text-text-muted" />
                          <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleContactChange} disabled={isSubmitting} className="w-full p-4 pl-12 bg-surface rounded-xl border border-transparent placeholder-text-muted text-text-main focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 disabled:opacity-50" required />
                      </div>
                      <div className="relative group">
                          <Mail className="absolute left-4 top-4 w-5 h-5 text-text-muted" />
                          <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleContactChange} disabled={isSubmitting} className="w-full p-4 pl-12 bg-surface rounded-xl border border-transparent placeholder-text-muted text-text-main focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 disabled:opacity-50" required />
                      </div>
                      <div className="relative group">
                          <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-text-muted" />
                            <textarea name="message" placeholder="Your Message" value={formData.message} onChange={handleContactChange} disabled={isSubmitting} className="w-full resize-none p-4 pl-12 bg-surface rounded-xl border border-transparent placeholder-text-muted text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 h-40 disabled:opacity-50" required />                      </div>
                            <button type="submit" disabled={isSubmitting} className="animated-btn1 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:scale-105 hover:shadow-xl hover:from-indigo-500 hover:via-purple-600 hover:to-pink-600 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed">
                            <Send className="w-5 h-5" />
                            {isSubmitting ? 'Sending...' : 'Send Message'}
                            </button>
                  </form>
                  <div className="mt-10 pt-6 border-t border-primary/20 flex justify-center space-x-6">
                      <SocialLinks />
                  </div>
              </div>
          </div>
      </section>
    </div>
  );
}

export default Home;
