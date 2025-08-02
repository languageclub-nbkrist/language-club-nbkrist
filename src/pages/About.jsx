import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';

function About({ supabase, showMessageBox }) {
  const [aboutCards, setAboutCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAboutCards = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('about_cards')
          .select('*')
          .order('order_index', { ascending: true });

        if (error) throw error;
        setAboutCards(data);
      } catch (err) {
        console.error('Error fetching about cards:', err.message);
        setError('Failed to load about section. Please try again later.');
        showMessageBox('error', 'Failed to load about section. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAboutCards();
  }, [showMessageBox]);

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
    <section id="about" className="about-section">
      <h2 className="text-blue-900">About <span>LanguageClub NBKRIST</span></h2>
      <p className="about-tagline">Where words meet innovation, and ideas find their voice.</p>

      <div className="about-cards-grid">
        {aboutCards.length > 0 ? (
          aboutCards.map((card, index) => (
            <div key={card.id} className="about-card" style={{ animationDelay: `${index * 0.2}s` }}>
              <h3 className="text-blue-900">{card.title}</h3>
              <p className="text-gray-700">{card.description}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-600 col-span-full">No about cards available. Please add content to Supabase.</p>
        )}
      </div>
    </section>
  );
}

export default About;