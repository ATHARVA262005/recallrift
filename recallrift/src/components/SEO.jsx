import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
  title = 'RecallRift - Your AI-Powered Second Brain',
  description = 'Transform your knowledge management with RecallRift. Capture, organize, and rediscover your thoughts with AI-powered search, chat functionality, and complete privacy. Local-first, free, and open source.',
  keywords = 'second brain, knowledge management, AI assistant, note taking, memory palace, productivity tools, local storage, privacy first, personal knowledge base, digital brain, cognitive enhancement, smart notes',
  image = '/og-image.png',
  url = window.location.href,
  type = 'website',
  author = 'Atharva Ralegankar',
  publishedTime,
  modifiedTime,
  structuredData
}) => {
  const siteUrl = 'https://dashboard-recallrift.atharvaralegankar.tech';
  const fullUrl = url.startsWith('http') ? url : `${siteUrl}${url}`;
  const fullImageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;

  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "RecallRift",
    "applicationCategory": "ProductivityApplication",
    "operatingSystem": "Web Browser",
    "description": description,
    "url": fullUrl,
    "author": {
      "@type": "Person",
      "name": author,
      "url": "https://github.com/ATHARVA262005"
    },
    "publisher": {
      "@type": "Organization", 
      "name": "RecallRift",
      "url": siteUrl
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "screenshot": fullImageUrl,
    "featureList": [
      "AI-Powered Knowledge Management",
      "Local-First Storage", 
      "Advanced Search",
      "Chat with Your Memories",
      "Analytics Dashboard",
      "Smart Organization",
      "Privacy-Focused",
      "Open Source"
    ]
  };

  const finalStructuredData = structuredData || defaultStructuredData;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="language" content="English" />
      <meta name="geo.region" content="IN" />
      <meta name="geo.placename" content="India" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`${title} - Preview`} />
      <meta property="og:site_name" content="RecallRift" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:image:alt" content={`${title} - Preview`} />
      <meta name="twitter:creator" content="@ATHARVA262005" />
      <meta name="twitter:site" content="@RecallRift" />
      
      {/* Additional Meta Tags */}
      <meta name="application-name" content="RecallRift" />
      <meta name="apple-mobile-web-app-title" content="RecallRift" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="msapplication-TileColor" content="#0f172a" />
      <meta name="theme-color" content="#3b82f6" />
      <meta name="color-scheme" content="dark light" />
      
      {/* Article Meta Tags */}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {author && <meta property="article:author" content={author} />}
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(finalStructuredData)}
      </script>
    </Helmet>
  );
};

export default SEO;
