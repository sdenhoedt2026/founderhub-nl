import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

const path = window.location.pathname;

async function mount() {
  let Component;
  if (path.startsWith('/admin')) {
    const { default: AdminApp } = await import('./admin/AdminApp.jsx');
    Component = AdminApp;
  } else if (path.startsWith('/my-listing')) {
    const { default: ClaimantApp } = await import('./claimant/ClaimantApp.jsx');
    Component = ClaimantApp;
  } else {
    const { default: App } = await import('./App.jsx');
    Component = App;
  }

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <Component />
    </React.StrictMode>
  );
}

mount();
