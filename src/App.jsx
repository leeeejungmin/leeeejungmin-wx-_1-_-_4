import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './components/Home';
import BudgetDashboard from './components/BudgetDashboard';
import VoucherEntry from './components/VoucherEntry';
import AnomalyDetection from './components/AnomalyDetection';
import RegulationQnA from './components/RegulationQnA';
import FloatingCharacter from './components/FloatingCharacter';
import './App.css';

function AppContent() {
  const [showQnA, setShowQnA] = useState(false);
  const location = useLocation();

  return (
    <div className="app">
      <nav className="navbar">
        <div className="navbar-brand">
          <h1>🤖 AI 예산관리 시스템</h1>
          <span className="powered-by">Powered by Claude Sonnet 4 & 강화학습</span>
        </div>
        <div className="navbar-menu">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            🏠 홈
          </Link>
          <Link to="/budget" className={location.pathname === '/budget' ? 'active' : ''}>
            📊 예산 대시보드
          </Link>
          <Link to="/voucher" className={location.pathname === '/voucher' ? 'active' : ''}>
            📝 전표 작성
          </Link>
          <Link to="/anomaly" className={location.pathname === '/anomaly' ? 'active' : ''}>
            🔍 이상탐지
          </Link>
        </div>
      </nav>

      <div className="main-container">
        <div className={`content-area ${showQnA ? 'with-sidebar' : ''}`}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/budget" element={<BudgetDashboard />} />
            <Route path="/voucher" element={<VoucherEntry />} />
            <Route path="/anomaly" element={<AnomalyDetection />} />
          </Routes>
        </div>

        {showQnA && (
          <div className="sidebar-panel">
            <RegulationQnA onClose={() => setShowQnA(false)} />
          </div>
        )}
      </div>

      <FloatingCharacter onClick={() => setShowQnA(!showQnA)} />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
