import React, { useState, useEffect } from 'react'
import './App.css'
import logoImage from '/logo.png'
import { FaLock } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { GiArtificialIntelligence } from "react-icons/gi";
import { AiFillThunderbolt } from "react-icons/ai";



const App = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add('mobile-menu-open')
    } else {
      document.body.classList.remove('mobile-menu-open')
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('mobile-menu-open')
    }
  }, [isMobileMenuOpen])

  return (
    <div className="landing-page">
      {/* Mobile Menu Backdrop */}
      <div 
        className={`mobile-menu-backdrop ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={closeMobileMenu}
      ></div>

      {/* Header */}
      <header className="header" role="banner">
        <div className="container">
          <nav className="nav" role="navigation" aria-label="Main navigation">
            <div className="logo">
              <img src={logoImage} alt="RecallRift Logo" className="logo-icon" />
              <span className="logo-text">RecallRift</span>
            </div>
            <nav className={`nav-links ${isMobileMenuOpen ? 'nav-links-mobile-open' : ''}`} aria-label="Main menu">
              <a href="#features" onClick={closeMobileMenu}>Features</a>
              <a href="#how-it-works" onClick={closeMobileMenu}>How It Works</a>
              <a href="https://github.com/ATHARVA262005/recallrift/blob/main/docs/README.md" target="_blank" rel="noopener noreferrer" onClick={closeMobileMenu}>Docs</a>
              <a href="https://github.com/ATHARVA262005/recallrift" target="_blank" rel="noopener noreferrer" onClick={closeMobileMenu}>
                GitHub
              </a>
              <div className="nav-actions-mobile">
                <button className="btn btn-primary" onClick={() => { window.open('https://dashboard-recallrift.atharvaralegankar.tech', '_blank'); closeMobileMenu(); }}>
                  Launch App
                </button>
              </div>
            </nav>
            <div className="nav-actions">
              <button className="btn btn-primary" onClick={() => window.open('https://dashboard-recallrift.atharvaralegankar.tech', '_blank')}>
                Launch App
              </button>
            </div>
            <button 
              className={`hamburger ${isMobileMenuOpen ? 'hamburger-open' : ''}`}
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="nav-links"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main role="main">
        <section className="hero" id="hero" aria-labelledby="hero-title">
          <div className="container">
            <div className="hero-content">
              <div className="hero-text">
                <h1 id="hero-title" className="hero-title">
                  Your AI-Powered
                  <span className="gradient-text"> Second Brain</span>
                </h1>
                <p className="hero-description">
                  Capture, organize, and rediscover your knowledge with RecallRift. 
                  Chat with your past self and unlock the power of your accumulated wisdom.
                  A local-first, privacy-focused second brain that's completely free and open source.
                </p>
                <div className="hero-features" role="list" aria-label="Key features">
                  <div className="feature-tag" role="listitem"><FaLock aria-hidden="true" /> Local-First</div>
                  <div className="feature-tag" role="listitem"><GiArtificialIntelligence aria-hidden="true" /> AI-Powered</div>
                  <div className="feature-tag" role="listitem"><AiFillThunderbolt aria-hidden="true" /> Lightning Fast</div>
                  <div className="feature-tag" role="listitem"><FaGithub aria-hidden="true" /> Free & Open Source</div>
                </div>
                <div className="hero-actions">
                  <button className="btn btn-primary btn-large" onClick={() => window.open('https://dashboard-recallrift.atharvaralegankar.tech', '_blank')} aria-describedby="launch-description">
                    Start Building Your Second Brain
                  </button>
                  <span id="launch-description" className="sr-only">Opens RecallRift dashboard in a new tab</span>
                  <button className="btn btn-outline btn-large" aria-describedby="demo-description">
                    Watch Demo
                  </button>
                  <span id="demo-description" className="sr-only">View a demonstration of RecallRift features</span>
                </div>
              </div>
              <div className="hero-visual" aria-hidden="true">
                <div className="app-preview">
                  <div className="app-window">
                    <div className="app-header">
                      <div className="app-controls">
                        <span className="control red"></span>
                        <span className="control yellow"></span>
                        <span className="control green"></span>
                      </div>
                      <div className="app-title">RecallRift Dashboard</div>
                    </div>
                    <div className="app-content">
                      <div className="memory-card">
                        <div className="memory-header">
                          <h3>Product Idea: Smart Garden Monitor</h3>
                          <span className="memory-category">Idea</span>
                        </div>
                        <p>IoT device to monitor plant health with AI alerts...</p>
                        <div className="memory-tags">
                          <span className="tag">iot</span>
                          <span className="tag">ai</span>
                          <span className="tag">gardening</span>
                        </div>
                      </div>
                      <div className="chat-interface">
                        <div className="chat-message user">
                          "What ideas do I have for IoT projects?"
                        </div>
                        <div className="chat-message ai">
                          Based on your memories, you have ideas for smart garden monitoring, home automation, and pet tracking devices...
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="features" aria-labelledby="features-title">
          <div className="container">
            <div className="section-header">
              <h2 id="features-title">Powerful Features for Your Second Brain</h2>
              <p>Everything you need to capture, organize, and rediscover your knowledge</p>
            </div>
            <div className="features-grid" role="list" aria-label="Feature list">
              <article className="feature-card" role="listitem">
                <div className="feature-icon" aria-hidden="true">🔒</div>
                <h3>Local-First Storage</h3>
                <p>All your data stays on your device using IndexedDB. No cloud storage, no tracking, complete privacy and control.</p>
              </article>
              <article className="feature-card" role="listitem">
                <div className="feature-icon" aria-hidden="true">🤖</div>
                <h3>AI-Powered Intelligence</h3>
                <p>Google Gemini integration for intelligent summaries, tag suggestions, and natural conversations with your memories.</p>
              </article>
              <article className="feature-card" role="listitem">
                <div className="feature-icon" aria-hidden="true">🔍</div>
                <h3>Advanced Search</h3>
                <p>Powerful fuzzy search with Fuse.js, semantic understanding, and smart filters to find anything instantly.</p>
              </article>
              <article className="feature-card" role="listitem">
                <div className="feature-icon" aria-hidden="true">📊</div>
                <h3>Analytics Dashboard</h3>
                <p>Comprehensive insights into your knowledge patterns, productivity metrics, and memory growth trends.</p>
              </article>
              <article className="feature-card" role="listitem">
                <div className="feature-icon" aria-hidden="true">🏷️</div>
                <h3>Smart Organization</h3>
                <p>Categories, tags, templates, and AI-powered collections to keep your knowledge perfectly organized.</p>
              </article>
              <article className="feature-card" role="listitem">
                <div className="feature-icon" aria-hidden="true">📱</div>
                <h3>Modern Interface</h3>
                <p>Beautiful, responsive design with dark/light themes, built with React 18 and optimized for all devices.</p>
              </article>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="how-it-works" aria-labelledby="how-it-works-title">
          <div className="container">
            <div className="section-header">
              <h2 id="how-it-works-title">How RecallRift Works</h2>
              <p>Simple steps to build your second brain</p>
            </div>
            <div className="steps" role="list" aria-label="Process steps">
              <article className="step" role="listitem">
                <div className="step-number" aria-hidden="true">1</div>
                <div className="step-content">
                  <h3>Capture</h3>
                  <p>Add memories, thoughts, and insights as they come to you. Use smart templates for structured capture or free-form notes.</p>
                </div>
              </article>
              <article className="step" role="listitem">
                <div className="step-number" aria-hidden="true">2</div>
                <div className="step-content">
                  <h3>Organize</h3>
                  <p>Let AI categorize and tag your memories automatically, or organize them manually with your own system and collections.</p>
                </div>
              </article>
              <article className="step" role="listitem">
                <div className="step-number" aria-hidden="true">3</div>
                <div className="step-content">
                  <h3>Discover</h3>
                  <p>Use advanced search and AI chat to rediscover insights, find connections, and have conversations with your knowledge.</p>
                </div>
              </article>
              <article className="step" role="listitem">
                <div className="step-number" aria-hidden="true">4</div>
                <div className="step-content">
                  <h3>Analyze</h3>
                  <p>Track your knowledge growth, discover patterns, and gain productivity insights with comprehensive analytics.</p>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta" aria-labelledby="cta-title">
          <div className="container">
            <div className="cta-content">
              <h2 id="cta-title">Ready to Build Your Second Brain?</h2>
              <p>Join users who are already using RecallRift to capture, organize, and rediscover their knowledge. Completely free and open source.</p>
              <div className="cta-actions">
                <button className="btn btn-primary btn-large" onClick={() => window.open('https://dashboard-recallrift.atharvaralegankar.tech', '_blank')} aria-describedby="launch-cta-description">
                  Launch RecallRift
                </button>
                <span id="launch-cta-description" className="sr-only">Opens RecallRift dashboard in a new tab</span>
                <button className="btn btn-outline btn-large" onClick={() => window.open('https://github.com/ATHARVA262005/recallrift', '_blank')} aria-describedby="github-cta-description">
                  View Source Code
                </button>
                <span id="github-cta-description" className="sr-only">Opens GitHub repository in a new tab</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer" role="contentinfo">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="logo">
                <img src={logoImage} alt="RecallRift Logo" className="logo-icon" />
                <span className="logo-text">RecallRift</span>
              </div>
              <p>Your AI-powered second brain for capturing, organizing, and rediscovering knowledge. Free, open source, and local-first.</p>
            </div>
            <nav className="footer-section" aria-labelledby="product-nav">
              <h4 id="product-nav">Product</h4>
              <ul>
                <li><a href="#features">Features</a></li>
                <li><a href="#how-it-works">How It Works</a></li>
                <li><a href="https://dashboard-recallrift.atharvaralegankar.tech" target="_blank" rel="noopener noreferrer">Launch App</a></li>
                <li><a href="https://github.com/ATHARVA262005/recallrift" target="_blank" rel="noopener noreferrer">GitHub</a></li>
              </ul>
            </nav>
            <nav className="footer-section" aria-labelledby="docs-nav">
              <h4 id="docs-nav">Documentation</h4>
              <ul>
                <li><a href="https://github.com/ATHARVA262005/recallrift/blob/main/docs/USER_GUIDE.md" target="_blank" rel="noopener noreferrer">User Guide</a></li>
                <li><a href="https://github.com/ATHARVA262005/recallrift/blob/main/docs/QUICK_START.md" target="_blank" rel="noopener noreferrer">Quick Start</a></li>
                <li><a href="https://github.com/ATHARVA262005/recallrift/blob/main/docs/api/README.md" target="_blank" rel="noopener noreferrer">API Reference</a></li>
                <li><a href="https://github.com/ATHARVA262005/recallrift/blob/main/docs/development/contributing.md" target="_blank" rel="noopener noreferrer">Contributing</a></li>
              </ul>
            </nav>
            <nav className="footer-section" aria-labelledby="community-nav">
              <h4 id="community-nav">Community</h4>
              <ul>
                <li><a href="https://github.com/ATHARVA262005/recallrift/discussions" target="_blank" rel="noopener noreferrer">Discussions</a></li>
                <li><a href="https://github.com/ATHARVA262005/recallrift/issues" target="_blank" rel="noopener noreferrer">Issues</a></li>
                <li><a href="https://github.com/ATHARVA262005/recallrift/blob/main/docs/README.md" target="_blank" rel="noopener noreferrer">Documentation</a></li>
                <li><a href="https://github.com/ATHARVA262005/recallrift/blob/main/docs/INSTALLATION.md" target="_blank" rel="noopener noreferrer">Installation</a></li>
              </ul>
            </nav>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 RecallRift. Created by <a href="https://github.com/ATHARVA262005" target="_blank" rel="noopener noreferrer">Atharva Ralegankar</a></p>
            <p>Open source under MIT License</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App