import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from '@dr.pogodin/react-helmet';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Settings from './pages/Settings';
import ProductivityDashboard from './pages/ProductivityDashboard';
import SEO from './components/SEO';
import './App.css';

const App = () => {
  return (
    <HelmetProvider>
      <Router>
        <SEO />
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/analytics" element={<ProductivityDashboard />} />
          </Routes>
        </Layout>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'var(--bg-primary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)',
            },
          }}
        />
      </Router>
    </HelmetProvider>
  );
};

export default App