import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, X, Loader } from 'lucide-react';

const API_BASE = 'http://localhost:5002/api';

const RegulationQnA = ({ onClose }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '안녕하세요😊\n우리 회사의 자금규정 및 법인카드에 대해 무엇이든 물어보세요!\n(ex. 전표 작성, 예산 편성, 세무 처리)'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    
    // 사용자 메시지 추가
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    
    setLoading(true);
    
    try {
      const response = await axios.post(`${API_BASE}/qna`, {
        question: userMessage
      });

      // AI 응답 추가
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: response.data.answer }
      ]);
    } catch (error) {
      console.error('QnA 오류:', error);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: '죄송합니다. 응답 생성 중 오류가 발생했습니다. 다시 시도해주세요.'
        }
      ]);
    }
    
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickQuestions = [
    '전표 작성 시 필수 첨부 서류는?',
    '외화 거래 시 환율 적용 기준은?',
    '예산 증액 요청 프로세스는?',
    '법인카드 사용 규정은?',
    '세금계산서 발행 기한은?'
  ];

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'white',
      borderLeft: '2.5px solid #e2e8f0',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      transition: 'width 0.3s ease',
    }}>
      {/* 헤더 */}
      <div style={{
        padding: '1.5rem',
        borderBottom: '2px solid #e2e8f0',
        background: 'linear-gradient(135deg, #f4d85bff 0%, #fff8b9ff 100%)',
        color: '#4a4a4aff'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.25rem' }}>🐻‍❄️ 규정관리봇</h3>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', opacity: 0.9 }}>
              Claude AI 상담
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#8a825333',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
          >
            <X size={20} color="white" />
          </button>
        </div>
      </div>

      {/* 메시지 영역 */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1.5rem',
        background: '#fefdeaff'
      }}>
        {messages.map((message, index) => (
          <div 
            key={index}
            style={{
              marginBottom: '1rem',
              display: 'flex',
              justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start'
            }}
          >
            <div 
              style={{ 
                maxWidth: '80%', 
                padding: '1rem', 
                borderRadius: '12px', 
                background: message.role === 'user' ? '#f4d85bff' : 'white',
                  color: message.role === 'user' ? '#000' : '#2d3748',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
                  whiteSpace: 'pre-wrap', 
                  lineHeight: '1.6' 
              }} 
            >
              {message.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#dbb405ff' }}>
            <Loader size={20} className="spinner" />
            <span>AI가 생각하는 중...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 빠른 질문 */}
      {messages.length === 1 && (
        <div style={{
          margin: '0rem 0.5rem',
          padding: '0.5rem 1rem 0.5rem 1rem',
          background: '#fdf7c4ff',
          borderTopLeftRadius: '15px',
          borderTopRightRadius: '15px'
        }}>
          <div style={{ fontSize: '0.9rem', color: '#000000', marginBottom: '0.5rem' }}>
            🏃‍♂️‍➡️ 빠른 질문
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => {
                  setInput(question);
                }}
                style={{
                  padding: '0.55rem',
                  background: 'white',
                  border: 'px solid #e2e8f0',
                  borderRadius: '8px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  transition: 'all 0.3s',
                  color: '#4c4c4cff'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#f4d85bff';
                  e.currentTarget.style.background = '#fffdecff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.background = 'white';
                }}
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 입력 영역 */}
      <div style={{
        padding: '1rem 1.5rem',
        borderTop: '2px solid #e2e8f0',
        background: 'white'
      }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="규정이나 회계 처리에 대해 질문하세요..."
            rows={3}
            style={{
              flex: 1,
              padding: '0.75rem',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '0.9rem',
              resize: 'none',
              fontFamily: 'inherit'
            }}
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            style={{
              padding: '0.75rem 1.5rem',
              background: loading || !input.trim() ? '#cbd5e0' : '#f4d85bff',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s'
            }}
          >
            <Send size={20} />
          </button>
        </div>
        <div style={{ fontSize: '0.75rem', color: '#a0aec0', marginTop: '0.5rem' }}>
          Shift + Enter로 줄바꿈, Enter로 전송
        </div>
      </div>
    </div>
  );
};

export default RegulationQnA;
