import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, Loader } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const API_BASE = 'http://localhost:5002/api';

const RegulationQnAFull = () => {
  const [messages, setMessages] = useState([
    {
        role: 'assistant',
        content: '안녕하세요! 포돈이입니다 🐻‍❄️  \n우리 회사의 자금규정 및 법인카드에 대해 무엇이든 물어보세요!\n(ex. 전표 작성, 예산 편성, 세무 처리)'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const quickQuestions = [
    '전표 작성 시 필수 첨부 서류는?',
    '외화 거래 시 환율 적용 기준은?',
    '예산 증액 요청 프로세스는?',
    '법인카드 사용 규정은?',
    '세금계산서 발행 기한은?'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/qna`, { question: input });
      const answer = res.data.answer || '답변을 불러올 수 없습니다.';
      setMessages(prev => [...prev, { role: 'assistant', content: answer }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: '서버와 통신 중 오류가 발생했습니다. 담당자에게 문의해주세요.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{
      maxWidth: '1400px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 150px)', // 화면 전체 높이
      backgroundColor: '#f7fafc',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      overflow: 'hidden'
    }}>
      
      {/* 상단 헤더 */}
      <div
        className="card" 
        style={{
          background: 'linear-gradient(135deg, #f4d85bff 0%, #fff8b9ff 100%)',
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          padding: '1rem 1.7rem',
          marginBottom: '0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.3rem' }}>
          <h2 style={{ margin: 0, color: '#000' }}>🐻‍❄️ 포돈이</h2>
        </div>
        <div style={{ marginLeft: '0.5rem'}}>
          <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.8 }}>AI 회계 규정 상담 도우미</p>
        </div>
      </div>

      {/* 메시지 영역 */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
      }}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <div
              style={{
                maxWidth: '70%',
                padding: '0.8rem 1.25rem',
                borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                background: msg.role === 'user' ? '#f4d85bff' : 'white',
                color: '#2d3748',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                lineHeight: 1.6,
                fontSize: '0.95rem'
              }}
            >
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          </div>
        ))}

        {loading && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#dbb405ff'
          }}>
            <Loader size={20} className="spinner" />
            <span>AI가 생각하는 중...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 빠른 질문 */}
      <div style={{
        background: '#edf2f7',
        padding: '1rem 2rem',
        borderTopLeftRadius: '20px',
        borderTopRightRadius: '20px',
        margin: '0 0.5rem',
      }}>
        <div style={{ fontSize: '0.875rem', color: '#616f83ff', marginBottom: '0.5rem' }}>
          🏃‍♂️‍➡️ 빠른 질문
        </div>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          {quickQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => setInput(q)}
              style={{
                background: 'white',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                padding: '0.6rem 1rem',
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#667eea';
                e.currentTarget.style.background = '#f0f4ff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.background = 'white';
              }}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* 입력 영역 */}
      <div style={{
        padding: '1rem 2rem',
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
              background: loading || !input.trim()
                ? '#cbd5e0'
                : '#f4d85bff',
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

export default RegulationQnAFull;