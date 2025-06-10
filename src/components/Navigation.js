import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="navigation">
      <div className="nav-links">
        <Link 
          to="/" 
          className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}
        >
          📊 ダッシュボード
        </Link>
        <Link 
          to="/aircraft" 
          className={location.pathname === '/aircraft' ? 'nav-link active' : 'nav-link'}
        >
          ✈️ 無人航空機登録
        </Link>
        <Link 
          to="/flight-log" 
          className={location.pathname === '/flight-log' ? 'nav-link active' : 'nav-link'}
        >
          📝 飛行記録
        </Link>
        <Link 
          to="/profile" 
          className={location.pathname === '/profile' ? 'nav-link active' : 'nav-link'}
        >
          👤 プロフィール
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;