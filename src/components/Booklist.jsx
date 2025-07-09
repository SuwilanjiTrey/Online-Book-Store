import React from 'react';
import { Book, ShoppingBag, Star } from 'lucide-react';
import './Styles/booklist.css';

export default function BookList() {
  const [books, setBooks] = React.useState([
    { 
      id: 1, 
      title: 'Applying UML and Patterns: An Introduction to Object-Oriented Analysis and Design and Iterative Developmen', 
      author: 'Craig Larman', 
      price: 29.99,
      rating: 4.8,
      coverImg: '/craiglarman.jpg',
      description: "This book makes learning UML enjoyable and pragmatic by incrementally introducing it as an intuitive language for specifying the artifacts of object analysis and design. It is a well written introduction to UML and object methods by an expert practitioner.",
      category: 'design'
    },
    { 
      id: 2, 
      title: 'Software Engineering: A Practitioners Approach 9th Ed.', 
      author: 'Roger S Pressman', 
      price: 34.99,
      rating: 4.7,
      coverImg: '/pressman.jpg',
      description: 'Straight from the programming trenches, This book give the fundamental basics of software engineering and give the principles needed for good software design.',
      category: 'design'
    },
    { 
      id: 3, 
      title: 'Object-oriented Software Engineering', 
      author: 'Timothy Lethbridge | Goodreads', 
      price: 39.99,
      rating: 4.6,
      coverImg: '/timothylethbridge.jpeg',
      description: 'Capturing a wealth of experience about the design of object-oriented software, this book presents 23 patterns that solve various design problems.',
      category: 'Programming'
    },
    { 
      id: 4, 
      title: 'Introduction to Java Programming', 
      author: 'Y. Daniel Liang | Goodreads', 
      price: 27.99,
      rating: 4.5,
      coverImg: '/liang.jpg',
      description: 'This book provides an in-depth introduction to Java, covering the language itself and its use.',
      category: 'Programming'
    },
  ]);
  
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const categories = ['All', 'Programming', 'Fiction', 'Business', 'Science', 'design'];

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
              <img src={book.coverImg} alt={book.title} />
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
                <span className="book-price">K{book.price.toFixed(2)}</span>
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
