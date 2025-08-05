import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { Book, ShoppingCart, ShoppingBag, Home, Search, User, LogIn } from 'lucide-react';
import BookList from './components/Booklist';
import Cart from './components/Cart';
import Orders from './components/Orders';
import Navigation from './components/navigation';
import AdminPanel from './components/Admin';
import './App.css';

export default function App() {
  const [currentUser, setCurrentUser] = React.useState(null);
  const [showLoginModal, setShowLoginModal] = React.useState(false);
  const [cartItems, setCartItems] = React.useState([]);
  const [books, setBooks] = React.useState([]);
  const [loginForm, setLoginForm] = React.useState({
    email: '',
    password: '',
    name: '',
    isRegistering: false
  });

  // Initialize data on app load
  React.useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = () => {
    // Check if user is logged in
    const savedUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (savedUser) {
      setCurrentUser(savedUser);
    }

    // Load cart items
    const savedCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
    setCartItems(savedCart);

    // Initialize sample data if not exists
    initializeSampleData();
  };

  const initializeSampleData = () => {
    // Initialize books if not exists
    const existingBooks = localStorage.getItem('books');
    if (!existingBooks) {
      const sampleBooks = [
        {
          id: 1,
          title: "Clean Code",
          author: "Robert C. Martin",
          price: 45.99,
          rating: 4.8,
          category: "Programming",
          description: "A handbook of agile software craftsmanship",
          coverImg: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=400&fit=crop"
        },
        {
          id: 2,
          title: "The Great Gatsby",
          author: "F. Scott Fitzgerald",
          price: 12.99,
          rating: 4.2,
          category: "Fiction",
          description: "A classic American novel",
          coverImg: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop"
        },
        {
          id: 3,
          title: "Atomic Habits",
          author: "James Clear",
          price: 18.99,
          rating: 4.7,
          category: "Business",
          description: "An easy and proven way to build good habits",
          coverImg: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=300&h=400&fit=crop"
        }
      ];
      localStorage.setItem('books', JSON.stringify(sampleBooks));
      setBooks(sampleBooks);
    } else {
      setBooks(JSON.parse(existingBooks));
    }

    // Initialize users if not exists
    const existingUsers = localStorage.getItem('users');
    if (!existingUsers) {
      const sampleUsers = [
        {
          id: 1,
          name: "Admin User",
          email: "admin@bookworm.com",
          password: "admin123",
          role: "admin"
        },
        {
          id: 2,
          name: "John Doe",
          email: "john@example.com",
          password: "user123",
          role: "user"
        }
      ];
      localStorage.setItem('users', JSON.stringify(sampleUsers));
    }

    // Initialize orders if not exists
    const existingOrders = localStorage.getItem('orders');
    if (!existingOrders) {
      localStorage.setItem('orders', JSON.stringify([]));
    }
  };

  // Login Component with Navigation Hook
  const LoginHandler = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const user = users.find(u => 
        u.email === loginForm.email && u.password === loginForm.password
      );

      if (user) {
        setCurrentUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        setShowLoginModal(false);
        setLoginForm({ email: '', password: '', name: '', isRegistering: false });
        
        // Redirect admin users to admin panel
        if (user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        alert('Invalid email or password');
      }
    };

    const handleRegister = () => {
      if (!loginForm.name || !loginForm.email || !loginForm.password) {
        alert('Please fill in all fields');
        return;
      }

      const users = JSON.parse(localStorage.getItem('users')) || [];
      
      // Check if user already exists
      if (users.find(u => u.email === loginForm.email)) {
        alert('User with this email already exists');
        return;
      }

      const newUser = {
        id: Math.max(...users.map(u => u.id), 0) + 1,
        name: loginForm.name,
        email: loginForm.email,
        password: loginForm.password,
        role: "user" // Default role
      };

      const updatedUsers = [...users, newUser];
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      setCurrentUser(newUser);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      setShowLoginModal(false);
      setLoginForm({ email: '', password: '', name: '', isRegistering: false });
      navigate('/');
    };

    return { handleLogin, handleRegister };
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateBooks = (updatedBooks) => {
    setBooks(updatedBooks);
  };

  const addToCart = (book) => {
    const existingItem = cartItems.find(item => item.id === book.id);
    let updatedCart;

    if (existingItem) {
      updatedCart = cartItems.map(item =>
        item.id === book.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [...cartItems, { ...book, quantity: 1 }];
    }

    setCartItems(updatedCart);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
  };

  const LoginModal = () => {
    const { handleLogin, handleRegister } = LoginHandler();

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}>
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '16px',
          width: '90%',
          maxWidth: '400px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '30px'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: '12px',
              borderRadius: '12px',
              display: 'inline-block',
              marginBottom: '16px'
            }}>
              <Book size={32} color="white" />
            </div>
            <h2 style={{ margin: 0, color: '#333' }}>
              {loginForm.isRegistering ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p style={{ margin: '8px 0 0', color: '#666' }}>
              {loginForm.isRegistering 
                ? 'Join Bookworm today' 
                : 'Sign in to your account'
              }
            </p>
          </div>

          <div style={{ display: 'grid', gap: '20px' }}>
            {loginForm.isRegistering && (
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={loginForm.name}
                  onChange={(e) => setLoginForm({...loginForm, name: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e1e5e9',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Email Address
              </label>
              <input
                type="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e1e5e9',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Password
              </label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e1e5e9',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                placeholder="Enter your password"
              />
            </div>

            <div style={{ marginTop: '10px' }}>
              <button
                onClick={loginForm.isRegistering ? handleRegister : handleLogin}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  marginBottom: '16px'
                }}
              >
                {loginForm.isRegistering ? 'Create Account' : 'Sign In'}
              </button>

              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <span style={{ color: '#666', fontSize: '14px' }}>
                  {loginForm.isRegistering ? 'Already have an account?' : "Don't have an account?"}
                </span>
                <button
                  onClick={() => setLoginForm({
                    ...loginForm, 
                    isRegistering: !loginForm.isRegistering
                  })}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#667eea',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    marginLeft: '5px'
                  }}
                >
                  {loginForm.isRegistering ? 'Sign In' : 'Sign Up'}
                </button>
              </div>

              {/* Demo Credentials */}
              <div style={{
                background: '#f8f9fa',
                padding: '15px',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#666'
              }}>
                <strong>Demo Credentials:</strong><br/>
                Admin: admin@bookworm.com / admin123<br/>
                User: john@example.com / user123
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowLoginModal(false)}
            style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#666'
            }}
          >
            ×
          </button>
        </div>
      </div>
    );
  };

  const GuestHeader = () => (
    <header style={{
      background: 'white',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      padding: '0 20px',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '8px',
            borderRadius: '8px'
          }}>
            <Book size={24} color="white" />
          </div>
          <h1 style={{
            margin: 0,
            fontSize: '24px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Bookworm
          </h1>
        </div>

        <div style={{
          flex: 1,
          maxWidth: '400px',
          margin: '0 40px',
          position: 'relative'
        }}>
          <input
            type="text"
            placeholder="Search books, authors..."
            style={{
              width: '100%',
              padding: '12px 45px 12px 16px',
              border: '2px solid #e1e5e9',
              borderRadius: '25px',
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
          <Search 
            size={18} 
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#666'
            }}
          />
        </div>

        <button
          onClick={() => setShowLoginModal(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          <LogIn size={18} />
          Sign In
        </button>
      </div>
    </header>
  );

  // Admin Route Protection
  const AdminRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/" replace />;
    }
    
    if (currentUser.role !== 'admin') {
      return <Navigate to="/" replace />;
    }
    
    return children;
  };

  // Auto-redirect for admin users
  const HomeRoute = () => {
    if (currentUser && currentUser.role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    
    return (
      <BookList 
        books={books}
        onAddToCart={addToCart}
        currentUser={currentUser}
      />
    );
  };

  return (
    <Router>
      <div className="app-container">
        {/* Conditional Header Rendering */}
        {currentUser ? (
          <Navigation 
            currentUser={currentUser}
            onLogout={handleLogout}
            cartItemCount={cartItems.length}
          />
        ) : (
          <GuestHeader />
        )}

        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomeRoute />} />
            <Route 
              path="/cart" 
              element={
                currentUser && currentUser.role !== 'admin' ? (
                  <Cart 
                    cartItems={cartItems}
                    setCartItems={setCartItems}
                    currentUser={currentUser}
                  />
                ) : (
                  <Navigate to="/" replace />
                )
              } 
            />
            <Route 
              path="/orders" 
              element={
                currentUser && currentUser.role !== 'admin' ? (
                  <Orders currentUser={currentUser} />
                ) : (
                  <Navigate to="/" replace />
                )
              } 
            />
            <Route 
              path="/admin" 
              element={
                <AdminRoute>
                  <AdminPanel 
                    currentUser={currentUser}
                    onUpdateBooks={updateBooks}
                  />
                </AdminRoute>
              } 
            />
          </Routes>
        </main>

        {/* Footer - Only show for non-admin users */}
        {(!currentUser || currentUser.role !== 'admin') && (
          <footer className="footer">
            <div className="footer-content">
              <div className="footer-section">
                <h3>Bookworm</h3>
                <p>Your favorite online bookstore</p>
              </div>
              <div className="footer-section">
                <h3>Contact</h3>
                <p>support@bookworm.com</p>
                <p>+260 9xxxxxxxx</p>
              </div>
              <div className="footer-section">
                <h3>Quick Links</h3>
                <ul>
                  <li><a href="/about">About Us</a></li>
                  <li><a href="/terms">Terms & Conditions</a></li>
                  <li><a href="/privacy">Privacy Policy</a></li>
                </ul>
              </div>
            </div>
            <div className="copyright">
              <p>&copy; {new Date().getFullYear()} Bookworm. All rights reserved.</p>
            </div>
          </footer>
        )}

        {/* Login Modal */}
        {showLoginModal && <LoginModal />}
      </div>
    </Router>
  );
}
