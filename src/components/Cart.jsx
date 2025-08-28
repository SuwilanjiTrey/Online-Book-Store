// src/components/Cart.jsx
import React from 'react';
import { ShoppingCart, Trash2, ArrowLeft, ShoppingBag } from 'lucide-react';
import { cartService, orderService } from '../config/firebaseServices';
import './Styles/cart.css';

export default function Cart({ currentUser }) {
  const [cartItems, setCartItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [isCheckingOut, setIsCheckingOut] = React.useState(false);
  const [updating, setUpdating] = React.useState({});

  React.useEffect(() => {
    if (currentUser) {
      loadCart();
      
      // Set up real-time listener for cart changes
      const unsubscribe = cartService.onCartSnapshot(currentUser.id, (items) => {
        setCartItems(items);
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [currentUser]);

  const loadCart = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const items = await cartService.getCartItems(currentUser.id);
      setCartItems(items);
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setUpdating(prev => ({ ...prev, [cartItemId]: true }));
    
    try {
      await cartService.updateCartItem(currentUser.id, cartItemId, newQuantity);
      // The real-time listener will update the UI
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Failed to update quantity. Please try again.');
    } finally {
      setUpdating(prev => ({ ...prev, [cartItemId]: false }));
    }
  };

  const removeFromCart = async (cartItemId) => {
    if (!window.confirm('Remove this item from your cart?')) return;
    
    try {
      await cartService.removeFromCart(currentUser.id, cartItemId);
      // The real-time listener will update the UI
    } catch (error) {
      console.error('Error removing from cart:', error);
      alert('Failed to remove item. Please try again.');
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.book.price * item.quantity), 0);
  };

  const completeOrder = async () => {
    if (cartItems.length === 0) return;
    
    setIsCheckingOut(true);
    
    try {
      // Prepare order items
      const orderItems = cartItems.map(item => ({
        bookId: item.bookId,
        title: item.book.title,
        author: item.book.author,
        price: item.book.price,
        quantity: item.quantity
      }));

      // Create order
      const orderId = await orderService.createOrder(
        currentUser.id, 
        orderItems, 
        calculateTotal()
      );

      // Clear cart after successful order
      await cartService.clearCart(currentUser.id);
      
      alert('Order placed successfully!');
      window.location.href = '/orders';
    } catch (error) {
      console.error('Error completing order:', error);
      alert('Failed to complete order. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="cart-container">
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <p style={{ color: '#666', fontSize: '16px' }}>Loading your cart...</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2><ShoppingCart size={20} /> Your Shopping Cart</h2>
        <a href="/" className="back-link">
          <ArrowLeft size={16} /> Continue Shopping
        </a>
      </div>
      
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <ShoppingBag size={64} />
          <h3>Your cart is empty</h3>
          <p>Looks like you haven't added any books to your cart yet.</p>
          <a href="/" className="continue-shopping-btn">
            Browse Books
          </a>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map(item => (
              <div className="cart-item" key={item.id}>
                <div className="cart-item-info">
                  <img 
                    src={item.book.coverImg || `https://via.placeholder.com/80x120?text=${encodeURIComponent(item.book.title)}`} 
                    alt={item.book.title} 
                    className="cart-item-cover" 
                    onError={(e) => {
                      e.target.src = `https://via.placeholder.com/80x120?text=${encodeURIComponent(item.book.title)}`;
                    }}
                  />
                  <div className="cart-item-details">
                    <h3>{item.book.title}</h3>
                    <p className="cart-item-author">by {item.book.author}</p>
                    <p className="cart-item-price">K {item.book.price?.toFixed(2)}</p>
                    <p className="cart-item-category" style={{
                      fontSize: '12px',
                      color: '#666',
                      margin: '4px 0'
                    }}>
                      Category: {item.book.category}
                    </p>
                  </div>
                </div>
                
                <div className="cart-item-actions">
                  <div className="quantity-controls">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1 || updating[item.id]}
                      style={{
                        opacity: item.quantity <= 1 ? 0.5 : 1,
                        cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer'
                      }}
                    >
                      -
                    </button>
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: '40px'
                    }}>
                      {updating[item.id] ? (
                        <div style={{
                          width: '12px',
                          height: '12px',
                          border: '2px solid #ddd',
                          borderTop: '2px solid #667eea',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite'
                        }} />
                      ) : (
                        item.quantity
                      )}
                    </span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={updating[item.id]}
                    >
                      +
                    </button>
                  </div>
                  <button 
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id)}
                    title="Remove from cart"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <div className="summary-row">
              <span>Subtotal ({cartItems.length} items)</span>
              <span>K {calculateTotal().toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span style={{ color: '#28a745', fontWeight: '600' }}>Free</span>
            </div>
            <div className="summary-row">
              <span>Tax</span>
              <span>K 0.00</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>K {calculateTotal().toFixed(2)}</span>
            </div>
            
            <button 
              className="checkout-btn"
              onClick={completeOrder}
              disabled={isCheckingOut || cartItems.length === 0}
              style={{
                background: isCheckingOut ? '#ccc' : '',
                cursor: isCheckingOut ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {isCheckingOut ? (
                <>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid transparent',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  Processing Order...
                </>
              ) : (
                <>
                  <ShoppingBag size={16} />
                  Complete Order (K {calculateTotal().toFixed(2)})
                </>
              )}
            </button>
            
            <div style={{
              textAlign: 'center',
              marginTop: '15px',
              fontSize: '12px',
              color: '#666'
            }}>
              <p>🔒 Secure checkout • Free delivery • 30-day returns</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}