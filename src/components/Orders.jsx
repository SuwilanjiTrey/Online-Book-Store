import React from 'react';
import { ShoppingBag, Clock, Check, Calendar } from 'lucide-react';
import { orderService } from '../config/firebaseServices';
import './Styles/orders.css';

export default function Orders({ currentUser }) {
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  
  React.useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        const userOrders = await orderService.getUserOrders(currentUser.id);
        setOrders(userOrders);
        setError(null);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load your orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [currentUser]);
  
  const formatDate = (timestamp) => { 
    if (!timestamp) return 'Unknown date';
    
    // Handle Firestore timestamp format
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString(undefined, options);
  };
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return (
          <span className="status-badge completed">
            <Check size={14} />
            Completed
          </span>
        );
      case 'pending':
        return (
          <span className="status-badge pending">
            <Clock size={14} />
            Pending
          </span>
        );
      case 'processing':
        return (
          <span className="status-badge processing">
            <Clock size={14} />
            Processing
          </span>
        );
      case 'shipped':
        return (
          <span className="status-badge shipped">
            <Check size={14} />
            Shipped
          </span>
        );
      default:
        return (
          <span className="status-badge">
            {status}
          </span>
        );
    }
  };
  
  if (loading) {
    return (
      <div className="orders-container">
        <div className="orders-header">
          <h2><ShoppingBag size={20} /> Your Orders</h2>
        </div>
        <div className="loading-orders">
          <div className="spinner"></div>
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="orders-container">
        <div className="orders-header">
          <h2><ShoppingBag size={20} /> Your Orders</h2>
        </div>
        <div className="error-orders">
          <p>{error}</p>
          <button 
            className="retry-btn"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="orders-container">
      <div className="orders-header">
        <h2><ShoppingBag size={20} /> Your Orders</h2>
      </div>
      
      {orders.length === 0 ? (
        <div className="empty-orders">
          <ShoppingBag size={64} />
          <h3>No orders yet</h3>
          <p>You haven't placed any orders yet.</p>
          <a href="/" className="browse-books-btn">
            Browse Books
          </a>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div className="order-card" key={order.id}>
              <div className="order-header">
                <div className="order-info">
                  <div className="order-id">
                    <span>Order #{order.id.toString().slice(-6)}</span>
                  </div>
                  <div className="order-date">
                    <Calendar size={14} />
                    <span>{formatDate(order.createdAt)}</span>
                  </div>
                </div>
                <div className="order-status">
                  {getStatusBadge(order.status)}
                </div>
              </div>
              
              <div className="order-items">
                {order.items.map(item => (
                  <div className="order-item" key={item.id}>
                    <img 
                      src={item.coverImg || 'https://via.placeholder.com/80x120?text=No+Image'} 
                      alt={item.title} 
                      className="order-item-cover" 
                    />
                    <div className="order-item-details">
                      <h4>{item.title}</h4>
                      <p className="order-item-author">by {item.author}</p>
                      <div className="order-item-price-qty">
                        <span className="order-item-price">K {item.price.toFixed(2)}</span>
                        <span className="order-item-qty">Qty: {item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="order-summary">
                <div className="order-total">
                  <span>Total</span>
                  <span>K {order.totalAmount.toFixed(2)}</span>
                </div>
                <div className="order-delivery">
                  <Clock size={14} />
                  <span>Estimated delivery: 2-4 business days</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}