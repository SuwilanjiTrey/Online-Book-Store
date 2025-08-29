// src/components/PaymentModal.jsx
import React, { useState } from 'react';
import { CreditCard, Smartphone, X, Loader } from 'lucide-react';
import './Styles/PaymentModal.css';

const PaymentModal = ({ show, onClose, totalAmount, onPaymentSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [form, setForm] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  if (!show) {
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const validateForm = () => {
    setMessage({ text: '', type: '' });
    if (paymentMethod === 'creditCard') {
      if (!form.cardNumber || !form.cardExpiry || !form.cardCvv) {
        setMessage({ text: 'Please fill in all credit card details.', type: 'error' });
        return false;
      }
    } else if (paymentMethod === 'mobileMoney') {
      if (!form.network || !form.phoneNumber) {
        setMessage({ text: 'Please select a network and enter your phone number.', type: 'error' });
        return false;
      }
    }
    return true;
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsProcessing(true);
    setMessage({ text: 'Processing payment...', type: 'info' });

    try {
      // Simulate a 1-second payment processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulate a successful payment
      setMessage({ text: 'Payment successful!', type: 'success' });
      
      // Call the success handler passed from the parent component
      onPaymentSuccess();
      
    } catch (error) {
      setMessage({ text: 'Payment failed. Please try again.', type: 'error' });
      console.error('Payment simulation failed:', error);
    } finally {
      setIsProcessing(false);
      // Automatically close the modal after a short delay on success
      if (message.type === 'success') {
          setTimeout(onClose, 1500);
      }
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose} disabled={isProcessing}>
          <X size={20} />
        </button>
        <h3 className="modal-title">Choose Payment Method</h3>
        
        {message.text && (
          <div className={`payment-message ${message.type}`}>
            {isProcessing ? <Loader size={18} className="spinner" /> : null}
            {message.text}
          </div>
        )}
        
        <div className="payment-options">
          <label className={`payment-option ${paymentMethod === 'creditCard' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="paymentMethod"
              value="creditCard"
              checked={paymentMethod === 'creditCard'}
              onChange={() => setPaymentMethod('creditCard')}
            />
            <CreditCard size={20} /> Credit Card
          </label>
          <label className={`payment-option ${paymentMethod === 'mobileMoney' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="paymentMethod"
              value="mobileMoney"
              checked={paymentMethod === 'mobileMoney'}
              onChange={() => setPaymentMethod('mobileMoney')}
            />
            <Smartphone size={20} /> Mobile Money
          </label>
        </div>

        <form onSubmit={handlePayment} className="payment-form">
          {paymentMethod === 'creditCard' && (
            <div className="form-group">
              <input type="text" name="cardNumber" placeholder="Card Number" value={form.cardNumber || ''} onChange={handleInputChange} disabled={isProcessing} />
              <input type="text" name="cardExpiry" placeholder="MM/YY" value={form.cardExpiry || ''} onChange={handleInputChange} disabled={isProcessing} />
              <input type="text" name="cardCvv" placeholder="CVV" value={form.cardCvv || ''} onChange={handleInputChange} disabled={isProcessing} />
            </div>
          )}

          {paymentMethod === 'mobileMoney' && (
            <div className="form-group">
              <select name="network" value={form.network || ''} onChange={handleInputChange} disabled={isProcessing}>
                <option value="">Select Network</option>
                <option value="Airtel">Airtel</option>
                <option value="Zamtel">Zamtel</option>
                <option value="MTN">MTN</option>
              </select>
              <input type="text" name="phoneNumber" placeholder="Phone Number" value={form.phoneNumber || ''} onChange={handleInputChange} disabled={isProcessing} />
            </div>
          )}

          <div className="payment-total">
            <span>Total:</span>
            <span>K {totalAmount.toFixed(2)}</span>
          </div>

          <button type="submit" className="pay-btn" disabled={isProcessing}>
            {isProcessing ? (
              <><Loader size={18} className="spinner" /> Processing...</>
            ) : (
              `Pay Now`
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;