import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { OptimizationProvider } from './context/OptimizationContext.jsx';
import './App.css';

async function enableMocking() {
  // Only intercept requests in the browser dev/build environment. Tests set
  // up their own MSW node server (see src/mocks/server.js + tests/setup.js).
  const { worker } = await import('./mocks/browser.js');
  return worker.start({
    onUnhandledRequest: 'bypass'
  });
}

enableMocking().finally(() => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <OptimizationProvider>
        <App />
      </OptimizationProvider>
    </React.StrictMode>
  );
});
