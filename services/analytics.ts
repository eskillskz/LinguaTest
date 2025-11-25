import { AnalyticsEvent } from '../types';

export const trackEvent = (event: AnalyticsEvent) => {
  console.log('ANALYTICS:', JSON.stringify(event, null, 2));
  // In a real app, this would send data to a backend
};