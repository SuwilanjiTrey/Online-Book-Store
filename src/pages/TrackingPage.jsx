// src/pages/TrackingPage.jsx
import React, { useState } from 'react';
import LeafletTracker from '../components/Maps/LeafletTracker'; // Changed from BookTracker to LeafletTracker
import { ArrowLeft, Search, Package } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export default function TrackingPage({ currentUser }) {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [trackingId, setTrackingId] = useState(orderId || '');
  const [showTracker, setShowTracker] = useState(!!orderId);
  const [error, setError] = useState('');

  // Removed Google Maps API loading since we're using Leaflet

  const handleTrackOrder = (e) => {
    e.preventDefault();
    setError('');
    
    if (!trackingId.trim()) {
      setError('Please enter an order ID');
      return;
    }

    setShowTracker(true);
  };

  const handleBack = () => {
    if (showTracker) {
      setShowTracker(false);
      setTrackingId('');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="tracking-page">
      {!showTracker ? (
        <div className="tracking-search-container">
          <div className="tracking-search-header">
            <button onClick={handleBack} className="back-button">
              <ArrowLeft size={20} />
              Back to Home
            </button>
          </div>

          <div className="tracking-search-content">
            <div className="search-icon-container">
              <Package size={64} className="search-icon" />
            </div>
            
            <h1>Track Your Book Order</h1>
            <p>Enter your order ID to see real-time tracking information</p>

            <form onSubmit={handleTrackOrder} className="tracking-form">
              <div className="search-input-container">
                <input
                  type="text"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  placeholder="Enter Order ID (e.g., ORD123456)"
                  className="tracking-input"
                />
                <button type="submit" className="track-button">
                  <Search size={20} />
                  Track Order
                </button>
              </div>
              
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}
            </form>

            <div className="demo-section">
              <h3>Demo Order IDs</h3>
              <div className="demo-buttons">
                <button 
                  onClick={() => { setTrackingId('ORD123456'); setShowTracker(true); }}
                  className="demo-button"
                >
                  Try: ORD123456
                </button>
                <button 
                  onClick={() => { setTrackingId('ORD789012'); setShowTracker(true); }}
                  className="demo-button"
                >
                  Try: ORD789012
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="tracking-display">
          <div className="tracking-nav">
            <button onClick={handleBack} className="back-button">
              <ArrowLeft size={20} />
              Search Another Order
            </button>
          </div>
          
          <LeafletTracker 
            orderId={trackingId} 
            currentUser={currentUser}
          />
        </div>
      )}

      <style jsx>{`
        .tracking-page {
          min-height: 100vh;
          background: #f8f9fa;
        }

        .tracking-search-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .tracking-search-header {
          margin-bottom: 40px;
        }

        .back-button {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          color: #4a52b3;
          cursor: pointer;
          font-size: 16px;
          padding: 8px 12px;
          border-radius: 6px;
          transition: background-color 0.2s;
        }

        .back-button:hover {
          background: rgba(74, 82, 179, 0.1);
        }

        .tracking-search-content {
          text-align: center;
          background: white;
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .search-icon-container {
          margin-bottom: 20px;
        }

        .search-icon {
          color: #4a52b3;
          opacity: 0.7;
        }

        .tracking-search-content h1 {
          margin: 0 0 10px 0;
          color: #333;
          font-size: 28px;
        }

        .tracking-search-content p {
          margin: 0 0 30px 0;
          color: #666;
          font-size: 16px;
        }

        .tracking-form {
          margin-bottom: 40px;
        }

        .search-input-container {
          display: flex;
          gap: 12px;
          margin-bottom: 15px;
        }

        .tracking-input {
          flex: 1;
          padding: 14px 16px;
          border: 2px solid #e1e5e9;
          border-radius: 8px;
          font-size: 16px;
          outline: none;
          transition: border-color 0.3s;
        }

        .tracking-input:focus {
          border-color: #4a52b3;
        }

        .track-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 14px 24px;
          background: #4a52b3;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .track-button:hover {
          background: #3a4189;
        }

        .error-message {
          color: #e74c3c;
          font-size: 14px;
          padding: 8px;
          background: #fdf2f2;
          border-radius: 6px;
          border: 1px solid #f5c6cb;
        }

        .demo-section {
          padding-top: 30px;
          border-top: 1px solid #e1e5e9;
        }

        .demo-section h3 {
          margin: 0 0 15px 0;
          color: #666;
          font-size: 16px;
          font-weight: 500;
        }

        .demo-buttons {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .demo-button {
          padding: 8px 16px;
          background: #f8f9fa;
          color: #4a52b3;
          border: 1px solid #e1e5e9;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.3s;
        }

        .demo-button:hover {
          background: #4a52b3;
          color: white;
        }

        .tracking-display {
          width: 100%;
        }

        .tracking-nav {
          padding: 20px;
          background: white;
          border-bottom: 1px solid #e1e5e9;
        }

        @media (max-width: 768px) {
          .tracking-search-container {
            padding: 20px 15px;
          }

          .tracking-search-content {
            padding: 30px 20px;
          }

          .search-input-container {
            flex-direction: column;
          }

          .demo-buttons {
            flex-direction: column;
            align-items: center;
          }

          .demo-button {
            width: 200px;
          }
        }
      `}</style>
    </div>
  );
}
