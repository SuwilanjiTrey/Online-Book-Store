import React from 'react';
import { 
  Book, 
  ShoppingCart, 
  ShoppingBag, 
  Home, 
  Search, 
  User, 
  LogOut,
  Settings,
  ChevronDown
} from 'lucide-react';

export default function Navigation({ currentUser, onLogout, cartItemCount }) {
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    onLogout();
  };

  return (
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
        {/* Logo */}
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

        {/* Search Bar */}
        <div style={{
          flex: 1,
          maxWidth: '400px',
          margin: '0 40px',
          position: 'relative'
        }}>
          <input
            type="text"
            placeholder="Search books, authors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 45px 12px 16px',
              border: '2px solid #e1e5e9',
              borderRadius: '25px',
              fontSize: '14px',
              outline: 'none',
              transition: 'border-color 0.3s',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
          />
          <button style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#666',
            padding: '4px'
          }}>
            <Search size={18} />
          </button>
        </div>

        {/* Navigation Links & User Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Navigation Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <a
              href="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 12px',
                borderRadius: '8px',
                textDecoration: 'none',
                color: '#666',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#f8f9fa';
                e.target.style.color = '#333';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = '#666';
              }}
            >
              <Home size={18} />
              <span>Home</span>
            </a>

            <a
              href="/cart"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 12px',
                borderRadius: '8px',
                textDecoration: 'none',
                color: '#666',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.3s',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#f8f9fa';
                e.target.style.color = '#333';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = '#666';
              }}
            >
              <ShoppingCart size={18} />
              <span>Cart</span>
              {cartItemCount > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '2px',
                  right: '6px',
                  background: '#ff4757',
                  color: 'white',
                  fontSize: '10px',
                  fontWeight: '600',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {cartItemCount}
                </div>
              )}
            </a>

            <a
              href="/orders"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 12px',
                borderRadius: '8px',
                textDecoration: 'none',
                color: '#666',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#f8f9fa';
                e.target.style.color = '#333';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = '#666';
              }}
            >
              <ShoppingBag size={18} />
              <span>Orders</span>
            </a>

            {/* Admin Link */}
            {currentUser?.role === 'admin' && (
              <a
                href="/admin"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: '#ff4757',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#fff5f5';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                }}
              >
                <Settings size={18} />
                <span>Admin</span>
              </a>
            )}
          </nav>

          {/* User Menu */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                border: '1px solid #e1e5e9',
                borderRadius: '20px',
                background: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                color: '#333',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.15)';
              }}
              onMouseLeave={(e) => {
                if (!showUserMenu) {
                  e.target.style.borderColor = '#e1e5e9';
                  e.target.style.boxShadow = 'none';
                }
              }}
            >
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                {currentUser?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <span>{currentUser?.name || 'User'}</span>
              <ChevronDown 
                size={16} 
                style={{
                  transform: showUserMenu ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s'
                }}
              />
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '8px',
                background: 'white',
                border: '1px solid #e1e5e9',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                minWidth: '200px',
                zIndex: 1000,
                overflow: 'hidden'
              }}>
                <div style={{
                  padding: '15px 20px',
                  borderBottom: '1px solid #f0f0f0',
                  background: '#f8f9fa'
                }}>
                  <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>
                    {currentUser?.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    {currentUser?.email}
                  </div>
                  <div style={{
                    display: 'inline-block',
                    marginTop: '6px',
                    padding: '2px 8px',
                    background: currentUser?.role === 'admin' ? '#ff4757' : '#4ecdc4',
                    color: 'white',
                    borderRadius: '10px',
                    fontSize: '10px',
                    fontWeight: '600',
                    textTransform: 'capitalize'
                  }}>
                    {currentUser?.role || 'User'}
                  </div>
                </div>

                <div style={{ padding: '8px 0' }}>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      // Navigate to profile (if implemented)
                    }}
                    style={{
                      width: '100%',
                      padding: '12px 20px',
                      border: 'none',
                      background: 'transparent',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '14px',
                      color: '#333',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      transition: 'background 0.3s'
                    }}
                    onMouseEnter={(e) => e.target.style.background = '#f8f9fa'}
                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                  >
                    <User size={16} />
                    Profile Settings
                  </button>

                  <div style={{
                    height: '1px',
                    background: '#f0f0f0',
                    margin: '8px 0'
                  }} />

                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      padding: '12px 20px',
                      border: 'none',
                      background: 'transparent',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '14px',
                      color: '#ff4757',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      transition: 'background 0.3s'
                    }}
                    onMouseEnter={(e) => e.target.style.background = '#fff5f5'}
                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              </div>
            )}

            {/* Backdrop to close menu */}
            {showUserMenu && (
              <div
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 999
                }}
                onClick={() => setShowUserMenu(false)}
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
