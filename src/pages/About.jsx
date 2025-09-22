import React, { useState, useEffect } from 'react';
import { Home as HomeIcon, Info, Calendar, Users, Users2, Phone } from "lucide-react";

// Note: The global theme styles from App.css are expected to be imported in your main App.jsx or main.jsx file.

// Define the LoadingSpinner component directly in this file.
const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-10">
    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-[#c89b3c]"></div>
  </div>
);

function About({ supabase, showMessageBox }) {
  const [valueCards, setValueCards] = useState([]);
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
    // Initialize AOS for scroll animations if it's available on the window object
    if (window.AOS) {
      window.AOS.init({ duration: 1000, once: false });
    }

    const fetchValueCards = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('about_cards')
          .select('*')
          .order('order_index', { ascending: true });

        if (error) throw error;
        setValueCards(data);
      } catch (err) {
        console.error('Error fetching value cards:', err.message);
        setError('Failed to load the "Our Values" section. Please try again later.');
        if (showMessageBox) {
          showMessageBox('error', 'Failed to load a part of the page.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchValueCards();
  }, [supabase, showMessageBox]);

  return (
    <div className="main-container">
      <div className="mobile-nav-menu">
        {navLinks.map(link => (
            <a key={link.href} href={link.href} className="mobile-nav-link">
            {link.icon}
            <span>{link.label}</span>
            </a>
        ))}
      </div>
      {/* Animated background from App.css */}
      <div className="background-container">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      {/* Wrapper for your page content */}
      <div className="content-wrapper font-sans pt-10">
        
        {/* Hero Section */}
        <section data-aos="fade-up" id="about" className="px-6 py-12">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="text-content">
              <h1 className="text-4xl md:text-5xl font-bold text-[#c89b3c] mb-5">About Us</h1>
              <p className="text-lg text-gray-300 mb-4">
                The Language Club is one of the many clubs initiated by NBKRIST to improve students' language abilities and encourage out-of-the-box thinking.
              </p>
              <p className="text-gray-400">
                The club helps learners navigate linguistic diversity and become goal-focused, autonomous learners. It offers a platform to develop communication skills through diverse activities and multilingual interactions.
              </p>
            </div>
            <div className="image-content">
              <img src="https://img.freepik.com/free-vector/english-language-club-illustration_1284-32839.jpg" alt="Language Club Activities" className="w-full h-auto rounded-lg shadow-lg shadow-[#c89b3c]/20" />
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section data-aos="fade-up" id="story" className="px-6 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#c89b3c] mb-6">Our Story</h2>
            <p className="text-gray-400">
              Established in 2015, the Language Club began as a small group of language enthusiasts and has evolved into a vibrant community. We organize events, workshops, and exchanges, driven by continuous learning and appreciation for linguistic diversity.
            </p>
          </div>
        </section>

        {/* Our Values Section */}
        <section data-aos="fade-up" id="values" className="px-6 py-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-[#c89b3c] mb-8 text-center">Our Values</h2>
            {loading ? ( <LoadingSpinner /> ) : error ? ( <p className="text-center text-red-400">{error}</p> ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {valueCards.length > 0 ? ( valueCards.map(card => (
                    <div key={card.id} className="bg-[#252525] p-6 rounded-lg shadow-md hover:shadow-[#c89b3c]/30 transform hover:-translate-y-2 transition-all duration-300">
                      <h3 className="text-xl font-bold text-[#c89b3c] mb-3">{card.title}</h3>
                      <p className="text-gray-400">{card.description}</p>
                    </div>
                  )) ) : ( <p className="text-gray-500 col-span-full text-center">No values content available. Please add cards to the 'about_cards' table in Supabase.</p>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Curriculum Section */}
        <section data-aos="fade-up" id="curriculum" className="px-6 py-12">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                <div className="image-content md:order-last">
                    <img src="https://images.pexels.com/photos/3769138/pexels-photo-3769138.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Language learning activities" className="w-full h-auto rounded-lg shadow-lg shadow-[#c89b3c]/20" />
                </div>
                <div className="text-content">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#c89b3c] mb-6">Curriculum</h2>
                    <p className="text-gray-400 mb-4">We provide a comprehensive, hands-on approach to language learning:</p>
                    <ul className="list-disc list-inside space-y-2 text-gray-400">
                        <li>To increase communication skills</li>
                        <li>To increase leadership qualities</li>
                        <li>Grammar and vocabulary building</li>
                        <li>Conversational practice sessions</li>
                        <li>To increase technical and non technical skills</li>
                        <li>To increase management skills</li>
                        <li>To increase social values</li>
                    </ul>
                </div>
            </div>
        </section>

        {/* Policy Section */}
        <section data-aos="fade-up" id="policy" className="px-6 py-12">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                <div className="image-content">
                    <img src="https://files.capexil.org/2024/06/policy-header.jpg" alt="Club policy meeting" className="w-full h-auto rounded-lg shadow-lg shadow-[#c89b3c]/20" />
                </div>
                <div className="text-content">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#c89b3c] mb-6">Policy</h2>
                    <p className="text-gray-400 mb-4">Our guiding policies create an inclusive and productive space:</p>
                    <ul className="list-disc list-inside space-y-2 text-gray-400">
                        <li>Equal participation for all</li>
                        <li>Respect for Organize opinions</li>
                        <li>Coordinate with team members</li>
                        <li>Regular attendance and active engagement</li>
                        <li>Collaborative learning environment</li>
                        <li>Ethical use of resources</li>
                    </ul>
                </div>
            </div>
        </section>
        
        {/* Rules & Regulations Section - UPDATED TO PLACE IMAGE ON RIGHT */}
        <section data-aos="fade-up" id="rules" className="px-6 py-12">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                {/* Text content now appears first for smaller screens, but is ordered last for medium screens and up */}
                <div className="text-content">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#c89b3c] mb-6">Rules & Regulations</h2>
                    <p className="text-gray-400 mb-4">To ensure smooth operations, members must follow these rules:</p>
                    <ul className="list-disc list-inside space-y-2 text-gray-400">
                        <li>Maintain at least 75% attendance</li>
                        <li>Communicate respectfully</li>
                        <li>Must and should to participate one round of the event mandatory</li>
                        <li>Organize at least one event per semester</li>
                        <li>Respect organizers opinions,Panel members decisions is final</li>
                        <li>Provide timely, constructive feedback</li>
                    </ul>
                </div>
                {/* Image content now appears second for smaller screens, but is ordered last for medium screens and up */}
                <div className="image-content md:order-last"> 
                    <img src="https://vmcollegepawapuri.ac.in/wp-content/uploads/2025/07/Rules-Regulations.jpg" alt="Rules and regulations book" className="w-full h-auto rounded-lg shadow-lg shadow-[#c89b3c]/20" />
                </div>
            </div>
        </section>

        {/* FAQ Section */}
        <section data-aos="fade-up" id="faq" className="px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-[#c89b3c] mb-8 text-center">FAQ</h2>
            <div className="space-y-6">
              <div className="bg-[#252525] p-6 rounded-lg">
                <h3 className="text-xl font-bold text-[#c89b3c] mb-2">How can I join?</h3>
                <p className="text-gray-400">Register at the beginning of the Year or contact us via email.</p>
              </div>
              <div className="bg-[#252525] p-6 rounded-lg">
                <h3 className="text-xl font-bold text-[#c89b3c] mb-2">Is there a membership fee?</h3>
                <p className="text-gray-400">Yes, a nominal fee per 4-years covers materials and events.</p>
              </div>
              <div className="bg-[#252525] p-6 rounded-lg">
                <h3 className="text-xl font-bold text-[#c89b3c] mb-2">Do I need to be fluent?</h3>
                <p className="text-gray-400">No, all proficiency levels are welcome!</p>
              </div>
              <div className="bg-[#252525] p-6 rounded-lg">
                <h3 className="text-xl font-bold text-[#c89b3c] mb-2">How often do we meet?</h3>
                <p className="text-gray-400">Weekly, with extra events and workshops throughout the term.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default About;