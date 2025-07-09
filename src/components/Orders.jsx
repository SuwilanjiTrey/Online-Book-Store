import React from 'react';
import { ShoppingBag, Clock, Check, Calendar } from 'lucide-react';
import './Styles/orders.css';

export default function Orders() {
  const [orders, setOrders] = React.useState([]);
  
  React.useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem('orders')) || [];
    setOrders(storedOrders);
  }, []);

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

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
                    <span>{formatDate(order.date)}</span>
                  </div>
                </div>
                <div className="order-status">
                  <span className="status-badge completed">
                    <Check size={14} />
                    Completed
                  </span>
                </div>
              </div>
              
              <div className="order-items">
                {order.items.map(item => (
                  <div className="order-item" key={item.id}>
                    <img src={item.coverImg} alt={item.title} className="order-item-cover" />
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
                  <span>K {order.total.toFixed(2)}</span>
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