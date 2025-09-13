import React, { useState, useEffect } from 'react';
import { Linkedin, MessageSquareQuote, Home as HomeIcon, Info, Calendar, Users, Users2, Phone } from 'lucide-react';

// Note: The global theme styles from App.css are expected to be imported in your main App.jsx or main.jsx file.

const hoverEffectStyles = `
    .member-card::before {
        content: '';
        position: absolute;
        inset: -5px;
        border-radius: 50px; /* Match the card's border-radius */
        background: linear-gradient(-45deg, #00ffff, #0077ff, #ff00ff, #ff7700);
        z-index: -1;
        opacity: 0;
        transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .member-card:hover::before {
        opacity: 1;
        transform: rotate(-90deg) scaleX(1.34) scaleY(0.77);
    }
`;

const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-10">
    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-cyan-400"></div>
  </div>
);

const MemberCard = ({ member }) => (
    <div className="member-card w-[300px] h-[400px] bg-white/10 backdrop-blur-md border border-white/20 flex flex-col justify-end p-3 gap-3 rounded-[50px] cursor-pointer text-white relative hover:scale-105 transition-transform duration-500">
        <div className="w-[150px] h-[150px] rounded-t-full overflow-hidden mx-auto">
            <img 
                src={member.image_url || 'https://placehold.co/150x150/111827/FFFFFF?text=?'} 
                alt={member.name} 
                className="w-full h-full object-cover" 
                onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/150x150/111827/FFFFFF?text=Img'; }}
            />
        </div>
        <div className="w-[250px] h-[250px] p-5 rounded-b-full bg-black/20 backdrop-blur-lg mx-auto flex items-center justify-center text-center">
            <div>
                <h3 className="text-2xl text-gray-200 font-bold">{member.name}</h3>
                <span className="text-sm text-cyan-300">{member.role}</span>
                <p className="text-xs text-gray-400 mt-2 px-2">{member.description}</p>
                {member.linkedin_url && (
                    <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center text-cyan-400 mt-3 hover:text-white transition-colors">
                        <Linkedin size={16} className="mr-2" />
                        LinkedIn
                    </a>
                )}
            </div>
        </div>
    </div>
);

const TestimonialCard = ({ testimonial }) => (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6 text-center">
        <MessageSquareQuote className="w-8 h-8 mx-auto mb-4 text-cyan-400" />
        <p className="text-gray-300 italic">"{testimonial.quote}"</p>
        <p className="text-cyan-300 font-semibold mt-4">- {testimonial.author}</p>
    </div>
);


function Panel({ supabase, showMessageBox }) {
  const [execomMembers, setExecomMembers] = useState([]);
  const [clubMembers, setClubMembers] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTableVisible, setIsTableVisible] = useState(false);
  const [visibleMembersCount, setVisibleMembersCount] = useState(5);

  const navLinks = [
    { href: '\#home', label: 'Home', icon: <HomeIcon size={20} /> },
    { href: '\#about', label: 'About', icon: <Info size={20} /> },
    { href: '\#events', label: 'Events', icon: <Calendar size={20} /> },
    { href: '\#panel', label: 'Panel', icon: <Users2 size={20} /> },
    { href: '\#execom', label: 'execom', icon: <Users size={20} /> },  ];

  useEffect(() => {
    if (window.AOS) {
      window.AOS.init({ duration: 1000, once: false });
    }

    const fetchPanelData = async () => {
      try {
        setLoading(true);
        const [execomRes, clubRes, testimonialRes] = await Promise.all([
          supabase.from('panel_members').select('*').order('order_index', { ascending: true }),
          supabase.from('club_members').select('*').order('name', { ascending: true }),
          supabase.from('panel_testimonials').select('*').order('order_index', { ascending: true })
        ]);

        if (execomRes.error) throw execomRes.error;
        if (clubRes.error) throw clubRes.error;
        if (testimonialRes.error) throw testimonialRes.error;
        
        setExecomMembers(execomRes.data);
        setClubMembers(clubRes.data);
        setTestimonials(testimonialRes.data);

      } catch (err) {
        console.error('Error fetching panel data:', err.message);
        setError('Failed to load the Panel page. Please check the database and try again.');
        if(showMessageBox) showMessageBox('error', 'Failed to load panel data.');
      } finally {
        setLoading(false);
      }
    };

    if (supabase) {
      fetchPanelData();
    }
  }, [supabase, showMessageBox]);

  const facultyMember = execomMembers.find(m => m.role === 'Faculty In-charge');
  const otherMembers = execomMembers.filter(m => m.role !== 'Faculty In-charge');


  const handleShowMore = () => setVisibleMembersCount(prev => prev + 5);
  const handleShowLess = () => setVisibleMembersCount(5);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-center text-red-400 p-8">{error}</div>;

  return (
    <>
      <style>{hoverEffectStyles}</style>
      <div className="main-container">
        <div className="mobile-nav-menu">
            {navLinks.map(link => (
                <a key={link.href} href={link.href} className="mobile-nav-link">
                {link.icon}
                <span>{link.label}</span>
                </a>
            ))}
        </div>
        <div className="background-container">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
          <div className="blob blob-3"></div>
        </div>
        <div className="content-wrapper text-gray-200 min-h-screen p-4 md:p-8">
          <div data-aos="fade-up">
            <h1 className="text-center text-4xl font-roboto font-bold mb-8 text-white">Our Panel</h1>
            
            {facultyMember && (
                <section className="mb-12">
                    <div className="sub-container flex justify-center">
                        <MemberCard key={facultyMember.id} member={facultyMember} />
                    </div>
                </section>
            )}

            {otherMembers.length > 0 && (
              <section className="mb-12">
                  <div className="sub-container flex justify-center gap-8 md:gap-16 flex-wrap">
                      {otherMembers.map(member => <MemberCard key={member.id} member={member} />)}
                  </div>
              </section>
            )}

            {testimonials.length > 0 && (
                <section className="my-16 max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-8 text-white">What Our Members Say</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {testimonials.map(item => <TestimonialCard key={item.id} testimonial={item} />)}
                    </div>
                </section>
            )}

            <p className="member-count text-3xl text-center mt-8 font-bold">
                Total Club Members: {clubMembers.length}
            </p>

            <div className="button-container2 flex justify-center p-5">
              <button
                onClick={() => setIsTableVisible(!isTableVisible)}
                className="members-btn 
                          bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 
                          text-white font-semibold py-2 px-6 
                          cursor-pointer text-base rounded-lg shadow-lg 
                          hover:from-pink-500 hover:via-purple-500 hover:to-blue-500 
                          hover:shadow-xl hover:scale-105 
                          active:scale-95 active:shadow-md 
                          transition-all duration-300 ease-in-out"
              >
                {isTableVisible ? 'Hide Members List' : 'Show Members List'}
              </button>
            </div>

            {isTableVisible && (
                <div className="table-container max-w-6xl mx-auto my-5 rounded-lg overflow-hidden shadow-lg animate-fadeIn" data-aos="fade-up" data-aos-delay="100">
                    <h2 className="bg-gradient-to-r from-gray-400 to-gray-800 text-white text-3xl p-3 text-center">Club Members</h2>
                    <div className="overflow-x-auto">
                        <table className="gradient-table w-full">
                            <thead className="bg-gradient-to-r from-gray-400 to-gray-800 text-white">
                                <tr>
                                    <th className="p-4 text-left">Name</th>
                                    <th className="p-4 text-left">Roll Number</th>
                                    <th className="p-4 text-left">Year</th>
                                    <th className="p-4 text-left">Branch</th>
                                    <th className="p-4 text-left">Email</th>
                                    <th className="p-4 text-left">LinkedIn</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clubMembers.slice(0, visibleMembersCount).map(member => (
                                    <tr key={member.roll_number} className="bg-gradient-to-r from-gray-800 via-gray-900 to-black hover:bg-opacity-20">
                                        <td className="p-4 border-b border-gray-700">{member.name}</td>
                                        <td className="p-4 border-b border-gray-700">{member.roll_number}</td>
                                        <td className="p-4 border-b border-gray-700">{member.year}</td>
                                        <td className="p-4 border-b border-gray-700">{member.branch}</td>
                                        <td className="p-4 border-b border-gray-700">{member.email}</td>
                                        <td className="p-4 border-b border-gray-700">
                                            <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Profile</a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 bg-gray-900 text-center">
                        {visibleMembersCount < clubMembers.length ? (
                            <button onClick={handleShowMore} className="members-btn bg-gradient-to-br from-gray-800 to-gray-400 text-white py-2 px-5 cursor-pointer text-base rounded-md shadow-lg hover:scale-105 transition-all">Show More</button>
                        ) : (
                            clubMembers.length > 5 && <button onClick={handleShowLess} className="members-btn bg-gradient-to-br from-gray-800 to-gray-400 text-white py-2 px-5 cursor-pointer text-base rounded-md shadow-lg hover:scale-105 transition-all">Show Less</button>
                        )}
                    </div>
                </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Panel;
