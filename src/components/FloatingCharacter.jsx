import React, { useState } from 'react';
import { X } from 'lucide-react';
import Posuckho from '../assets/icons/posuckho.png';

const FloatingCharacter = ({ onClick }) => {
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <>
      {/* 툴팁 */}
      {showTooltip && (
        <div
          style={{
            position: 'fixed',
            bottom: '160px',
            right: '140px',
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
            <strong>💬 포돈이</strong>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#718096' }}>
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
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: '160px',
          height: '130px',
          borderRadius: '50%',
          border: 'none',
          cursor: 'pointer',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s',
          overflow: 'visible',
          animation: 'float 3s ease-in-out infinite',
          background: 'transparent',
        }}
      >
        <div style={{ position: 'relative' }}>
          <img
            src={Posuckho}
            alt="AI 캐릭터"
            style={{
              width: '95px',
              height: '130px',
              objectFit: 'cover',
            }}
          />
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
