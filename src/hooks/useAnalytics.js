import { useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import api from '../redux/api/apiService';

const SESSION_KEY = 'analytics_session_id';

/**
 * Custom hook for analytics tracking
 * @param {string} moduleType - 'public' or 'landing'
 * @param {string} landingPageId - Optional, required for landing module
 */
const useAnalytics = (moduleType = 'public', landingPageId = null) => {
  
  // Initialize session ID
  useEffect(() => {
    let sessionId = localStorage.getItem(SESSION_KEY);
    if (!sessionId) {
      sessionId = uuidv4();
      localStorage.setItem(SESSION_KEY, sessionId);
    }
  }, []);

  const getSessionId = () => localStorage.getItem(SESSION_KEY);

  /**
   * Track an event
   * @param {string} eventType - Event type name
   * @param {Object} metadata - Additional data
   */
  const trackEvent = useCallback(async (eventType, metadata = {}) => {
    try {
      const sessionId = getSessionId();
      if (!sessionId) return;

      const endpoint = moduleType === 'landing' 
        ? '/api/analytics/landing/track' 
        : '/api/analytics/track';

      const payload = {
        sessionId,
        eventType,
        metadata,
        url: window.location.pathname
      };

      if (moduleType === 'landing') {
        if (!landingPageId) return; // Cannot track landing event without ID
        payload.landingPageId = landingPageId;
        
        // Capture UTM params
        const params = new URLSearchParams(window.location.search);
        payload.campaign = params.get('utm_campaign');
        payload.source = params.get('utm_source');
      }

      // Fire and forget - don't await
      api.post(endpoint, payload).catch(err => console.error('Tracking failed', err));
      
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }, [moduleType, landingPageId]);

  return { trackEvent };
};

export default useAnalytics;
