// src/components/Booklist.jsx
import React from 'react';
import { Book, ShoppingBag, Star, Plus } from 'lucide-react';
import { bookService, cartService } from '../config/firebaseServices';
import './Styles/booklist.css';

export default function BookList({ currentUser }) {
  const [books, setBooks] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [addingToCart, setAddingToCart] = React.useState({});
  const categories = ['All', 'Programming', 'Fiction', 'Business', 'Science', 'design'];

  // Load books on component mount
  React.useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const booksData = await bookService.getAllBooks();
      setBooks(booksData);
    } catch (error) {
      console.error('Error loading books:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (book) => {
    if (!currentUser) {
      alert('Please sign in to add books to your cart');
      return;
    }

    if (currentUser.role === 'admin') {
      alert('Admin users cannot add items to cart');
      return;
    }

    setAddingToCart(prev => ({ ...prev, [book.id]: true }));

    try {
      await cartService.addToCart(currentUser.id, book.id, 1);
      alert('Book added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add book to cart. Please try again.');
    } finally {
      setAddingToCart(prev => ({ ...prev, [book.id]: false }));
    }
  };

  const filteredBooks = selectedCategory === 'All' 
    ? books 
    : books.filter(book => book.category === selectedCategory);

  if (loading) {
    return (
      <div className="book-list-container">
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
          <p style={{ color: '#666', fontSize: '16px' }}>Loading books...</p>
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
    <div className="book-list-container">
      <div className="book-list-header">
        <h2><Book size={20} /> Available Books</h2>
        <div className="category-filter">
          {categories.map(category => (
            <button 
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      <div className="books-grid">
        {filteredBooks.map((book) => (
          <div className="book-card" key={book.id}>
            <div className="book-cover">
              <img 
                src={book.coverImg || `https://via.placeholder.com/300x400?text=${encodeURIComponent(book.title)}`} 
                alt={book.title}
                onError={(e) => {
                  e.target.src = `https://via.placeholder.com/300x400?text=${encodeURIComponent(book.title)}`;
                }}
              />
              {book.stock <= 5 && book.stock > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: '#ff6b6b',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '10px',
                  fontWeight: '600'
                }}>
                  Only {book.stock} left
                </div>
              )}
              {book.stock === 0 && (
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: '#666',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '10px',
                  fontWeight: '600'
                }}>
                  Out of Stock
                </div>
              )}
            </div>
            <div className="book-info">
              <h3>{book.title}</h3>
              <p className="book-author">by {book.author}</p>
              <div className="book-rating">
                <Star size={16} fill="#FFD700" color="#FFD700" />
                <span>{book.rating || '4.0'}</span>
              </div>
              <p className="book-description">{book.description}</p>
              <div className="book-category">
                <span style={{
                  background: '#e3f2fd',
                  color: '#1976d2',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  {book.category}
                </span>
              </div>
              <div className="book-footer">
                <span className="book-price">K{book.price?.toFixed(2)}</span>
                {currentUser && currentUser.role !== 'admin' ? (
                  <button 
                    className="add-to-cart-btn"
                    onClick={() => addToCart(book)}
                    disabled={addingToCart[book.id] || book.stock === 0}
                    style={{
                      background: book.stock === 0 ? '#ccc' : '',
                      cursor: book.stock === 0 ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    {addingToCart[book.id] ? (
                      <>
                        <div style={{
                          width: '12px',
                          height: '12px',
                          border: '2px solid transparent',
                          borderTop: '2px solid white',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite'
                        }} />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus size={16} />
                        {book.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                      </>
                    )}
                  </button>
                ) : (
                  <button 
                    className="add-to-cart-btn"
                    disabled
                    style={{
                      background: '#ccc',
                      cursor: 'not-allowed'
                    }}
                  >
                    {!currentUser ? 'Sign in to Buy' : 'Admin View'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {filteredBooks.length === 0 && !loading && (
          <div style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: '40px',
            color: '#666'
          }}>
            <Book size={48} style={{ opacity: 0.5, marginBottom: '16px' }} />
            <p className="no-books-message">No books found in this category.</p>
          </div>
        )}
      </div>
      
      <div className="book-list-footer">
        <p>Showing {filteredBooks.length} books</p>
        {books.length > 0 && (
          <button
            onClick={loadBooks}
            style={{
              background: 'none',
              border: '1px solid #667eea',
              color: '#667eea',
              padding: '8px 16px',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Book size={14} />
            Refresh Books
          </button>
        )}
      </div>
    </div>
  );
}