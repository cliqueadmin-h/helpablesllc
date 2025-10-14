'use client';

import { useEffect } from 'react';

interface CalendlyWidgetProps {
  url?: string;
}

export default function CalendlyWidget({ url = 'https://calendly.com/your-username/30min' }: CalendlyWidgetProps) {
  useEffect(() => {
    // Load Calendly script
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Book Your Free 30-Minute Consultation
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Choose a convenient time to discuss your project with our team.
        </p>
      </div>
      
      {/* Calendly Inline Widget */}
      <div 
        className="calendly-inline-widget" 
        data-url={`${url}?hide_gdpr_banner=1&primary_color=3b82f6`}
        style={{ minWidth: '320px', height: '700px' }}
      />
      
      {/* Alternative Contact Option */}
      <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              Prefer Email?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Send us an email at{' '}
              <a 
                href="mailto:support@helpables.org?subject=Consultation Request" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                support@helpables.org
              </a>
              {' '}with your preferred time and we'll confirm your consultation.
            </p>
          </div>
        </div>
      </div>

      {/* Calendar Not Working Fallback */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        <p>Calendar not loading? <button onClick={() => window.location.reload()} className="text-blue-600 dark:text-blue-400 hover:underline">Refresh the page</button> or use the email option above.</p>
      </div>
    </div>
  );
}
