import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

declare global {
  interface Window {
    closeAlert?: (id: string) => void;
  }
}

// Global utility for alert close buttons
window.closeAlert = (id: string) => {
  const el = document.getElementById(id);
  if (el) {
    el.style.display = 'none';
  }
};

createRoot(document.getElementById('root')!).render(<App />);
