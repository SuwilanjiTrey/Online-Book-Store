import React from 'react';
import { Book, ShoppingBag, Star } from 'lucide-react';
import './Styles/booklist.css';

export default function BookList() {
  const [books, setBooks] = React.useState([
    { 
      id: 1, 
      title: 'Clean Code', 
      author: 'Robert C. Martin', 
      price: 29.99,
      rating: 4.8,
      coverImg: 'https://images-na.ssl-images-amazon.com/images/I/41xShlnTZTL._SX376_BO1,204,203,200_.jpg',
      description: "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees.",
      category: 'Programming'
    },
    { 
      id: 2, 
      title: 'The Pragmatic Programmer', 
      author: 'Andrew Hunt & David Thomas', 
      price: 34.99,
      rating: 4.7,
      coverImg: 'https://images-na.ssl-images-amazon.com/images/I/51cUVaBWZzL._SX380_BO1,204,203,200_.jpg',
      description: 'Straight from the programming trenches, The Pragmatic Programmer cuts through the increasing specialization and technicalities of modern software development.',
      category: 'Programming'
    },
    { 
      id: 3, 
      title: 'Design Patterns', 
      author: 'Erich Gamma et al.', 
      price: 39.99,
      rating: 4.6,
      coverImg: 'https://images-na.ssl-images-amazon.com/images/I/51szD9HC9pL._SX395_BO1,204,203,200_.jpg',
      description: 'Capturing a wealth of experience about the design of object-oriented software, this book presents 23 patterns that solve various design problems.',
      category: 'Programming'
    },
    { 
      id: 4, 
      title: 'Eloquent JavaScript', 
      author: 'Marijn Haverbeke', 
      price: 27.99,
      rating: 4.5,
      coverImg: 'https://eloquentjavascript.net/img/cover.jpg',
      description: 'This book provides an in-depth introduction to JavaScript, covering the language itself and its use in web browsers.',
      category: 'Programming'
    },
  ]);
  
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const categories = ['All', 'Programming', 'Fiction', 'Business', 'Science'];

  const addToCart = (book) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if the book is already in the cart
    const existingBook = cart.find(item => item.id === book.id);
    
    if (existingBook) {
      // If book exists, show an alert
      alert('This book is already in your cart!');
    } else {
      // Add book to cart with quantity 1
      cart.push({...book, quantity: 1});
      localStorage.setItem('cart', JSON.stringify(cart));
      alert('Book added to cart!');
    }
  };
  
  const filteredBooks = selectedCategory === 'All' 
    ? books 
    : books.filter(book => book.category === selectedCategory);

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
              <img src="/api/placeholder/200/300" alt={book.title} />
            </div>
            <div className="book-info">
              <h3>{book.title}</h3>
              <p className="book-author">by {book.author}</p>
              <div className="book-rating">
                <Star size={16} fill="#FFD700" color="#FFD700" />
                <span>{book.rating}</span>
              </div>
              <p className="book-description">{book.description}</p>
              <div className="book-footer">
                <span className="book-price">${book.price.toFixed(2)}</span>
                <button 
                  className="add-to-cart-btn"
                  onClick={() => addToCart(book)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredBooks.length === 0 && (
          <p className="no-books-message">No books found in this category.</p>
        )}
      </div>
      
      <div className="book-list-footer">
        <p>Showing {filteredBooks.length} books</p>
      </div>
    </div>
  );
}