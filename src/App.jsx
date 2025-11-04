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
          <h1>🤖 PosPoFiA</h1>
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
            📝 전표작성
          </Link>
          <Link to="/anomaly" className={location.pathname === '/anomaly' ? 'active' : ''}>
            🔍 이상탐지
          </Link>
          <Link to="/qna" className={location.pathname === '/qna' ? 'active' : ''}>
            🐻‍❄️ 규정관리봇
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

        {/* showQnA가 false일 때만 플로팅 버튼 보여줌 */}
        {!showQnA && (
          <FloatingCharacter onClick={() => setShowQnA(true)} />
        )}
      </div>
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
