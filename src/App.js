import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import AircraftRegistration from './pages/AircraftRegistration';
import FlightLog from './pages/FlightLog';

const App = () => {
  return (
    <Router>
      <div className="container">
        <header>
          <h1>ドローン飛行記録システム</h1>
          <p className="subtitle">国土交通省準拠 無人航空機飛行日誌 - React版</p>
        </header>
        
        <Navigation />
        
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/aircraft" element={<AircraftRegistration />} />
            <Route path="/flight-log" element={<FlightLog />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;