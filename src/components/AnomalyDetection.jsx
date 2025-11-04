import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertTriangle, Mail, Info, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

const API_BASE = 'http://localhost:5005/api';

const AnomalyDetection = () => {
  const [anomalyResults, setAnomalyResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedVouchers, setExpandedVouchers] = useState(new Set());
  const [filterSeverity, setFilterSeverity] = useState('all');

  useEffect(() => {
    detectAnomalies();
  }, []);

  const detectAnomalies = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/vouchers/anomalies`);
      setAnomalyResults(response.data);
    } catch (error) {
      console.error('이상탐지 실패:', error);
    }
    setLoading(false);
  };

  const sendAlert = async (voucher, anomalies) => {
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/vouchers/send-alert`, {
        voucher,
        anomalies
      });
      alert('✅ 이메일 알림이 발송되었습니다!');
    } catch (error) {
      console.error('알림 발송 실패:', error);
      alert('❌ 알림 발송 중 오류가 발생했습니다.');
    }
    setLoading(false);
  };

  const toggleExpand = (voucherId) => {
    const newExpanded = new Set(expandedVouchers);
    if (newExpanded.has(voucherId)) {
      newExpanded.delete(voucherId);
    } else {
      newExpanded.add(voucherId);
    }
    setExpandedVouchers(newExpanded);
  };

  const getSeverityColor = (severity) => {
    const colors = {
      critical: '#f56565',
      high: '#f6ad55',
      medium: '#f6e05e',
      low: '#68d391'
    };
    return colors[severity] || '#cbd5e0';
  };

  const getSeverityBadge = (severity) => {
    const labels = {
      critical: '🚨 매우 위험',
      high: '⚠️ 높음',
      medium: '⚡ 보통',
      low: 'ℹ️ 낮음'
    };
    return labels[severity] || severity;
  };

  const filteredResults = filterSeverity === 'all' 
    ? anomalyResults 
    : anomalyResults.filter(r => r.max_severity === filterSeverity);

  if (loading && anomalyResults.length === 0) {
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
            <h2>🔍 전표 이상탐지</h2>
            <p style={{ color: '#718096', marginTop: '0.5rem' }}>
              AI 기반 8가지 이상 케이스 자동 감지
            </p>
          </div>
          <button className="btn btn-primary" onClick={detectAnomalies} disabled={loading}>
            <RefreshCw size={16} /> 재탐지
          </button>
        </div>

        {/* 통계 요약 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #f56565 0%, #fc8181 100%)',
            padding: '1.5rem',
            borderRadius: '12px',
            color: 'white'
          }}>
            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>이상 전표</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
              {anomalyResults.length}건
            </div>
          </div>
          
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '1.5rem',
            borderRadius: '12px',
            color: 'white'
          }}>
            <div style={{ fontSize: '0.875rem', opacity: '0.9' }}>매우 위험</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
              {anomalyResults.filter(r => r.max_severity === 'critical').length}건
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #f6ad55 0%, #ed8936 100%)',
            padding: '1.5rem',
            borderRadius: '12px',
            color: 'white'
          }}>
            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>높음</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
              {anomalyResults.filter(r => r.max_severity === 'high').length}건
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
            padding: '1.5rem',
            borderRadius: '12px',
            color: 'white'
          }}>
            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>보통 이하</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
              {anomalyResults.filter(r => ['medium', 'low'].includes(r.max_severity)).length}건
            </div>
          </div>
        </div>

        {/* 필터 */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ marginRight: '1rem', fontWeight: '600' }}>위험도 필터:</label>
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: '2px solid #e2e8f0'
            }}
          >
            <option value="all">전체</option>
            <option value="critical">🚨 매우 위험</option>
            <option value="high">⚠️ 높음</option>
            <option value="medium">⚡ 보통</option>
            <option value="low">ℹ️ 낮음</option>
          </select>
        </div>
      </div>

      {/* 이상 전표 목록 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredResults.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <AlertTriangle size={48} color="#48bb78" style={{ marginBottom: '1rem' }} />
            <h3 style={{ color: '#48bb78' }}>이상이 발견되지 않았습니다!</h3>
            <p style={{ color: '#718096', marginTop: '0.5rem' }}>
              모든 전표가 정상 상태입니다.
            </p>
          </div>
        )}

        {filteredResults.map((result, index) => {
          const isExpanded = expandedVouchers.has(result.voucher.voucher_id);
          const voucher = result.voucher;
          const anomalies = result.anomalies;

          return (
            <div
              key={index}
              className="card"
              style={{
                borderLeft: `6px solid ${getSeverityColor(result.max_severity)}`,
                background: result.max_severity === 'critical' ? '#fff5f5' : 'white'
              }}
            >
              {/* 헤더 */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
                onClick={() => toggleExpand(voucher.voucher_id)}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    <h3 style={{ margin: 0 }}>전표번호: {voucher.voucher_id}</h3>
                    <span
                      className="badge"
                      style={{
                        background: getSeverityColor(result.max_severity),
                        color: 'white'
                      }}
                    >
                      {getSeverityBadge(result.max_severity)}
                    </span>
                    <span className="badge badge-warning">
                      {anomalies.length}건 이상
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', fontSize: '0.875rem', color: '#4a5568' }}>
                    <div>📝 작성자: {voucher.creator}</div>
                    <div>📅 거래일: {voucher.transaction_date}</div>
                    <div>💰 금액: {voucher.amount?.toLocaleString()}원</div>
                    <div>🏢 거래처: {voucher.vendor}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    className="btn btn-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      sendAlert(voucher, anomalies);
                    }}
                    disabled={loading}
                  >
                    <Mail size={16} /> 알림 발송
                  </button>
                  {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </div>
              </div>

              {/* 상세 내용 */}
              {isExpanded && (
                <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '2px solid #e2e8f0' }}>
                  {/* 전표 상세 정보 */}
                  <div style={{
                    background: '#f7fafc',
                    padding: '1rem',
                    borderRadius: '8px',
                    marginBottom: '1rem'
                  }}>
                    <h4 style={{ marginBottom: '0.75rem' }}>📋 전표 상세</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', fontSize: '0.875rem' }}>
                      <div><strong>거래일자:</strong> {voucher.transaction_date}</div>
                      <div><strong>지급예정일:</strong> {voucher.payment_due_date}</div>
                      <div><strong>승인상태:</strong> {voucher.approval_status}</div>
                      <div><strong>회계생성:</strong> {voucher.accounting_created}</div>
                      <div><strong>검증상태:</strong> {voucher.validation_status}</div>
                      <div><strong>통화:</strong> {voucher.currency}</div>
                      {voucher.exchange_rate && (
                        <>
                          <div><strong>환율:</strong> {voucher.exchange_rate}</div>
                          <div><strong>환율적용일:</strong> {voucher.exchange_rate_date}</div>
                        </>
                      )}
                      <div style={{ gridColumn: '1 / -1' }}><strong>적요:</strong> {voucher.description}</div>
                    </div>
                  </div>

                  {/* 이상 케이스 목록 */}
                  <h4 style={{ marginBottom: '1rem' }}>⚠️ 감지된 이상사항</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {anomalies.map((anomaly, aIndex) => (
                      <div
                        key={aIndex}
                        style={{
                          padding: '1rem',
                          borderRadius: '8px',
                          border: `2px solid ${getSeverityColor(anomaly.severity)}`,
                          background: 'white'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          <AlertTriangle size={20} color={getSeverityColor(anomaly.severity)} />
                          <strong style={{ color: getSeverityColor(anomaly.severity) }}>
                            {getSeverityBadge(anomaly.severity)}
                          </strong>
                          <span style={{ marginLeft: 'auto', fontSize: '0.875rem', color: '#718096' }}>
                            {anomaly.type}
                          </span>
                        </div>

                        <div style={{ marginBottom: '0.5rem' }}>
                          <strong>문제:</strong> {anomaly.message}
                        </div>

                        <div style={{
                          background: '#f0f4ff',
                          padding: '0.75rem',
                          borderRadius: '6px',
                          borderLeft: '3px solid #667eea'
                        }}>
                          <strong style={{ color: '#667eea' }}>💡 조치사항:</strong>
                          <p style={{ margin: '0.25rem 0 0 0', color: '#4a5568' }}>
                            {anomaly.recommendation}
                          </p>
                        </div>

                        {/* 이상 케이스별 설명 */}
                        <details style={{ marginTop: '0.75rem' }}>
                          <summary style={{ cursor: 'pointer', color: '#667eea', fontSize: '0.875rem' }}>
                            <Info size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />
                            위험 기준 보기
                          </summary>
                          <div style={{
                            marginTop: '0.5rem',
                            padding: '0.75rem',
                            background: '#f7fafc',
                            borderRadius: '6px',
                            fontSize: '0.875rem',
                            color: '#4a5568'
                          }}>
                            {anomaly.type === 'payment_delay' && (
                              <div>
                                <strong>탐지 규칙:</strong> 거래일자와 지급예정일 사이가 40일 이상
                                <br />
                                <strong>원인:</strong> 결재 지연, 예산 부족, 행정 오류 등
                                <br />
                                <strong>위험도:</strong> 거래처 신뢰 저하, 재무 건전성 악화
                              </div>
                            )}
                            {anomaly.type === 'exchange_rate_error' && (
                              <div>
                                <strong>탐지 규칙:</strong> 전표 환율 vs 기준환율(세금계산서 거래일) 불일치
                                <br />
                                <strong>원인:</strong> 환율 적용일 오류, 팻핑거 오류
                                <br />
                                <strong>위험도:</strong> 회계 부정확성, 외화 차익/차손 오류
                              </div>
                            )}
                            {anomaly.type === 'period_mismatch' && (
                              <div>
                                <strong>탐지 규칙:</strong> 적요의 기간 vs 전표일자 월 불일치
                                <br />
                                <strong>원인:</strong> 전표 복사 시 적요 미수정, 담당자 오입력
                                <br />
                                <strong>위험도:</strong> 기간귀속 오류, 회계감사 지적사항
                              </div>
                            )}
                            {anomaly.type === 'account_mismatch' && (
                              <div>
                                <strong>탐지 규칙:</strong> 시스템 등록 계좌 ≠ 세금계산서 계좌
                                <br />
                                <strong>원인:</strong> 세금계산서 오류, 계좌 변경 미반영
                                <br />
                                <strong>위험도:</strong> 지급 오류, 자금 손실 가능
                              </div>
                            )}
                            {anomaly.type === 'invoice_mismatch' && (
                              <div>
                                <strong>탐지 규칙:</strong> Invoice 금액 ≠ 세금계산서 금액
                                <br />
                                <strong>원인:</strong> 증빙 서류 오류, 이중 청구
                                <br />
                                <strong>위험도:</strong> 과다/과소 지급, 회계 부정 의심
                              </div>
                            )}
                            {!['payment_delay', 'exchange_rate_error', 'period_mismatch', 'account_mismatch', 'invoice_mismatch'].includes(anomaly.type) && (
                              <div>이상 케이스에 대한 상세 정보를 확인하세요.</div>
                            )}
                          </div>
                        </details>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AnomalyDetection;
