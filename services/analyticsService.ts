// services/analyticsService.ts
declare global {
  interface Window {
    gtag?: (command: string, eventName: string, eventParams?: any) => void;
  }
}

export const trackEvent = (
  eventName: string,
  eventParams: {
    event_category?: string;
    event_action?: string;
    event_label?: string;
    value?: number;
    [key: string]: any; // Allow other custom parameters for GA4
  }
): void => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, eventParams);
    // console.log(`GA Event: ${eventName}`, eventParams); // For debugging
  } else {
    // console.warn('Google Analytics gtag function not found. Event not tracked:', eventName, eventParams);
  }
};
