import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

const FloatingCharacter = ({ onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <>
      {/* 툴팁 */}
      {showTooltip && (
        <div
          style={{
            position: 'fixed',
            bottom: '100px',
            right: '90px',
            background: 'white',
            padding: '1rem',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 999,
            maxWidth: '250px',
            animation: 'bounce 2s infinite'
          }}
        >
          <button
            onClick={() => setShowTooltip(false)}
            style={{
              position: 'absolute',
              top: '0.5rem',
              right: '0.5rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#a0aec0'
            }}
          >
            <X size={16} />
          </button>
          <div style={{ fontSize: '0.875rem', color: '#4a5568', marginBottom: '0.5rem' }}>
            <strong>💬 AI 규정 상담</strong>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#718096' }}>
            클릭하면 회계 규정 및 예산 관련 질문을 할 수 있어요!
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: '-8px',
              right: '30px',
              width: 0,
              height: 0,
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderTop: '8px solid white'
            }}
          />
        </div>
      )}

      {/* 플로팅 캐릭터 버튼 */}
      <button
        onClick={() => {
          setShowTooltip(false);
          onClick();
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          background: isHovered 
            ? 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
          boxShadow: isHovered 
            ? '0 8px 24px rgba(102, 126, 234, 0.4)'
            : '0 4px 12px rgba(102, 126, 234, 0.3)',
          cursor: 'pointer',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s',
          transform: isHovered ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0deg)',
          animation: 'float 3s ease-in-out infinite'
        }}
      >
        <div style={{ position: 'relative' }}>
          <MessageCircle size={32} color="white" />
          {/* 알림 배지 */}
          <div
            style={{
              position: 'absolute',
              top: '-5px',
              right: '-5px',
              width: '12px',
              height: '12px',
              background: '#f56565',
              borderRadius: '50%',
              border: '2px solid white',
              animation: 'pulse 2s infinite'
            }}
          />
        </div>
      </button>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.3);
            opacity: 0.7;
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
      `}</style>
    </>
  );
};

export default FloatingCharacter;
