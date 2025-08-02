import React, { useState, useEffect, useRef } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import AOS from 'aos';

// Typewriter Hook for the hero section text
const useTypewriter = (text, speed = 100) => {
    const [displayText, setDisplayText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [loopNum, setLoopNum] = useState(0);
    const [typingSpeed, setTypingSpeed] = useState(speed);
    const i = useRef(0);

    useEffect(() => {
        // Ensure text array is not empty
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
  // Existing States
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aboutCards, setAboutCards] = useState([]);
  const [events, setEvents] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const carouselTrackRef = useRef(null);

  // ✨ Interactivity State
  const heroTitles = slides.map(s => s.title_h1).filter(Boolean);
  const typedTitle = useTypewriter(heroTitles.length > 0 ? heroTitles : ["Welcome to LanguageClub"], 150);

  // Fetch all data & Initialize AOS
  useEffect(() => {
    // 🧬 Initialize AOS
    AOS.init({
        duration: 1000, // values from 0 to 3000, with step 50ms
        once: false, // whether animation should happen only once - while scrolling down
    });

    const fetchAllData = async () => {
      try {
        // Fetch home slides
        const { data: slidesData, error: slidesError } = await supabase.from('home_slides').select('*').order('order_index', { ascending: true });
        if (slidesError) throw new Error(slidesError.message);
        setSlides(slidesData);

        // Fetch about cards
        const { data: aboutData, error: aboutError } = await supabase.from('about_cards').select('*').order('order_index', { ascending: true });
        if (aboutError) throw new Error(aboutError.message);
        setAboutCards(aboutData);

        // Fetch events
        const { data: eventsData, error: eventsError } = await supabase.from('events').select('*').order('order_index', { ascending: true });
        if (eventsError) throw new Error(eventsError.message);
        setEvents(eventsData);

        // Fetch testimonials
        const { data: panelData, error: panelError } = await supabase.from('panel_testimonials').select('*').order('order_index', { ascending: true });
        if (panelError) throw new Error(panelError.message);
        setTestimonials(panelData);

        // Fetch execom members
        const { data: execomData, error: execomError } = await supabase.from('execom_members').select('*').order('order_index', { ascending: true });
        if (execomError) throw new Error(execomError.message);
        setMembers(execomData);
        if (execomData.length > 0) setSelectedMember(execomData[0]);

      } catch (err) {
        console.error('Error fetching data:', err.message);
        setError('Failed to load content. Please try again later.');
        if(showMessageBox) showMessageBox('error', 'Failed to load content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
    
    // Slider functionality
    let slideInterval;
    if (slides.length > 0) {
      slideInterval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 7000);
    }

    return () => {
        clearInterval(slideInterval);
    };
  }, [slides.length, showMessageBox, supabase]);

  // Home section functions
  const goToSlide = (n) => setCurrentSlide(n);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  // Execom section function
  const handleProfileClick = (member) => setSelectedMember(member);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-red-500"><p className="text-xl">{error}</p></div>;

  return (
    <div className="bg-white dark:bg-gray-900 transition-colors duration-500">
      {/* Main Container */}
      <div className="main-container">
        {/* 🌟 TYPEWRITER EFFECT (Hero Section) */}
        <section className="home-section relative" id="home">
            <div className="video-slides-container">
                {slides.map((slide, index) => (
                    <video key={slide.id} className={`video-slide ${index === currentSlide ? 'active' : ''}`} src={slide.video_url} autoPlay muted loop></video>
                ))}
            </div>

            {/* Re-added Mobile Button Container */}
            <div className="button-container-mobile sm:hidden fixed bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2 bg-black/30 backdrop-blur-sm p-2 rounded-full">
              <a className="button p-3 rounded-full bg-white/20 text-white hover:bg-white/40 transition-all" href="#home"><i className="fas fa-home"></i></a>
              <a className="button p-3 rounded-full bg-white/20 text-white hover:bg-white/40 transition-all" href="#about"><i className="fas fa-info-circle"></i></a>
              <a className="button p-3 rounded-full bg-white/20 text-white hover:bg-white/40 transition-all" href="#events"><i className="fas fa-calendar-alt"></i></a>
              <a className="button p-3 rounded-full bg-white/20 text-white hover:bg-white/40 transition-all" href="#panel"><i className="fas fa-users"></i></a>
              <a className="button p-3 rounded-full bg-white/20 text-white hover:bg-white/40 transition-all" href="#execom"><i className="fas fa-ellipsis-h"></i></a>
            </div>

            <div className="absolute inset-0 bg-black/50"></div>
            <div className="slider-contents relative z-10">
                <div className={`content-slide active`}>
                    <h1 className="text-white text-shadow-lg min-h-[80px] md:min-h-[100px]">
                        <span className="typing-cursor">{typedTitle}</span>
                    </h1>
                    {slides[currentSlide] && <>
                        <h2 data-aos="fade-up" data-aos-delay="200" className="text-purple-300">{slides[currentSlide].title_h2}</h2>
                        <p data-aos="fade-up" data-aos-delay="400" className="text-gray-100">{slides[currentSlide].description}</p>
                        <button data-aos="zoom-in" data-aos-delay="600" className="animated-btn mt-4 hover:scale-105 transition-transform duration-300">{slides[currentSlide].button_text}</button>
                    </>}
                </div>
            </div>
            <div className="slider-navigation">
                <button className="nav-prev" onClick={prevSlide}>&#10094;</button>
                <div className="nav-dots">
                    {slides.map((_, index) => (
                        <div key={index} className={`nav-btn ${index === currentSlide ? 'active' : ''}`} onClick={() => goToSlide(index)}></div>
                    ))}
                </div>
                <button className="nav-next" onClick={nextSlide}>&#10095;</button>
            </div>
        </section>

        {/* 💡 SECTION ANIMATION ON SCROLL (About Section) */}
        <section id="about" className="about-section bg-gray-50 dark:bg-gray-800 py-20 px-4">
            <div className="text-center mb-12">
                <h2 data-aos="fade-up" className="text-3xl font-bold text-gray-800 dark:text-white">About <span className="text-purple-600 dark:text-purple-400">LanguageClub NBKRIST</span></h2>
                <p data-aos="fade-up" data-aos-delay="200" className="text-lg text-gray-600 dark:text-gray-400 mt-2">Where words meet innovation, and ideas find their voice.</p>
            </div>
            <div className="about-cards-grid">
                {aboutCards.map((card, index) => (
                    <div key={card.id} data-aos="fade-up" data-aos-delay={index * 100} className="about-card bg-white dark:bg-gray-700 shadow-lg rounded-lg p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-xl">
                        <i className={`${card.icon || 'fas fa-lightbulb'} text-4xl text-purple-500 mb-4`}></i>
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{card.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300">{card.description}</p>
                    </div>
                ))}
            </div>
        </section>

        {/* 🧩 HOVER EFFECTS ON CARDS (Events Section) */}
        <section id="events" className="events-section py-20 px-4">
            <div className="text-center mb-12">
                <h2 data-aos="fade-up" className="text-3xl font-bold text-gray-800 dark:text-white">WHAT WE DO?</h2>
                <p data-aos="fade-up" data-aos-delay="200" className="text-lg text-gray-600 dark:text-gray-400 mt-2">Get ready to explore, learn, and lead—on a club time.</p>
            </div>
            <div className="events-container grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.map((event, index) => (
                    <div key={event.id} data-aos="zoom-in" data-aos-delay={index * 100} className="event-card bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 hover:-translate-y-2">
                        <h3 className="text-xl font-bold text-purple-600 dark:text-purple-400 mb-3">{event.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300">{event.description}</p>
                    </div>
                ))}
            </div>
        </section>

        {/* Panel Section */}
        <section id="panel" className="panel-section bg-gray-50 dark:bg-gray-800 py-20 px-4">
             <div className="text-center mb-12">
                <h2 data-aos="fade-up" className="text-3xl font-bold text-gray-800 dark:text-white">Member Testimonials</h2>
                <p data-aos="fade-up" data-aos-delay="200" className="text-lg text-gray-600 dark:text-gray-400 mt-2">Whatever the members think about the Language Club, their opinions matter to us.</p>
            </div>
            <div className="panel-card-container grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                    <div key={testimonial.id} data-aos="fade-right" data-aos-delay={index * 100} className="panel-card bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg">
                        <p className="text-gray-600 dark:text-gray-300 italic">"{testimonial.quote}"</p>
                        <p className="text-right text-purple-500 font-semibold mt-4">- {testimonial.author}</p>
                    </div>
                ))}
            </div>
        </section>

        {/* 📱 RESPONSIVE LAYOUT SYSTEM (Execom Section) */}
          <section id="execom" className="execom-section py-12 px-4"> {/* ⬅️ reduced py-20 to py-12 */}
            <div className="text-center mb-12">
                <h2 data-aos="fade-up" className="text-3xl font-bold text-gray-800 dark:text-white">Our Services & Team</h2>
                <p data-aos="fade-up" data-aos-delay="200" className="text-lg text-gray-600 dark:text-gray-400 mt-2">Meet the visionaries steering LanguageClub NBKRIST forward.</p>
            </div>
            <div className="execom-cards-grid grid sm:grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div data-aos="fade-up" data-aos-delay="100" className="execom-card bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center transition-all duration-300 hover:scale-105 hover:shadow-purple-200 dark:hover:shadow-purple-900">
                    <h3 className="text-xl font-semibold text-indigo-800 dark:text-indigo-300">Website translation</h3>
                    <p className="role text-gray-500 dark:text-gray-400">LanguageClub</p>
                </div>
                <div data-aos="fade-up" data-aos-delay="200" className="execom-card bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center transition-all duration-300 hover:scale-105 hover:shadow-purple-200 dark:hover:shadow-purple-900">
                    <h3 className="text-xl font-semibold text-indigo-800 dark:text-indigo-300">Content preparation</h3>
                    <p className="role text-gray-500 dark:text-gray-400">LanguageClub</p>
                </div>
                <div data-aos="fade-up" data-aos-delay="300" className="execom-card bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center transition-all duration-300 hover:scale-105 hover:shadow-purple-200 dark:hover:shadow-purple-900">
                    <h3 className="text-xl font-semibold text-indigo-800 dark:text-indigo-300">Social media</h3>
                    <p className="role text-gray-500 dark:text-gray-400">LanguageClub</p>
                </div>
            </div>

            {/* Developer Team Carousel */}
            <div className="developer-team-container bg-gray-800 dark:bg-black py-6 px-3 rounded-md mt-6" data-aos="zoom-in-up">
    <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-white">Developers Team</h2>
        <h3 className="text-sm text-purple-300"><span className="badge">2023 Batch</span></h3>
    </div>
    <div className="carousel-container">
        <div className="carousel-track auto-scroll" ref={carouselTrackRef}>
            {members.length > 0 && [...members, ...members].map((member, index) => (
                <div key={`${member.id}-${index}`} className="profile-item" onClick={() => handleProfileClick(member)}>
                    <img src={member.image_url} className="transition-transform duration-300 hover:scale-105" />
                </div>
            ))}
        </div>
    </div>
    {selectedMember && (
        <div className="profile-info-card mt-4 bg-gray-900/50 p-4 rounded-md">
            <div className="flex flex-col md:flex-row items-center text-center md:text-left">
                <div className="md:w-1/3 mb-2 md:mb-0">
                    <img src={selectedMember.image_url} alt={selectedMember.name} className="rounded-full w-24 h-24 mx-auto border-2 border-purple-400" />
                </div>
                <div className="md:w-2/3 md:ml-4">
                    <h3 className="text-xl font-bold mb-1 text-white">{selectedMember.name}</h3>
                    <div className="mb-2">
                        <span className="badge bg-red-500 text-white mr-1 text-xs">{selectedMember.role}</span>
                        <span className="badge bg-gray-700 text-white mr-1 text-xs">{selectedMember.roll_no}</span>
                        <span className="badge bg-gray-700 text-white text-xs">{selectedMember.branch}</span>
                    </div>
                    {selectedMember.linkedin && (
                        <a href={selectedMember.linkedin} target="_blank" rel="noopener noreferrer" className="btn-social text-sm">
                            <i className="fab fa-linkedin-in mr-1"></i>LinkedIn
                        </a>
                    )}
                </div>
            </div>
        </div>
    )}
</div>
        </section>

        {/* 📩 CONTACT FORM INTERACTIONS */}
        <section id="contact" className="contact-section bg-gray-50 dark:bg-gray-800 py-20 px-4">
             <div className="text-center mb-12">
                <h2 data-aos="fade-up" className="text-3xl font-bold text-gray-800 dark:text-white">Get In Touch</h2>
                <p data-aos="fade-up" data-aos-delay="200" className="text-lg text-gray-600 dark:text-gray-400 mt-2">Have a question or a project in mind? Let's talk.</p>
            </div>
            <div data-aos="fade-up" data-aos-delay="300" className="max-w-2xl mx-auto">
                <form className="space-y-6">
                    <div className="relative">
                        <input type="text" id="name" className="peer floating-input" placeholder=" " />
                        <label htmlFor="name" className="floating-label">Your Name</label>
                    </div>
                    <div className="relative">
                        <input type="email" id="email" className="peer floating-input" placeholder=" " />
                        <label htmlFor="email" className="floating-label">Your Email</label>
                    </div>
                    <div className="relative">
                        <textarea id="message" rows="4" className="peer floating-input" placeholder=" "></textarea>
                        <label htmlFor="message" className="floating-label">Your Message</label>
                    </div>
                    <button type="submit" className="w-full bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-all duration-300 hover:scale-105">
                        Send Message
                    </button>
                </form>
            </div>
        </section>
      </div>
    </div>
  );
}

export default Home;
