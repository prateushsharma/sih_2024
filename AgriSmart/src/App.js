import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/login/login';
import PageLoader from './components/pageLoader/pageLoader';
import Homepage from './pages/homepage/homepage';

function App() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simulate a loading delay
    setTimeout(() => setLoading(false), 2000);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={loading ? <PageLoader /> : <Login />} />
        <Route path="/" element={loading ? <PageLoader /> : <Homepage/>} />
      </Routes>
    </Router>
  );
}

export default App;
