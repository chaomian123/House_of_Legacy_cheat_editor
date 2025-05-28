// Google Analytics Configuration
// This file contains the configuration for Google Analytics integration

export const analyticsConfig = {
  // Replace with your actual Google Analytics tracking ID
  // Example: 'G-XXXXXXXXXX' for GA4 or 'UA-XXXXXXXXX-X' for Universal Analytics
  googleAnalyticsId: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || '',
  
  // Enable/disable analytics in development
  enableInDevelopment: false,
  
  // Check if analytics should be enabled
  isEnabled: function() {
    return this.googleAnalyticsId && 
           (process.env.NODE_ENV === 'production' || this.enableInDevelopment);
  }
};

// Helper function to track events
export const trackEvent = (action, category, label, value) => {
  if (typeof window !== 'undefined' && window.gtag && analyticsConfig.isEnabled()) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Helper function to track page views
export const trackPageView = (url) => {
  if (typeof window !== 'undefined' && window.gtag && analyticsConfig.isEnabled()) {
    window.gtag('config', analyticsConfig.googleAnalyticsId, {
      page_location: url,
    });
  }
}; 