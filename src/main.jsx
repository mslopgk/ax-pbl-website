import { createRoot } from 'react-dom/client';
import './styles/themes.css';
import './styles/global.css';
import App from './App.jsx';

// StrictMode intentionally omitted: its dev-only double-invoke re-initialises
// Lenis / ScrollTrigger / SplitText and causes duplicated instances + stale
// triggers. Production is unaffected by this either way.
createRoot(document.getElementById('root')).render(<App />);
