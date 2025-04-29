import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Admin from './components/Admin';

function App() {
  return (
    <Router>
      <Admin />
    </Router>
  );
}

export default App;