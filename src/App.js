import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navigation from './components/Navigation';
import Login from './components/Login';
import UserProfile from './components/UserProfile';
import Dashboard from './pages/Dashboard';
import AircraftRegistration from './pages/AircraftRegistration';
import FlightLog from './pages/FlightLog';

const App = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // ページロード時にログイン状態をチェック
    const checkLoginStatus = () => {
      try {
        const savedUser = localStorage.getItem('skylogger_current_user');
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('ログイン状態の確認に失敗しました:', error);
        localStorage.removeItem('skylogger_current_user');
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    // ログアウト時にルートページにリダイレクト
    window.location.href = '/';
  };

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner">🚁</div>
          <p>SkyLogger Pro を読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="container">
        <header>
          <div className="header-main">
            <div className="logo-container">
              <div className="logo-icon">🚁</div>
              <div className="title-container">
                <h1>SkyLogger Pro</h1>
                <p className="subtitle">Professional Drone Flight Management System</p>
              </div>
            </div>
            <div className="header-user-controls">
              <div className="user-welcome">
                <span>ようこそ、{user.fullName || user.username}さん</span>
              </div>
              <button className="logout-btn-header" onClick={handleLogout}>
                🚪 ログアウト
              </button>
            </div>
          </div>
          <div className="header-tagline">
            <span className="tagline-text">国土交通省準拠・次世代飛行記録プラットフォーム</span>
          </div>
        </header>
        
        <Navigation />
        
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/aircraft" element={<AircraftRegistration />} />
            <Route path="/flight-log" element={<FlightLog />} />
            <Route 
              path="/profile" 
              element={
                <UserProfile 
                  user={user} 
                  onUpdateUser={handleUpdateUser}
                  onLogout={handleLogout}
                />
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;