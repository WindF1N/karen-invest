import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Navigate from './navigate';
import { SocketProvider } from './context';
import { BrowserRouter as Router } from 'react-router-dom'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <SocketProvider>
    <Router>
      <Navigate />
    </Router>
  </SocketProvider>
);
