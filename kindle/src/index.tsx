import 'cross-fetch/polyfill';
import { createRoot } from 'react-dom/client';

import { App } from './components/App';
import './index.css';
import { setupDayJs } from './util/setupDayjs';

setupDayJs();

// @ts-ignore
createRoot(document.getElementById('root')).render(<App />);
