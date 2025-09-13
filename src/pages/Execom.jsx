import React, { useState, useEffect } from 'react';
import { Linkedin, Home as HomeIcon, Info, Calendar, Users, Users2, Phone } from 'lucide-react';

// Note: The global theme styles from App.css are expected to be imported in your main App.jsx or main.jsx file.

const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-20">
    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-400"></div>
  </div>
);

const ExecomMemberCard = ({ member, isPrimary = false }) => {
    const cardClasses = isPrimary ? "bg-indigo-500/30 p-6" : "bg-indigo-500/10 p-4";
    const imageSize = isPrimary ? "w-32 h-32" : "w-24 h-24";
    const nameSize = isPrimary ? "text-xl" : "text-lg";
    const roleSize = isPrimary ? "text-indigo-200 text-base" : "text-indigo-300 text-sm";

    return (
        <div className={`w-full max-w-xs sm:w-72 flex-shrink-0 backdrop-blur-md border border-indigo-500/30 rounded-xl text-center transition-all duration-300 hover:bg-indigo-500/40 hover:shadow-2xl ${cardClasses}`}>
            <img 
                src={member.image_url || `https://placehold.co/128x128/312e81/a5b4fc?text=${member.name.charAt(0)}`} 
                alt={member.name} 
                className={`mx-auto rounded-full object-cover border-4 border-indigo-400/50 mb-4 ${imageSize}`}
                onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/128x128/312e81/a5b4fc?text=Img'; }}
            />
            <h3 className={`font-bold text-white ${nameSize}`}>{member.name}</h3>
            <p className={`font-semibold ${roleSize}`}>{member.role}</p>
            {member.linkedin_url && (
                 <a 
                    href={member.linkedin_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center justify-center text-indigo-300 mt-2 hover:text-white transition-colors"
                >
                    <Linkedin size={16} className="mr-1" />
                    Profile
                </a>
            )}
        </div>
    );
};

function Execom({ supabase, showMessageBox }) {
  const [allMembers, setAllMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableYears, setAvailableYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);

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
    
    const fetchExecomData = async () => {
      try {
        setLoading(true);
        if (!supabase) throw new Error("Supabase client is not available.");

        const { data, error } = await supabase
          .from('execom_members')
          .select('*')
          .order('batch_year', { ascending: false })
          .order('order_index', { ascending: true });

        if (error) throw error;
        
        setAllMembers(data);
        const years = [...new Set(data.map(member => member.batch_year))].sort((a, b) => b - a);
        setAvailableYears(years);
        
        if (years.length > 0) {
            setSelectedYear(years[0]);
        }
      } catch (err) {
        console.error('Error fetching execom data:', err.message);
        setError('Failed to load the Execom page. Please try again.');
        if(showMessageBox) showMessageBox('error', 'Failed to load Execom data.');
      } finally {
        setLoading(false);
      }
    };

    fetchExecomData();
  }, [supabase, showMessageBox]);

  const filteredMembers = selectedYear
    ? allMembers.filter(member => member.batch_year === selectedYear)
    : [];
  
  const faculty = filteredMembers.find(m => m.role === 'Faculty In-charge');
  const students = filteredMembers.filter(m => m.role !== 'Faculty In-charge');

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-center text-red-400 p-8 bg-red-900/20 rounded-lg">{error}</div>;

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
        <div className="background-container">
            <div className="blob blob-1"></div>
            <div className="blob blob-2"></div>
            <div className="blob blob-3"></div>
        </div>
        <div className="content-wrapper text-gray-200 min-h-screen">
            <div className="container mx-auto px-4 py-12">
            <h1 data-aos="fade-up" className="text-center text-5xl font-bold mb-8 text-white">Executive Committee</h1>
            
            {availableYears.length > 1 && (
                <div data-aos="fade-up" data-aos-delay="100" className="flex justify-center items-center mb-12">
                    <div className="bg-black/30 backdrop-blur-sm border border-gray-700 rounded-full p-2 flex items-center space-x-2 overflow-x-auto">
                        {availableYears.map(year => (
                            <button 
                            key={year}
                            onClick={() => setSelectedYear(year)}
                            className={`px-5 py-2 text-sm font-semibold rounded-full transition-all duration-300 whitespace-nowrap ${selectedYear === year ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-300 hover:bg-gray-700'}`}
                            >
                            Batch {year}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {filteredMembers.length > 0 ? (
                <section data-aos="fade-up" data-aos-delay="200" className="bg-indigo-900/20 backdrop-blur-xl border border-indigo-500/30 rounded-2xl p-6 md:p-8">
                    <h2 className="text-3xl font-bold text-center text-white mb-8">Batch {selectedYear}</h2>
                    
                    {faculty && (
                        <div className="flex justify-center mb-8">
                            <ExecomMemberCard member={faculty} isPrimary={true} />
                        </div>
                    )}

                    <div className="flex flex-wrap justify-center gap-6">
                        {students.map(member => (
                            <ExecomMemberCard key={member.id} member={member} />
                        ))}
                    </div>
                </section>
            ) : (
                <div className="text-center text-gray-500 py-16">
                    <h3 className="text-2xl font-semibold">No members found for this year.</h3>
                </div>
            )}
            </div>
        </div>
    </div>
  );
}

export default Execom;
