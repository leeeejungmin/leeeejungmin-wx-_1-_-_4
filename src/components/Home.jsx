import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, FileText, AlertTriangle, MessageCircle } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      icon: <BarChart3 size={48} />,
      title: '예산 대시보드',
      description: '강화학습 기반 예산 관리 및 AI 분석',
      path: '/budget',
      color: '#667eea',
      features: ['실시간 예산 현황', 'AI 예산 분석', '강화학습 추천', '자동 보고서 생성']
    },
    {
      icon: <FileText size={48} />,
      title: '전표 작성',
      description: 'AI 자동 전표 작성 및 증빙 검증',
      path: '/voucher',
      color: '#48bb78',
      features: ['영수증 자동 인식', '세금계산서 검증', '계좌번호 확인', 'Invoice 매칭']
    },
    {
      icon: <AlertTriangle size={48} />,
      title: '이상탐지',
      description: '전표 이상 케이스 자동 감지',
      path: '/anomaly',
      color: '#f6ad55',
      features: ['지급 지연 감지', '환율 오류 탐지', '기간 불일치 체크', '자동 알림 발송']
    },
    {
      icon: <MessageCircle size={48} />,
      title: '규정 관리 QnA',
      description: 'Claude AI와 회계 규정 상담',
      path: '/qna',
      color: '#764ba2',
      features: ['실시간 AI 상담', '규정 해석', '회계 가이드', '24/7 지원']
    }
  ];

  return (
    <div className="home-container" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="hero-section" style={{
        background: 'white',
        borderRadius: '16px',
        padding: '3rem',
        marginBottom: '2rem',
        textAlign: 'center',
        boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ fontSize: '2.5rem', color: '#667eea', marginBottom: '1rem' }}>
          🤖 AI 기반 예산 관리 시스템
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '1.5rem' }}>
          강화학습과 Claude Sonnet 4로 스마트하게 관리하세요
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <div style={{
            padding: '1rem 2rem',
            background: '#f0f4ff',
            borderRadius: '12px',
            color: '#667eea',
            fontWeight: 'bold'
          }}>
            🎯 실시간 AI 분석
          </div>
          <div style={{
            padding: '1rem 2rem',
            background: '#f0fff4',
            borderRadius: '12px',
            color: '#48bb78',
            fontWeight: 'bold'
          }}>
            🤖 강화학습 적용
          </div>
          <div style={{
            padding: '1rem 2rem',
            background: '#fffaf0',
            borderRadius: '12px',
            color: '#f6ad55',
            fontWeight: 'bold'
          }}>
            ⚡ 자동 이상탐지
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem'
      }}>
        {menuItems.map((item, index) => (
          <div
            key={index}
            onClick={() => item.path !== '/qna' && navigate(item.path)}
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '2rem',
              cursor: item.path !== '/qna' ? 'pointer' : 'default',
              transition: 'all 0.3s',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              borderTop: `4px solid ${item.color}`,
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              if (item.path !== '/qna') {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
              }
            }}
            onMouseLeave={(e) => {
              if (item.path !== '/qna') {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
              }
            }}
          >
            <div style={{
              color: item.color,
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              {item.icon}
            </div>
            
            <h3 style={{
              fontSize: '1.5rem',
              color: '#2d3748',
              marginBottom: '0.5rem'
            }}>
              {item.title}
            </h3>
            
            <p style={{
              color: '#718096',
              marginBottom: '1rem',
              lineHeight: '1.6'
            }}>
              {item.description}
            </p>

            {item.path === '/qna' && (
              <div style={{
                padding: '0.75rem',
                background: '#f7fafc',
                borderRadius: '8px',
                marginBottom: '1rem'
              }}>
                <p style={{ fontSize: '0.875rem', color: '#4a5568', margin: 0 }}>
                  💡 오른쪽 하단의 캐릭터를 클릭하세요!
                </p>
              </div>
            )}

            <div style={{ marginTop: '1rem' }}>
              {item.features.map((feature, fIndex) => (
                <div
                  key={fIndex}
                  style={{
                    fontSize: '0.875rem',
                    color: '#4a5568',
                    marginBottom: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <span style={{ color: item.color }}>✓</span>
                  {feature}
                </div>
              ))}
            </div>

            {item.path !== '/qna' && (
              <button
                className="btn btn-primary"
                style={{
                  marginTop: '1.5rem',
                  width: '100%',
                  background: item.color
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(item.path);
                }}
              >
                시작하기 →
              </button>
            )}
          </div>
        ))}
      </div>

      <div style={{
        marginTop: '2rem',
        background: 'white',
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#667eea', marginBottom: '1rem' }}>
          🚀 시스템 특징
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginTop: '1.5rem'
        }}>
          <div>
            <h4 style={{ color: '#2d3748', marginBottom: '0.5rem' }}>
              🧠 강화학습 엔진
            </h4>
            <p style={{ color: '#718096', fontSize: '0.9rem' }}>
              Q-learning 알고리즘으로 예산 조정을 학습하고 최적의 의사결정을 지원합니다.
            </p>
          </div>
          <div>
            <h4 style={{ color: '#2d3748', marginBottom: '0.5rem' }}>
              🤖 Claude AI 통합
            </h4>
            <p style={{ color: '#718096', fontSize: '0.9rem' }}>
              최신 Claude Sonnet 4 모델로 전문적인 예산 분석과 조언을 제공합니다.
            </p>
          </div>
          <div>
            <h4 style={{ color: '#2d3748', marginBottom: '0.5rem' }}>
              ⚡ 실시간 이상탐지
            </h4>
            <p style={{ color: '#718096', fontSize: '0.9rem' }}>
              8가지 이상 케이스를 자동으로 감지하고 즉시 알림을 발송합니다.
            </p>
          </div>
          <div>
            <h4 style={{ color: '#2d3748', marginBottom: '0.5rem' }}>
              📊 자동 보고서
            </h4>
            <p style={{ color: '#718096', fontSize: '0.9rem' }}>
              AI 분석 결과를 포함한 상세 보고서를 자동으로 생성합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
