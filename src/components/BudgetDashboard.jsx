import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Minus, Download, RefreshCw, AlertCircle, Brain, Zap } from 'lucide-react';

const API_BASE = 'http://localhost:5005/api';

const BudgetDashboard = () => {
  const [budgets, setBudgets] = useState({});
  const [loading, setLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [rlRecommendation, setRlRecommendation] = useState(null);
  const [userContext, setUserContext] = useState('');
  const [showRLPanel, setShowRLPanel] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [urgencyLevel, setUrgencyLevel] = useState(50);
  const [feedbackReward, setFeedbackReward] = useState(0);

  const COLORS = {
    '회의비': '#667eea',
    '업무추진비': '#48bb78',
    '복리후생비': '#f6ad55'
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/budgets`);
      setBudgets(response.data);
      
      // 자동으로 예산 사용률 체크 (50% 미만 시 알림)
      Object.entries(response.data).forEach(([category, budget]) => {
        if (budget.monthly_usage_rate < 50) {
          checkBudgetUsage(category, budget.monthly_usage_rate);
        }
      });
    } catch (error) {
      console.error('예산 데이터 로드 실패:', error);
    }
    setLoading(false);
  };

  const analyzeBudget = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/budget/analysis`, {
        budgets,
        user_context: userContext
      });
      setAiAnalysis(response.data.analysis);
    } catch (error) {
      console.error('AI 분석 실패:', error);
      setAiAnalysis('AI 분석 중 오류가 발생했습니다. Bedrock 설정을 확인해주세요.');
    }
    setLoading(false);
  };

  const getRLRecommendation = async (category) => {
    setLoading(true);
    setSelectedCategory(category);
    setShowRLPanel(true);
    
    try {
      const budget = budgets[category];
      const state = {
        available_ratio: (budget.available / budget.total) * 100,
        used_ratio: (budget.used / budget.total) * 100,
        urgency_level: urgencyLevel,
        month: new Date().getMonth() + 1
      };

      const response = await axios.post(`${API_BASE}/rl/recommend`, {
        ...state,
        claude_analysis: aiAnalysis
      });
      
      setRlRecommendation(response.data);
    } catch (error) {
      console.error('강화학습 추천 실패:', error);
    }
    setLoading(false);
  };

  const submitFeedback = async (action) => {
    if (!selectedCategory) return;

    try {
      const budget = budgets[selectedCategory];
      const state = {
        available_ratio: (budget.available / budget.total) * 100,
        used_ratio: (budget.used / budget.total) * 100,
        urgency_level: urgencyLevel,
        month: new Date().getMonth() + 1
      };

      // 다음 상태 시뮬레이션
      let nextUsed = budget.used;
      if (action === '증액') {
        nextUsed += budget.total * 0.1;
      } else if (action === '감소') {
        nextUsed -= budget.total * 0.05;
      }

      const nextState = {
        ...state,
        used_ratio: (nextUsed / budget.total) * 100,
        available_ratio: ((budget.total - nextUsed) / budget.total) * 100
      };

      await axios.post(`${API_BASE}/rl/feedback`, {
        state,
        action,
        reward: feedbackReward,
        next_state: nextState
      });

      alert('✅ 피드백이 성공적으로 반영되었습니다! 강화학습 모델이 업데이트되었습니다.');
      setShowRLPanel(false);
      setRlRecommendation(null);
    } catch (error) {
      console.error('피드백 제출 실패:', error);
    }
  };

  const checkBudgetUsage = async (category, usageRate) => {
    try {
      await axios.post(`${API_BASE}/budget/check-usage`, {
        budget_type: category,
        usage_rate: usageRate
      });
    } catch (error) {
      console.error('예산 사용률 체크 실패:', error);
    }
  };

  const downloadReport = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/budget/report`, {
        budgets,
        analysis: aiAnalysis
      }, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `budget_report_${new Date().toISOString().split('T')[0]}.txt`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('보고서 다운로드 실패:', error);
    }
    setLoading(false);
  };

  const chartData = Object.entries(budgets).map(([category, budget]) => ({
    name: category,
    총예산: budget.total,
    사용예산: budget.used,
    가용예산: budget.available
  }));

  const pieData = Object.entries(budgets).map(([category, budget]) => ({
    name: category,
    value: budget.used
  }));

  if (loading && Object.keys(budgets).length === 0) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2>📊 예산 관리 대시보드</h2>
            <p style={{ color: '#718096', marginTop: '0.5rem' }}>
              <Brain size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
              강화학습 기반 스마트 예산 관리
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-secondary" onClick={fetchBudgets} disabled={loading}>
              <RefreshCw size={16} /> 새로고침
            </button>
            <button className="btn btn-primary" onClick={downloadReport} disabled={loading || !aiAnalysis}>
              <Download size={16} /> 보고서 다운로드
            </button>
          </div>
        </div>

        {/* 전체 요약 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '1.5rem',
            borderRadius: '12px',
            color: 'white'
          }}>
            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>총 예산</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 'bold', marginTop: '0.5rem' }}>
              {Object.values(budgets).reduce((sum, b) => sum + b.total, 0).toLocaleString()}원
            </div>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
            padding: '1.5rem',
            borderRadius: '12px',
            color: 'white'
          }}>
            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>사용 예산</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 'bold', marginTop: '0.5rem' }}>
              {Object.values(budgets).reduce((sum, b) => sum + b.used, 0).toLocaleString()}원
            </div>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, #f6ad55 0%, #ed8936 100%)',
            padding: '1.5rem',
            borderRadius: '12px',
            color: 'white'
          }}>
            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>가용 예산</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 'bold', marginTop: '0.5rem' }}>
              {Object.values(budgets).reduce((sum, b) => sum + b.available, 0).toLocaleString()}원
            </div>
          </div>
        </div>

        {/* 차트 */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
          <div>
            <h3 style={{ marginBottom: '1rem' }}>예산 현황</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="총예산" fill="#667eea" />
                <Bar dataKey="사용예산" fill="#48bb78" />
                <Bar dataKey="가용예산" fill="#f6ad55" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h3 style={{ marginBottom: '1rem' }}>사용 예산 비율</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${((entry.value / Object.values(budgets).reduce((sum, b) => sum + b.used, 0)) * 100).toFixed(1)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 예산 항목별 상세 */}
        <h3 style={{ marginBottom: '1rem' }}>예산 항목별 상세</h3>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {Object.entries(budgets).map(([category, budget]) => (
            <div
              key={category}
              style={{
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1.5rem',
                background: budget.monthly_usage_rate < 50 ? '#fff5f5' : 'white'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                  <h4 style={{ color: COLORS[category], fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                    {category}
                  </h4>
                  {budget.monthly_usage_rate < 50 && (
                    <div className="alert alert-danger" style={{ padding: '0.5rem', margin: '0.5rem 0' }}>
                      <AlertCircle size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                      월 편성 50% 미만! 긴급 점검 필요
                    </div>
                  )}
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => getRLRecommendation(category)}
                  style={{ background: COLORS[category] }}
                >
                  <Brain size={16} /> 강화학습 추천
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.875rem', color: '#718096' }}>총 예산</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#2d3748' }}>
                    {budget.total.toLocaleString()}원
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', color: '#718096' }}>사용 예산</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#48bb78' }}>
                    {budget.used.toLocaleString()}원 ({budget.usage_rate}%)
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', color: '#718096' }}>가용 예산</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#f6ad55' }}>
                    {budget.available.toLocaleString()}원
                  </div>
                </div>
              </div>

              {/* 진행 바 */}
              <div style={{ position: 'relative', height: '30px', background: '#e2e8f0', borderRadius: '15px', overflow: 'hidden' }}>
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    height: '100%',
                    width: `${budget.usage_rate}%`,
                    background: budget.usage_rate < 50 ? 'linear-gradient(90deg, #f56565, #fc8181)' : 'linear-gradient(90deg, #48bb78, #68d391)',
                    transition: 'width 0.3s'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  width: '100%',
                  textAlign: 'center',
                  lineHeight: '30px',
                  color: budget.usage_rate > 40 ? 'white' : '#2d3748',
                  fontWeight: 'bold',
                  fontSize: '0.875rem'
                }}>
                  월별 목표 대비 {budget.monthly_usage_rate}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Claude AI 분석 섹션 */}
      <div className="card">
        <h3>🤖 Claude AI 추가 분석</h3>
        <p style={{ color: '#718096', marginBottom: '1rem' }}>
          현재 상황을 입력하고 AI 분석을 받아보세요
        </p>

        <div className="form-group">
          <label>상황 입력 (예: 긴급교체장비 3대 필요, 안전사고 위험 증가 등)</label>
          <textarea
            value={userContext}
            onChange={(e) => setUserContext(e.target.value)}
            placeholder="예: 이번 달 안전 장비 3대의 긴급 교체가 필요합니다. 장비 노후로 인한 안전사고 위험이 증가하고 있습니다."
            rows={3}
          />
        </div>

        <button
          className="btn btn-primary"
          onClick={analyzeBudget}
          disabled={loading}
          style={{ marginBottom: '1rem' }}
        >
          <Zap size={16} /> {loading ? 'AI 분석 중...' : 'Claude AI 분석 실행'}
        </button>

        {aiAnalysis && (
          <div className="alert alert-info" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
            {aiAnalysis}
          </div>
        )}
      </div>

      {/* 강화학습 추천 패널 */}
      {showRLPanel && rlRecommendation && (
        <div className="card" style={{ background: '#f7fafc', border: '3px solid #667eea' }}>
          <h3>
            <Brain size={24} style={{ display: 'inline', marginRight: '0.5rem' }} />
            강화학습 예산 조정 추천 - {selectedCategory}
          </h3>

          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            marginTop: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{
                padding: '1rem 2rem',
                background: rlRecommendation.action === '증액' ? '#c6f6d5' : rlRecommendation.action === '감소' ? '#fed7d7' : '#e2e8f0',
                borderRadius: '12px',
                fontSize: '1.5rem',
                fontWeight: 'bold'
              }}>
                {rlRecommendation.action === '증액' && <TrendingUp size={24} style={{ display: 'inline', marginRight: '0.5rem' }} />}
                {rlRecommendation.action === '감소' && <TrendingDown size={24} style={{ display: 'inline', marginRight: '0.5rem' }} />}
                {rlRecommendation.action === '유지' && <Minus size={24} style={{ display: 'inline', marginRight: '0.5rem' }} />}
                {rlRecommendation.action}
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#718096' }}>신뢰도</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#667eea' }}>
                  {rlRecommendation.confidence}%
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <strong>AI 분석 이유:</strong>
              <p style={{ marginTop: '0.5rem', color: '#4a5568', lineHeight: '1.6' }}>
                {rlRecommendation.reasoning}
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1rem',
              padding: '1rem',
              background: '#f7fafc',
              borderRadius: '8px'
            }}>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#718096' }}>감소 Q값</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                  {rlRecommendation.q_values.감소}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#718096' }}>유지 Q값</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                  {rlRecommendation.q_values.유지}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#718096' }}>증액 Q값</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                  {rlRecommendation.q_values.증액}
                </div>
              </div>
            </div>
          </div>

          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', marginBottom: '1rem' }}>
            <h4 style={{ marginBottom: '1rem' }}>긴급도 입력</h4>
            <div className="form-group">
              <label>
                긴급 교체 필요도: {urgencyLevel}%
                <span style={{ marginLeft: '1rem', fontSize: '0.875rem', color: '#718096' }}>
                  (장비 교체, 안전사고 위험 등)
                </span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={urgencyLevel}
                onChange={(e) => setUrgencyLevel(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px' }}>
            <h4 style={{ marginBottom: '1rem' }}>사용자 피드백 (강화학습 업데이트)</h4>
            <p style={{ fontSize: '0.875rem', color: '#718096', marginBottom: '1rem' }}>
              실제로 어떤 조치를 취했는지, 그 결과가 좋았는지 피드백해주세요.
            </p>

            <div className="form-group">
              <label>보상 점수 (-100 ~ +100)</label>
              <input
                type="number"
                min="-100"
                max="100"
                value={feedbackReward}
                onChange={(e) => setFeedbackReward(Number(e.target.value))}
                placeholder="좋은 결과: +50~100, 나쁜 결과: -50~-100"
              />
              <small style={{ color: '#718096' }}>
                예: 증액 후 안전사고 방지 → +80점, 불필요한 증액 → -50점
              </small>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className="btn btn-success"
                onClick={() => submitFeedback('증액')}
              >
                <TrendingUp size={16} /> 증액 실행 완료
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => submitFeedback('유지')}
              >
                <Minus size={16} /> 유지 실행 완료
              </button>
              <button
                className="btn btn-warning"
                onClick={() => submitFeedback('감소')}
              >
                <TrendingDown size={16} /> 감소 실행 완료
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setShowRLPanel(false);
                  setRlRecommendation(null);
                }}
                style={{ marginLeft: 'auto' }}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetDashboard;
