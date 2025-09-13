import React, { useState, useEffect, lazy, Suspense } from 'react';
// import About from './pages/About';
// import Execom from './pages/Execom';
// import Events from './pages/Events';
// import Home from './pages/Home';
// import NotFound from './pages/NotFound';
// import Panel from './pages/Panel';
import Footer from './components/Footer';
import Header from './components/Header';
import LoadingSpinner from './components/LoadingSpinner';
import MessageBox from './components/MessageBox'; // Custom message box for alerts

// Import the Supabase client from its dedicated file
import { supabase } from './supabaseClient'; // <--- CORRECT WAY TO IMPORT SUPABASE

const About = lazy(() => import('./pages/About'));
const Execom = lazy(() => import('./pages/Execom'));
const Events = lazy(() => import('./pages/Events'));
const Home = lazy(() => import('./pages/Home'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Panel = lazy(() => import('./pages/Panel'));

// Global variables for Firebase (not used directly in this Supabase implementation, but kept for context if you switch back or use both)
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [siteSettings, setSiteSettings] = useState(null); // To store dynamic site settings
  const [message, setMessage] = useState({ show: false, type: '', text: '' });

  // Function to show a message box
  const showMessageBox = (type, text) => {
    setMessage({ show: true, type, text });
  };

  // Function to hide the message box
  const hideMessageBox = () => {
    setMessage({ show: false, type: '', text: '' });
  };

  // Fetch site settings from Supabase
  useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('site_settings')
          .select('*');

        if (error) throw error;

        // Transform settings into a more accessible object
        const settings = {};
        data.forEach(item => {
          settings[item.setting_name] = item.setting_value;
        });
        setSiteSettings(settings);
      } catch (err) {
        console.error('Error fetching site settings:', err.message);
        setError('Failed to load site settings. Please try again later.');
        showMessageBox('error', 'Failed to load site settings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSiteSettings();

    // Handle initial page load based on hash
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1); // Remove '#'
      if (hash) {
        setCurrentPage(hash);
      } else {
        setCurrentPage('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Call on initial load

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const navigate = (page) => {
    setCurrentPage(page);
    window.location.hash = page; // Update URL hash for direct linking
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

  // Render the current page based on state
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home supabase={supabase} showMessageBox={showMessageBox} />;
      case 'about':
        return <About supabase={supabase} showMessageBox={showMessageBox} />;
      case 'events':
        return <Events supabase={supabase} showMessageBox={showMessageBox} />;
      case 'panel':
        return <Panel supabase={supabase} showMessageBox={showMessageBox} />;
      case 'execom':
        return <Execom supabase={supabase} showMessageBox={showMessageBox} />;
      // Add other pages here
      default:
        return <NotFound />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header navigate={navigate} siteSettings={siteSettings} />
      <main className="flex-grow">
        <Suspense fallback={<LoadingSpinner />}>
          {renderPage()}
        </Suspense>
      </main>
      <Footer siteSettings={siteSettings} />
      {message.show && (
        <MessageBox
          type={message.type}
          text={message.text}
          onClose={hideMessageBox}
        />
      )}
    </div>
  );
}

export default App;
