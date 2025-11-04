import React, { useState } from 'react';
import { Upload, Check, X, AlertTriangle } from 'lucide-react';

const VoucherEntry = () => {
  const [formData, setFormData] = useState({
    voucher_id: `V2025-${Math.floor(Math.random() * 9000) + 1000}`,
    creator: '',
    transaction_date: '',
    payment_due_date: '',
    amount: '',
    vendor: '',
    currency: 'KRW',
    exchange_rate: '',
    exchange_rate_date: '',
    description: '',
    system_account_number: '',
    tax_invoice_account: '',
    invoice_amount: '',
    tax_invoice_amount: '',
    invoice_vendor: '',
    tax_invoice_vendor: ''
  });

  const [validations, setValidations] = useState({
    accountMatch: null,
    invoiceMatch: null,
    exchangeRateValid: null,
    periodMatch: null
  });

  const [receipts, setReceipts] = useState([]);
  const [taxInvoice, setTaxInvoice] = useState(null);
  const [invoice, setInvoice] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // 실시간 검증
    if (name === 'tax_invoice_account' || name === 'system_account_number') {
      validateAccountNumber();
    }
    if (name === 'invoice_amount' || name === 'tax_invoice_amount') {
      validateInvoiceAmount();
    }
    if (name === 'exchange_rate_date' || name === 'transaction_date') {
      validateExchangeRate();
    }
    if (name === 'description' || name === 'transaction_date') {
      validatePeriod();
    }
  };

  const validateAccountNumber = () => {
    setTimeout(() => {
      if (formData.system_account_number && formData.tax_invoice_account) {
        setValidations(prev => ({
          ...prev,
          accountMatch: formData.system_account_number === formData.tax_invoice_account
        }));
      }
    }, 100);
  };

  const validateInvoiceAmount = () => {
    setTimeout(() => {
      if (formData.invoice_amount && formData.tax_invoice_amount) {
        const diff = Math.abs(Number(formData.invoice_amount) - Number(formData.tax_invoice_amount));
        setValidations(prev => ({
          ...prev,
          invoiceMatch: diff <= 100
        }));
      }
    }, 100);
  };

  const validateExchangeRate = () => {
    setTimeout(() => {
      if (formData.exchange_rate_date && formData.transaction_date) {
        setValidations(prev => ({
          ...prev,
          exchangeRateValid: formData.exchange_rate_date === formData.transaction_date
        }));
      }
    }, 100);
  };

  const validatePeriod = () => {
    setTimeout(() => {
      if (formData.description && formData.transaction_date) {
        const monthMatch = formData.description.match(/(\d+)월/);
        if (monthMatch && formData.transaction_date) {
          const descMonth = parseInt(monthMatch[1]);
          const transMonth = new Date(formData.transaction_date).getMonth() + 1;
          setValidations(prev => ({
            ...prev,
            periodMatch: descMonth === transMonth
          }));
        }
      }
    }, 100);
  };

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // 파일 업로드 시뮬레이션
    const reader = new FileReader();
    reader.onload = (event) => {
      if (type === 'receipt') {
        setReceipts(prev => [...prev, {
          name: file.name,
          data: event.target.result,
          extractedData: {
            amount: Math.floor(Math.random() * 1000000) + 100000,
            vendor: '거래처명',
            date: new Date().toISOString().split('T')[0]
          }
        }]);
      } else if (type === 'tax_invoice') {
        const extracted = {
          account: '123-456-789',
          amount: Math.floor(Math.random() * 5000000) + 1000000,
          vendor: '세금계산서 거래처',
          date: new Date().toISOString().split('T')[0]
        };
        
        setTaxInvoice({
          name: file.name,
          data: event.target.result,
          extractedData: extracted
        });

        // 자동 입력
        setFormData(prev => ({
          ...prev,
          tax_invoice_account: extracted.account,
          tax_invoice_amount: extracted.amount,
          tax_invoice_vendor: extracted.vendor,
          transaction_date: extracted.date
        }));
      } else if (type === 'invoice') {
        const extracted = {
          amount: Math.floor(Math.random() * 5000000) + 1000000,
          vendor: 'Invoice 거래처',
          date: new Date().toISOString().split('T')[0]
        };
        
        setInvoice({
          name: file.name,
          data: event.target.result,
          extractedData: extracted
        });

        // 자동 입력
        setFormData(prev => ({
          ...prev,
          invoice_amount: extracted.amount,
          invoice_vendor: extracted.vendor
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const autoFillFromReceipt = (receipt) => {
    setFormData(prev => ({
      ...prev,
      amount: receipt.extractedData.amount,
      vendor: receipt.extractedData.vendor,
      transaction_date: receipt.extractedData.date
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 모든 검증 통과 확인
    const hasErrors = Object.values(validations).some(v => v === false);
    
    if (hasErrors) {
      alert('⚠️ 검증 오류가 있습니다. 모든 항목을 확인해주세요.');
      return;
    }

    alert('✅ 전표가 성공적으로 저장되었습니다!');
    console.log('저장된 전표:', formData);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div className="card">
        <h2>📝 전표 작성</h2>
        <p style={{ color: '#718096', marginTop: '0.5rem' }}>
          AI 자동 입력 및 실시간 검증
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* 전표 입력 폼 */}
        <div className="card">
          <h3>전표 정보 입력</h3>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>전표번호</label>
              <input
                type="text"
                name="voucher_id"
                value={formData.voucher_id}
                readOnly
                style={{ background: '#f7fafc' }}
              />
            </div>

            <div className="form-group">
              <label>작성자 *</label>
              <input
                type="text"
                name="creator"
                value={formData.creator}
                onChange={handleInputChange}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>거래일자 *</label>
                <input
                  type="date"
                  name="transaction_date"
                  value={formData.transaction_date}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>지급예정일 *</label>
                <input
                  type="date"
                  name="payment_due_date"
                  value={formData.payment_due_date}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>거래처 *</label>
              <input
                type="text"
                name="vendor"
                value={formData.vendor}
                onChange={handleInputChange}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>금액 *</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>통화</label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                >
                  <option value="KRW">KRW (원)</option>
                  <option value="USD">USD (달러)</option>
                  <option value="EUR">EUR (유로)</option>
                  <option value="JPY">JPY (엔)</option>
                </select>
              </div>
            </div>

            {formData.currency !== 'KRW' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>환율 *</label>
                  <input
                    type="number"
                    step="0.01"
                    name="exchange_rate"
                    value={formData.exchange_rate}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    환율 적용일 *
                    {validations.exchangeRateValid === false && (
                      <span style={{ color: '#f56565', marginLeft: '0.5rem', fontSize: '0.875rem' }}>
                        ⚠️ 거래일과 일치해야 합니다
                      </span>
                    )}
                  </label>
                  <input
                    type="date"
                    name="exchange_rate_date"
                    value={formData.exchange_rate_date}
                    onChange={handleInputChange}
                    required
                    style={validations.exchangeRateValid === false ? { borderColor: '#f56565' } : {}}
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label>
                적요 *
                {validations.periodMatch === false && (
                  <span style={{ color: '#f56565', marginLeft: '0.5rem', fontSize: '0.875rem' }}>
                    ⚠️ 기간이 거래일자와 불일치합니다
                  </span>
                )}
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={2}
                placeholder="예: 11월 시설장비 유지보수"
                required
                style={validations.periodMatch === false ? { borderColor: '#f56565' } : {}}
              />
            </div>

            <div className="form-group">
              <label>시스템 등록 계좌번호 *</label>
              <input
                type="text"
                name="system_account_number"
                value={formData.system_account_number}
                onChange={handleInputChange}
                placeholder="예: 123-456-789"
                required
              />
            </div>

            <div className="form-group">
              <label>
                세금계산서 계좌번호 *
                {validations.accountMatch === false && (
                  <span style={{ color: '#f56565', marginLeft: '0.5rem', fontSize: '0.875rem' }}>
                    ⚠️ 시스템 계좌번호와 불일치!
                  </span>
                )}
                {validations.accountMatch === true && (
                  <span style={{ color: '#48bb78', marginLeft: '0.5rem', fontSize: '0.875rem' }}>
                    ✓ 계좌번호 일치
                  </span>
                )}
              </label>
              <input
                type="text"
                name="tax_invoice_account"
                value={formData.tax_invoice_account}
                onChange={handleInputChange}
                placeholder="세금계산서에 기재된 계좌번호"
                required
                style={validations.accountMatch === false ? { borderColor: '#f56565' } : {}}
              />
            </div>

            {/* Invoice & 세금계산서 검증 */}
            {(formData.invoice_amount || formData.tax_invoice_amount) && (
              <div className="alert alert-info" style={{ marginBottom: '1rem' }}>
                <h4 style={{ marginBottom: '0.5rem' }}>📄 증빙 서류 검증</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: '#4a5568' }}>Invoice 금액</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                      {formData.invoice_amount ? Number(formData.invoice_amount).toLocaleString() : '-'}원
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: '#4a5568' }}>세금계산서 금액</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                      {formData.tax_invoice_amount ? Number(formData.tax_invoice_amount).toLocaleString() : '-'}원
                    </div>
                  </div>
                </div>
                {validations.invoiceMatch === false && (
                  <div style={{ marginTop: '0.5rem', color: '#f56565' }}>
                    ⚠️ Invoice와 세금계산서 금액이 일치하지 않습니다!
                  </div>
                )}
                {validations.invoiceMatch === true && (
                  <div style={{ marginTop: '0.5rem', color: '#48bb78' }}>
                    ✓ 증빙 서류 금액이 일치합니다
                  </div>
                )}
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              전표 저장
            </button>
          </form>
        </div>

        {/* 증빙 업로드 패널 */}
        <div>
          <div className="card">
            <h3>📎 증빙 서류 업로드</h3>
            
            {/* 영수증 */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="btn btn-secondary" style={{ width: '100%', cursor: 'pointer' }}>
                <Upload size={16} /> 영수증 업로드
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileUpload(e, 'receipt')}
                  style={{ display: 'none' }}
                />
              </label>
              
              {receipts.map((receipt, index) => (
                <div
                  key={index}
                  style={{
                    marginTop: '0.5rem',
                    padding: '0.75rem',
                    background: '#f7fafc',
                    borderRadius: '8px',
                    fontSize: '0.875rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{receipt.name}</span>
                    <button
                      className="btn btn-success"
                      style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}
                      onClick={() => autoFillFromReceipt(receipt)}
                    >
                      자동입력
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 세금계산서 */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="btn btn-secondary" style={{ width: '100%', cursor: 'pointer' }}>
                <Upload size={16} /> 세금계산서 업로드
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileUpload(e, 'tax_invoice')}
                  style={{ display: 'none' }}
                />
              </label>
              
              {taxInvoice && (
                <div className="alert alert-success" style={{ marginTop: '0.5rem', padding: '0.75rem' }}>
                  <Check size={16} /> {taxInvoice.name}
                  <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
                    ✓ 자동 입력 완료
                  </div>
                </div>
              )}
            </div>

            {/* Invoice */}
            <div>
              <label className="btn btn-secondary" style={{ width: '100%', cursor: 'pointer' }}>
                <Upload size={16} /> Invoice 업로드
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileUpload(e, 'invoice')}
                  style={{ display: 'none' }}
                />
              </label>
              
              {invoice && (
                <div className="alert alert-success" style={{ marginTop: '0.5rem', padding: '0.75rem' }}>
                  <Check size={16} /> {invoice.name}
                  <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
                    ✓ 자동 입력 완료
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 검증 상태 요약 */}
          <div className="card">
            <h3>✓ 실시간 검증</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {validations.accountMatch === true && <Check size={20} color="#48bb78" />}
                {validations.accountMatch === false && <X size={20} color="#f56565" />}
                {validations.accountMatch === null && <div style={{ width: 20 }} />}
                <span style={{ color: validations.accountMatch === false ? '#f56565' : '#4a5568' }}>
                  계좌번호 일치 확인
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {validations.invoiceMatch === true && <Check size={20} color="#48bb78" />}
                {validations.invoiceMatch === false && <X size={20} color="#f56565" />}
                {validations.invoiceMatch === null && <div style={{ width: 20 }} />}
                <span style={{ color: validations.invoiceMatch === false ? '#f56565' : '#4a5568' }}>
                  Invoice 금액 일치
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {validations.exchangeRateValid === true && <Check size={20} color="#48bb78" />}
                {validations.exchangeRateValid === false && <X size={20} color="#f56565" />}
                {validations.exchangeRateValid === null && <div style={{ width: 20 }} />}
                <span style={{ color: validations.exchangeRateValid === false ? '#f56565' : '#4a5568' }}>
                  환율 적용일 일치
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {validations.periodMatch === true && <Check size={20} color="#48bb78" />}
                {validations.periodMatch === false && <X size={20} color="#f56565" />}
                {validations.periodMatch === null && <div style={{ width: 20 }} />}
                <span style={{ color: validations.periodMatch === false ? '#f56565' : '#4a5568' }}>
                  기간 귀속 일치
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoucherEntry;
