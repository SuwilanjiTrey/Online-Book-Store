import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Book, ShoppingCart, ShoppingBag, Home, Search } from 'lucide-react';
import BookList from './components/Booklist';
import Cart from './components/Cart';
import Orders from './components/Orders';
import './App.css';

export default function App() {
  const [searchQuery, setSearchQuery] = React.useState('');
  
  return (
    <Router>
      <div className="app-container">
        <header className="header">
          <div className="logo">
            <Book className="logo-icon" size={24} />
            <h1>Bookworm</h1>
          </div>
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Search books..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="search-btn">
              <Search size={18} />
            </button>
          </div>
          <nav className="nav-links">
            <a href="/" className="nav-link">
              <Home size={18} />
              <span>Home</span>
            </a>
            <a href="/cart" className="nav-link">
              <ShoppingCart size={18} />
              <span>Cart</span>
            </a>
            <a href="/orders" className="nav-link">
              <ShoppingBag size={18} />
              <span>Orders</span>
            </a>
          </nav>
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<BookList />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<Orders />} />
          </Routes>
        </main>

        <footer className="footer">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Bookworm</h3>
              <p>Your favorite online bookstore</p>
            </div>
            <div className="footer-section">
              <h3>Contact</h3>
              <p>support@bookworm.com</p>
              <p>+1 (555) 123-4567</p>
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
      </div>
    </Router>
  );
}