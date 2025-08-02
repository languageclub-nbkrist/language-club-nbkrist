import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';

function Events({ supabase, showMessageBox }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('order_index', { ascending: true });

        if (error) throw error;
        setEvents(data);
      } catch (err) {
        console.error('Error fetching events:', err.message);
        setError('Failed to load events section. Please try again later.');
        showMessageBox('error', 'Failed to load events section. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
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
    <section id="events" className="events-section">
      <h2 className="text-indigo-900">🤵WHAT WE DO?👩‍🎓</h2>
      <p className="events-intro">Get ready to explore, learn, and lead—on a club time.</p>

      <div className="events-container">
        {events.length > 0 ? (
          events.map((event, index) => (
            <div key={event.id} className="event-card" style={{ animationDelay: `${index * 0.3}s` }}>
              {/* Removed event date and title as per original HTML structure, only description */}
              <p className="text-gray-800">{event.description}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-600 col-span-full">No event descriptions available. Please add content to Supabase.</p>
        )}
      </div>
    </section>
  );
}

export default Events;