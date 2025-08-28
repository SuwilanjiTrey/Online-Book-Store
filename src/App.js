// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { Book, ShoppingCart, ShoppingBag, Home, Search, User, LogIn } from 'lucide-react';
import BookList from './components/Booklist';
import Cart from './components/Cart';
import Orders from './components/Orders';
import Navigation from './components/navigation';
import AdminPanel from './components/Admin';
import { authService } from './components/AnA/AuthServices';
import { bookService } from './config/firebaseServices';
import TestUI from './test/testUi';
import './App.css';

// Move LoginModal outside as a separate component to prevent re-renders
const LoginModal = ({ 
  showLoginModal, 
  setShowLoginModal, 
  loginForm, 
  setLoginForm, 
  setCurrentUser 
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleLogin = async () => {
    if (!loginForm.email || !loginForm.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const user = await authService.login(loginForm.email, loginForm.password);
      setCurrentUser(user);
      setShowLoginModal(false);
      setLoginForm({ email: '', password: '', name: '', isRegistering: false });
      
      // Redirect admin users to admin panel
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!loginForm.name || !loginForm.email || !loginForm.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const user = await authService.register(
        loginForm.email, 
        loginForm.password, 
        loginForm.name, 
        'customer'
      );
      
      setCurrentUser(user);
      setShowLoginModal(false);
      setLoginForm({ email: '', password: '', name: '', isRegistering: false });
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
      if (error.code === 'auth/email-already-in-use') {
        setError('User with this email already exists');
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!showLoginModal) return null;

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
        boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
        position: 'relative'
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
                disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
            />
          </div>

          {error && (
            <div style={{
              background: '#fee',
              color: '#c33',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <div style={{ marginTop: '10px' }}>
            <button
              onClick={loginForm.isRegistering ? handleRegister : handleLogin}
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                background: loading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginBottom: '16px'
              }}
            >
              {loading ? 'Please wait...' : (loginForm.isRegistering ? 'Create Account' : 'Sign In')}
            </button>

            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <span style={{ color: '#666', fontSize: '14px' }}>
                {loginForm.isRegistering ? 'Already have an account?' : "Don't have an account?"}
              </span>
              <button
                onClick={() => {
                  setLoginForm({
                    ...loginForm, 
                    isRegistering: !loginForm.isRegistering
                  });
                  setError('');
                }}
                disabled={loading}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#667eea',
                  cursor: loading ? 'not-allowed' : 'pointer',
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
          disabled={loading}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: loading ? 'not-allowed' : 'pointer',
            color: '#666'
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default function App() {
  const [currentUser, setCurrentUser] = React.useState(null);
  const [showLoginModal, setShowLoginModal] = React.useState(false);
  const [cartItems, setCartItems] = React.useState([]);
  const [books, setBooks] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [loginForm, setLoginForm] = React.useState({
    email: '',
    password: '',
    name: '',
    isRegistering: false
  });

  // Initialize app and set up auth listener
  React.useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Set up auth state listener
      const unsubscribe = authService.onAuthStateChanged((user) => {
        setCurrentUser(user);
        setLoading(false);
      });

      // Initialize sample data if needed (for demo)
      await initializeSampleData();

      return () => unsubscribe();
    } catch (error) {
      console.error('Error initializing app:', error);
      setLoading(false);
    }
  };

  const initializeSampleData = async () => {
    try {
      // Get existing books
      const existingBooks = await bookService.getAllBooks();
      
      // If no books exist, create sample books
      if (existingBooks.length === 0) {
        const sampleBooks = [
          {
            title: "Clean Code",
            author: "Robert C. Martin",
            price: 45.99,
            stock: 10,
            category: "Programming",
            description: "A handbook of agile software craftsmanship"
          },
          {
            title: "The Great Gatsby",
            author: "F. Scott Fitzgerald",
            price: 12.99,
            stock: 15,
            category: "Fiction",
            description: "A classic American novel"
          },
          {
            title: "Atomic Habits",
            author: "James Clear",
            price: 18.99,
            stock: 20,
            category: "Business",
            description: "An easy and proven way to build good habits"
          }
        ];

        // Create sample books in Firestore
        for (const book of sampleBooks) {
          await bookService.createBook(book);
        }
      }

      setBooks(existingBooks.length > 0 ? existingBooks : []);
    } catch (error) {
      console.error('Error initializing sample data:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setCurrentUser(null);
      setCartItems([]);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateBooks = (updatedBooks) => {
    setBooks(updatedBooks);
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
        currentUser={currentUser}
      />
    );
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#f8f9fa'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '20px',
            borderRadius: '50%',
            animation: 'pulse 2s infinite'
          }}>
            <Book size={40} color="white" />
          </div>
          <p style={{ color: '#666', fontSize: '16px' }}>Loading Bookworm...</p>
          <style>{`
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.5; }
            }
          `}</style>
        </div>
      </div>
    );
  }

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
                path="/test" 
                element={
                  <TestUI />
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
        <LoginModal 
          showLoginModal={showLoginModal}
          setShowLoginModal={setShowLoginModal}
          loginForm={loginForm}
          setLoginForm={setLoginForm}
          setCurrentUser={setCurrentUser}
        />
      </div>
    </Router>
  );
}