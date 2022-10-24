import React from 'react';
import { createRoot } from 'react-dom/client';
import './App1.css';
import App1 from './App1';
 
const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<App1 tab="home" />);