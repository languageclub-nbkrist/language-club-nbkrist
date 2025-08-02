import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';

function Panel({ supabase, showMessageBox }) {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('panel_testimonials')
          .select('*')
          .order('order_index', { ascending: true });

        if (error) throw error;
        setTestimonials(data);
      } catch (err) {
        console.error('Error fetching panel testimonials:', err.message);
        setError('Failed to load panel section. Please try again later.');
        showMessageBox('error', 'Failed to load panel section. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
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
    <section id="panel" className="panel-section">
      <h2 className="text-blue-900">Whatever the members think about the Language Club, their opinions matter to us🤔💭</h2>
      <div className="panel-card-container">
        {testimonials.length > 0 ? (
          testimonials.map((testimonial) => (
            <div key={testimonial.id} className="panel-card">
              <p className="text-gray-700">{testimonial.quote}</p>
              {testimonial.author && <p className="text-gray-500 mt-2">- {testimonial.author}</p>}
            </div>
          ))
        ) : (
          <p className="text-gray-600 col-span-full">No testimonials available. Please add content to Supabase.</p>
        )}
      </div>
    </section>
  );
}

export default Panel;