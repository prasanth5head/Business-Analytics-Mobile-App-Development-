import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { GoogleOAuthProvider } from '@react-oauth/google';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);

// Register service worker with update callback
serviceWorkerRegistration.register({
  onUpdate: (registration) => {
    // Custom event to be caught by PWAUpdateHandler component
    const event = new CustomEvent('pwa-update', { detail: registration });
    window.dispatchEvent(event);
  }
});

reportWebVitals();
