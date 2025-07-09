import React from 'react';
import { ShoppingCart, Trash2, ArrowLeft, ShoppingBag } from 'lucide-react';
import './Styles/cart.css';

export default function Cart() {
  const [cart, setCart] = React.useState([]);
  const [isCheckingOut, setIsCheckingOut] = React.useState(false);
  
  React.useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
  }, []);

  const updateQuantity = (bookId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cart.map(item => 
      item.id === bookId ? { ...item, quantity: newQuantity } : item
    );
    
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeFromCart = (bookId) => {
    const updatedCart = cart.filter(item => item.id !== bookId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const completeOrder = () => {
    setIsCheckingOut(true);
    // In a real application, this would handle payment processing
    setTimeout(() => {
      // Save to orders
      const orders = JSON.parse(localStorage.getItem('orders')) || [];
      const newOrder = {
        id: Date.now(),
        items: [...cart],
        total: calculateTotal(),
        date: new Date().toISOString()
      };
      
      orders.push(newOrder);
      localStorage.setItem('orders', JSON.stringify(orders));
      
      // Clear cart
      localStorage.removeItem('cart');
      setCart([]);
      setIsCheckingOut(false);
      
      // Show success message
      alert('Order placed successfully!');
      window.location.href = '/orders';
    }, 1500);
  };

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2><ShoppingCart size={20} /> Your Shopping Cart</h2>
        <a href="/" className="back-link">
          <ArrowLeft size={16} /> Continue Shopping
        </a>
      </div>
      
      {cart.length === 0 ? (
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
            {cart.map(item => (
              <div className="cart-item" key={item.id}>
                <div className="cart-item-info">
                  <img src={item.coverImg} alt={item.title} className="cart-item-cover" />
                  <div className="cart-item-details">
                    <h3>{item.title}</h3>
                    <p className="cart-item-author">by {item.author}</p>
                    <p className="cart-item-price">K {item.price.toFixed(2)}</p>
                  </div>
                </div>
                
                <div className="cart-item-actions">
                  <div className="quantity-controls">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <button 
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>K {calculateTotal().toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>K {calculateTotal().toFixed(2)}</span>
            </div>
            
            <button 
              className="checkout-btn"
              onClick={completeOrder}
              disabled={isCheckingOut}
            >
              {isCheckingOut ? 'Processing...' : 'Complete Order'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}