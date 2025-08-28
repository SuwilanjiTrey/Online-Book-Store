// src/components/TestUI.js
import React, { useState, useEffect } from 'react';
import { 
  UserPlus, 
  BookOpen, 
  ShoppingCart, 
  Trash2, 
  Edit, 
  Plus, 
  Save,
  X,
  CheckCircle,
  AlertCircle,
  LogIn,
  LogOut,
  Shield
} from 'lucide-react';
import { authService } from '../components/AnA/AuthServices';
import { userService } from '../config/firebaseServices';
import { bookService } from '../config/firebaseServices';
import { orderService } from '../config/firebaseServices';
import { testService } from './testservice';
import './test.css';


export default function TestUI() {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [adminExists, setAdminExists] = useState(false);
  const [tester, setTester] = useState(null);
  const [anyUsersExist, setAnyUsersExist] = useState(false);
  
  // Login state
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Form states
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'customer' });
  const [newBook, setNewBook] = useState({ 
    title: '', 
    author: '', 
    price: '', 
    stock: '', 
    category: '', 
    description: '' 
  });

  const [newOrder, setNewOrder] = useState({ userId: '', items: [] });
  const [editingBook, setEditingBook] = useState(null);


  // Load initial data
  useEffect(() => {
    checkIfUsersExist();
    checkAdmin();
  }, []);

  // Check if tester is logged in
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((user) => {
      if (user) {
        setTester(user);
        setIsLoggedIn(true);
        loadData();
      } else {
        setTester(null);
        setIsLoggedIn(false);
      }
    });
    
    return () => unsubscribe();
  }, []);

const checkIfUsersExist = async () => {
    const exists = await testService.anyUsersExist();
    setAnyUsersExist(exists);
  };

  const loadData = async () => {
    if (!isLoggedIn) return;
    
    setLoading(true);
    try {
      const [usersData, booksData, ordersData] = await Promise.all([
        userService.getAllUsers(),
        bookService.getAllBooks(),
        orderService.getAllOrders()
      ]);
      
      setUsers(usersData);
      setBooks(booksData);
      setOrders(ordersData);
    } catch (error) {
      showMessage('Failed to load data', 'error');
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };


  const checkAdmin = async () => {
    const exists = await testService.checkAdminExists();
    setAdminExists(exists);
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  // Login/Logout
  const handleLogin = async () => {
    if (!loginForm.email || !loginForm.password) {
      showMessage('Please enter email and password', 'error');
      return;
    }

    try {
      setLoading(true);
      const user = await authService.login(loginForm.email, loginForm.password);
      setTester(user);
      setIsLoggedIn(true);
      setLoginForm({ email: '', password: '' });
      showMessage(`Logged in as ${user.role}`, 'success');
    } catch (error) {
      showMessage('Login failed. Check your credentials.', 'error');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setTester(null);
      setIsLoggedIn(false);
      showMessage('Logged out successfully', 'success');
    } catch (error) {
      showMessage('Logout failed', 'error');
      console.error('Logout error:', error);
    }
  };



  // User Management
  const handleCreateUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      showMessage('Please fill all user fields', 'error');
      return;
    }

    try {
      setLoading(true);
      const user = await authService.register(
        newUser.email, 
        newUser.password, 
        newUser.name, 
        newUser.role
      );
      
      setUsers([...users, { 
        id: user.uid, 
        name: newUser.name, 
        email: newUser.email, 
        role: newUser.role 
      }]);
      
      setNewUser({ name: '', email: '', password: '', role: 'customer' });
      showMessage('User created successfully', 'success');
      
      if (newUser.role === 'admin') {
        setAdminExists(true);
      }
    } catch (error) {
      showMessage('Failed to create user', 'error');
      console.error('Error creating user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        setLoading(true);
        await authService.deleteUser(userId);
        setUsers(users.filter(user => user.id !== userId));
        showMessage('User deleted successfully', 'success');
      } catch (error) {
        showMessage('Failed to delete user', 'error');
        console.error('Error deleting user:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Book Management
  const handleCreateBook = async () => {
    if (!newBook.title || !newBook.author || !newBook.price || !newBook.stock) {
      showMessage('Please fill all required book fields', 'error');
      return;
    }

    try {
      setLoading(true);
      const bookId = await bookService.createBook({
        ...newBook,
        price: parseFloat(newBook.price),
        stock: parseInt(newBook.stock)
      });
      
      setBooks([...books, { 
        id: bookId, 
        ...newBook,
        price: parseFloat(newBook.price),
        stock: parseInt(newBook.stock)
      }]);
      
      setNewBook({ 
        title: '', 
        author: '', 
        price: '', 
        stock: '', 
        category: '', 
        description: '' 
      });
      showMessage('Book created successfully', 'success');
    } catch (error) {
      showMessage('Failed to create book', 'error');
      console.error('Error creating book:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBook = async () => {
    if (!editingBook) return;
    
    try {
      setLoading(true);
      await bookService.updateBook(editingBook.id, editingBook);
      
      setBooks(books.map(book => 
        book.id === editingBook.id ? editingBook : book
      ));
      
      setEditingBook(null);
      showMessage('Book updated successfully', 'success');
    } catch (error) {
      showMessage('Failed to update book', 'error');
      console.error('Error updating book:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        setLoading(true);
        await bookService.deleteBook(bookId);
        setBooks(books.filter(book => book.id !== bookId));
        showMessage('Book deleted successfully', 'success');
      } catch (error) {
        showMessage('Failed to delete book', 'error');
        console.error('Error deleting book:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Order Management
  const handleCreateOrder = async () => {
    if (!newOrder.userId || newOrder.items.length === 0) {
      showMessage('Please select a user and add items to the order', 'error');
      return;
    }

    try {
      setLoading(true);
      const totalAmount = newOrder.items.reduce(
        (sum, item) => sum + (item.price * item.quantity), 0
      );
      
      const orderId = await orderService.createOrder(
        newOrder.userId, 
        newOrder.items, 
        totalAmount
      );
      
      setOrders([...orders, { 
        id: orderId, 
        userId: newOrder.userId, 
        items: newOrder.items, 
        totalAmount,
        status: 'pending',
        createdAt: new Date()
      }]);
      
      setNewOrder({ userId: '', items: [] });
      showMessage('Order created successfully', 'success');
    } catch (error) {
      showMessage('Failed to create order', 'error');
      console.error('Error creating order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        setLoading(true);
        await orderService.updateOrderStatus(orderId, 'cancelled');
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: 'cancelled' } : order
        ));
        showMessage('Order cancelled successfully', 'success');
      } catch (error) {
        showMessage('Failed to cancel order', 'error');
        console.error('Error cancelling order:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const addBookToOrder = (book) => {
    const existingItem = newOrder.items.find(item => item.id === book.id);
    
    if (existingItem) {
      setNewOrder({
        ...newOrder,
        items: newOrder.items.map(item =>
          item.id === book.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        )
      });
    } else {
      setNewOrder({
        ...newOrder,
        items: [...newOrder.items, { 
          id: book.id, 
          title: book.title, 
          author: book.author, 
          price: book.price, 
          quantity: 1 
        }]
      });
    }
  };

  const removeBookFromOrder = (bookId) => {
    setNewOrder({
      ...newOrder,
      items: newOrder.items.filter(item => item.id !== bookId)
    });
  };

  const createTestUsersWithAuth = async () => {
  try {
    setLoading(true);
    const createdUsers = await testService.createTestUsersWithAuth();
    if (createdUsers.length > 0) {
      setUsers(prev => [...prev, ...createdUsers]);
      setAnyUsersExist(true);
      setAdminExists(true);
      showMessage(`Created ${createdUsers.length} test users with authentication`, 'success');
    } else {
      showMessage('Test users might already exist', 'error');
    }
  } catch (error) {
    showMessage('Failed to create test users with auth', 'error');
    console.error('Error creating test users with auth:', error);
  } finally {
    setLoading(false);
  }
};

// Replace your createTestUsersBruteForce function in TestUI.js with this:

const createTestUsersBruteForce = async () => {
  try {
    setLoading(true);
    // Use the auth-enabled method instead of direct Firestore creation
    const createdUsers = await testService.createTestUsersDirectlyWithAuth();
    
    if (createdUsers.length > 0) {
      setUsers(prev => [...prev, ...createdUsers]);
      setAnyUsersExist(true);
      setAdminExists(true);
      showMessage(`Created ${createdUsers.length} test users with authentication - you can now log in!`, 'success');
    } else {
      showMessage('Test users might already exist', 'error');
    }
  } catch (error) {
    showMessage('Failed to create test users', 'error');
    console.error('Error creating test users:', error);
  } finally {
    setLoading(false);
  }
};

// Also update the createTestUsers function to use the same method:
const createTestUsers = async () => {
  try {
    setLoading(true);
    const createdUsers = await testService.createTestUsersDirectlyWithAuth();
    
    if (createdUsers.length > 0) {
      await loadData();
      await checkAdmin();
      setAnyUsersExist(true);
      showMessage(`Created ${createdUsers.length} test users with authentication`, 'success');
    } else {
      showMessage('Test users might already exist', 'error');
    }
  } catch (error) {
    showMessage('Failed to create test users', 'error');
    console.error('Error creating test users:', error);
  } finally {
    setLoading(false);
  }
};

  // If not logged in, show login form
if (!isLoggedIn) {
    return (
      <div className="test-ui-container">
        <div className="test-ui-header">
          <h2>Firestore Test UI</h2>
          <p>Please log in to access testing tools</p>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.type === 'success' ? (
              <CheckCircle size={16} />
            ) : (
              <AlertCircle size={16} />
            )}
            {message.text}
          </div>
        )}

        <div className="login-section">
          <div className="login-form">
            <h3>Tester Login</h3>
            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                value={loginForm.email}
                onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                placeholder="Enter your email"
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                placeholder="Enter your password"
              />
            </div>
            <button className="btn btn-primary" onClick={handleLogin}>
              <LogIn size={16} /> Login
            </button>
          </div>

          <div className="demo-credentials">
            <h4>Demo Credentials</h4>
            <div className="credential-item">
              <strong>Admin:</strong> admin@bookworm.com / admin123
            </div>
            <div className="credential-item">
              <strong>Customer:</strong> john@example.com / user123
            </div>
            <div className="credential-item">
              <strong>Tester:</strong> tester@bookworm.com / tester123
            </div>
          </div>

{!anyUsersExist && (
  <div className="setup-section">
    <h4>Initial Setup</h4>
    <p>No users exist in the system. Create test users to get started:</p>
    <button className="btn btn-primary" onClick={createTestUsersBruteForce}>
      <UserPlus size={16} /> Force Create Test Users (With Authentication)
    </button>
    <p className="info-text">
      This will delete any existing test users and create fresh ones with Firebase Authentication.
      You'll be able to log in with these credentials immediately after creation.
    </p>
  </div>
)}
        </div>
      </div>
    );
  }
  
  // Main UI when logged in
  return (
    <div className="test-ui-container">
      <div className="test-ui-header">
        <div className="header-content">
          <div>
            <h2>Firestore Test UI</h2>
            <p>Logged in as: {tester.email} ({tester.role})</p>
          </div>
          <button className="btn btn-secondary" onClick={handleLogout}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.type === 'success' ? (
            <CheckCircle size={16} />
          ) : (
            <AlertCircle size={16} />
          )}
          {message.text}
        </div>
      )}

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <UserPlus size={16} /> Users
        </button>
        <button 
          className={`tab ${activeTab === 'books' ? 'active' : ''}`}
          onClick={() => setActiveTab('books')}
        >
          <BookOpen size={16} /> Books
        </button>
        <button 
          className={`tab ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <ShoppingCart size={16} /> Orders
        </button>
      </div>

      <div className="tab-content">
        {loading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="tab-panel">
            <div className="panel-header">
              <h3>User Management</h3>
              {!adminExists && (
                <button className="btn btn-primary" onClick={createTestUsers}>
                  Create Test Users
                </button>
              )}
            </div>

            <div className="form-section">
              <h4>Create New User</h4>
              <div className="form-grid">
                <div>
                  <label>Name</label>
                  <input 
                    type="text" 
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  />
                </div>
                <div>
                  <label>Email</label>
                  <input 
                    type="email" 
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  />
                </div>
                <div>
                  <label>Password</label>
                  <input 
                    type="password" 
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  />
                </div>
                <div>
                  <label>Role</label>
                  <select 
                    value={newUser.role}
                    onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                    <option value="tester">Tester</option>
                  </select>
                </div>
              </div>
              <button className="btn btn-primary" onClick={handleCreateUser}>
                <Plus size={16} /> Create User
              </button>
            </div>

            <div className="list-section">
              <h4>Existing Users</h4>
              <div className="user-list">
                {users.length === 0 ? (
                  <p>No users found</p>
                ) : (
                  users.map(user => (
                    <div key={user.id} className="list-item">
                      <div>
                        <strong>{user.name}</strong> ({user.email})
                        <span className={`role-badge ${user.role}`}>{user.role}</span>
                      </div>
                      <button 
                        className="btn btn-icon btn-danger"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Books Tab */}
        {activeTab === 'books' && (
          <div className="tab-panel">
            <div className="panel-header">
              <h3>Book Management</h3>
            </div>

            <div className="form-section">
              <h4>{editingBook ? 'Edit Book' : 'Create New Book'}</h4>
              <div className="form-grid">
                <div>
                  <label>Title</label>
                  <input 
                    type="text" 
                    value={editingBook ? editingBook.title : newBook.title}
                    onChange={(e) => 
                      editingBook 
                        ? setEditingBook({...editingBook, title: e.target.value})
                        : setNewBook({...newBook, title: e.target.value})
                    }
                  />
                </div>
                <div>
                  <label>Author</label>
                  <input 
                    type="text" 
                    value={editingBook ? editingBook.author : newBook.author}
                    onChange={(e) => 
                      editingBook 
                        ? setEditingBook({...editingBook, author: e.target.value})
                        : setNewBook({...newBook, author: e.target.value})
                    }
                  />
                </div>
                <div>
                  <label>Price</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={editingBook ? editingBook.price : newBook.price}
                    onChange={(e) => 
                      editingBook 
                        ? setEditingBook({...editingBook, price: parseFloat(e.target.value)})
                        : setNewBook({...newBook, price: e.target.value})
                    }
                  />
                </div>
                <div>
                  <label>Stock</label>
                  <input 
                    type="number" 
                    value={editingBook ? editingBook.stock : newBook.stock}
                    onChange={(e) => 
                      editingBook 
                        ? setEditingBook({...editingBook, stock: parseInt(e.target.value)})
                        : setNewBook({...newBook, stock: e.target.value})
                    }
                  />
                </div>
                <div>
                  <label>Category</label>
                  <input 
                    type="text" 
                    value={editingBook ? editingBook.category : newBook.category}
                    onChange={(e) => 
                      editingBook 
                        ? setEditingBook({...editingBook, category: e.target.value})
                        : setNewBook({...newBook, category: e.target.value})
                    }
                  />
                </div>
                <div>
                  <label>Description</label>
                  <input 
                    type="text" 
                    value={editingBook ? editingBook.description : newBook.description}
                    onChange={(e) => 
                      editingBook 
                        ? setEditingBook({...editingBook, description: e.target.value})
                        : setNewBook({...newBook, description: e.target.value})
                    }
                  />
                </div>
              </div>
              
              {editingBook ? (
                <div className="form-actions">
                  <button className="btn btn-primary" onClick={handleUpdateBook}>
                    <Save size={16} /> Update Book
                  </button>
                  <button className="btn btn-secondary" onClick={() => setEditingBook(null)}>
                    <X size={16} /> Cancel
                  </button>
                </div>
              ) : (
                <button className="btn btn-primary" onClick={handleCreateBook}>
                  <Plus size={16} /> Create Book
                </button>
              )}
            </div>

            <div className="list-section">
              <h4>Existing Books</h4>
              <div className="book-list">
                {books.length === 0 ? (
                  <p>No books found</p>
                ) : (
                  books.map(book => (
                    <div key={book.id} className="list-item">
                      <div>
                        <strong>{book.title}</strong> by {book.author}
                        <div className="book-details">
                          <span>K {book.price.toFixed(2)}</span>
                          <span>Stock: {book.stock}</span>
                          <span>{book.category}</span>
                        </div>
                      </div>
                      <div className="item-actions">
                        <button 
                          className="btn btn-icon btn-secondary"
                          onClick={() => setEditingBook(book)}
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          className="btn btn-icon btn-danger"
                          onClick={() => handleDeleteBook(book.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="tab-panel">
            <div className="panel-header">
              <h3>Order Management</h3>
            </div>

            <div className="form-section">
              <h4>Create New Order</h4>
              <div className="form-grid">
                <div>
                  <label>User</label>
                  <select 
                    value={newOrder.userId}
                    onChange={(e) => setNewOrder({...newOrder, userId: e.target.value})}
                  >
                    <option value="">Select a user</option>
                    {users.filter(u => u.role === 'customer').map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="order-items">
                <h5>Order Items</h5>
                {newOrder.items.length === 0 ? (
                  <p>No items added</p>
                ) : (
                  <div className="order-items-list">
                    {newOrder.items.map(item => (
                      <div key={item.id} className="order-item">
                        <div>
                          <strong>{item.title}</strong> - K {item.price.toFixed(2)} x {item.quantity}
                        </div>
                        <button 
                          className="btn btn-icon btn-danger"
                          onClick={() => removeBookFromOrder(item.id)}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="available-books">
                <h5>Available Books</h5>
                <div className="book-list">
                  {books.length === 0 ? (
                    <p>No books available</p>
                  ) : (
                    books.map(book => (
                      <div key={book.id} className="list-item">
                        <div>
                          <strong>{book.title}</strong> by {book.author}
                          <div className="book-details">
                            <span>K {book.price.toFixed(2)}</span>
                            <span>Stock: {book.stock}</span>
                          </div>
                        </div>
                        <button 
                          className="btn btn-icon btn-primary"
                          onClick={() => addBookToOrder(book)}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <button className="btn btn-primary" onClick={handleCreateOrder}>
                <Plus size={16} /> Create Order
              </button>
            </div>

            <div className="list-section">
              <h4>Existing Orders</h4>
              <div className="order-list">
                {orders.length === 0 ? (
                  <p>No orders found</p>
                ) : (
                  orders.map(order => {
                    const user = users.find(u => u.id === order.userId);
                    return (
                      <div key={order.id} className="list-item">
                        <div>
                          <strong>Order #{order.id.toString().slice(-6)}</strong>
                          <div className="order-details">
                            <span>User: {user ? user.name : 'Unknown'}</span>
                            <span>Total: K {order.totalAmount.toFixed(2)}</span>
                            <span className={`status-badge ${order.status}`}>
                              {order.status}
                            </span>
                          </div>
                          <div className="order-items-preview">
                            {order.items.slice(0, 2).map(item => (
                              <span key={item.id}>{item.title} x {item.quantity}</span>
                            ))}
                            {order.items.length > 2 && (
                              <span>+{order.items.length - 2} more</span>
                            )}
                          </div>
                        </div>
                        <button 
                          className="btn btn-icon btn-danger"
                          onClick={() => handleDeleteOrder(order.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}