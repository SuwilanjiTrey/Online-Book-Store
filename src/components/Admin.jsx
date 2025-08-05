import React from 'react';
import { 
  Book, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Users, 
  ShoppingBag,
  BarChart3,
  DollarSign,
  Star
} from 'lucide-react';

export default function AdminPanel({ currentUser, onUpdateBooks }) {
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const [books, setBooks] = React.useState([]);
  const [orders, setOrders] = React.useState([]);
  const [users, setUsers] = React.useState([]);
  const [editingBook, setEditingBook] = React.useState(null);
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [newBook, setNewBook] = React.useState({
    title: '',
    author: '',
    price: '',
    rating: '',
    category: '',
    description: '',
    coverImg: ''
  });

  // Load data on component mount
  React.useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const storedBooks = JSON.parse(localStorage.getItem('books')) || [];
    const storedOrders = JSON.parse(localStorage.getItem('orders')) || [];
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    
    setBooks(storedBooks);
    setOrders(storedOrders);
    setUsers(storedUsers);
  };

  const saveBook = (book) => {
    let updatedBooks;
    if (book.id) {
      // Update existing book
      updatedBooks = books.map(b => b.id === book.id ? book : b);
    } else {
      // Add new book
      const newId = Math.max(...books.map(b => b.id), 0) + 1;
      updatedBooks = [...books, { ...book, id: newId }];
    }
    
    setBooks(updatedBooks);
    localStorage.setItem('books', JSON.stringify(updatedBooks));
    onUpdateBooks(updatedBooks);
    setEditingBook(null);
    setShowAddForm(false);
    setNewBook({
      title: '',
      author: '',
      price: '',
      rating: '',
      category: '',
      description: '',
      coverImg: ''
    });
  };

  const deleteBook = (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      const updatedBooks = books.filter(b => b.id !== bookId);
      setBooks(updatedBooks);
      localStorage.setItem('books', JSON.stringify(updatedBooks));
      onUpdateBooks(updatedBooks);
    }
  };

  const calculateStats = () => {
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalBooks = books.length;
    const totalCustomers = users.filter(u => u.role === 'user').length;
    const totalOrders = orders.length;

    return { totalRevenue, totalBooks, totalCustomers, totalOrders };
  };

  const stats = calculateStats();

  const BookForm = ({ book, onSave, onCancel }) => {
    const [formData, setFormData] = React.useState(book || {
      title: '',
      author: '',
      price: '',
      rating: '',
      category: '',
      description: '',
      coverImg: ''
    });

    const handleSubmit = () => {
      if (!formData.title || !formData.author || !formData.price) {
        alert('Please fill in all required fields');
        return;
      }
      
      onSave({
        ...formData,
        price: parseFloat(formData.price),
        rating: parseFloat(formData.rating) || 4.0
      });
    };

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
          padding: '30px',
          borderRadius: '12px',
          width: '90%',
          maxWidth: '500px',
          maxHeight: '90vh',
          overflow: 'auto'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h3 style={{ margin: 0 }}>{book ? 'Edit Book' : 'Add New Book'}</h3>
            <button
              onClick={onCancel}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#666'
              }}
            >
              <X size={20} />
            </button>
          </div>

          <div style={{ display: 'grid', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                Author *
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({...formData, author: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                  Price *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                  Rating
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={formData.rating}
                  onChange={(e) => setFormData({...formData, rating: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  boxSizing: 'border-box'
                }}
              >
                <option value="">Select Category</option>
                <option value="Programming">Programming</option>
                <option value="Fiction">Fiction</option>
                <option value="Business">Business</option>
                <option value="Science">Science</option>
                <option value="design">Design</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                Cover Image URL
              </label>
              <input
                type="url"
                value={formData.coverImg}
                onChange={(e) => setFormData({...formData, coverImg: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  boxSizing: 'border-box',
                  resize: 'vertical'
                }}
              />
            </div>
          </div>

          <div style={{
            display: 'flex',
            gap: '10px',
            marginTop: '20px',
            justifyContent: 'flex-end'
          }}>
            <button
              onClick={onCancel}
              style={{
                padding: '10px 20px',
                border: '1px solid #ddd',
                background: 'white',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              style={{
                padding: '10px 20px',
                background: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <Save size={16} />
              Save Book
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderDashboard = () => (
    <div>
      <h2 style={{ marginBottom: '30px' }}>Dashboard Overview</h2>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '25px',
          borderRadius: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '32px' }}>K{stats.totalRevenue.toFixed(2)}</h3>
              <p style={{ margin: '5px 0 0', opacity: 0.9 }}>Total Revenue</p>
            </div>
            <DollarSign size={40} style={{ opacity: 0.8 }} />
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          color: 'white',
          padding: '25px',
          borderRadius: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '32px' }}>{stats.totalBooks}</h3>
              <p style={{ margin: '5px 0 0', opacity: 0.9 }}>Total Books</p>
            </div>
            <Book size={40} style={{ opacity: 0.8 }} />
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          color: 'white',
          padding: '25px',
          borderRadius: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '32px' }}>{stats.totalOrders}</h3>
              <p style={{ margin: '5px 0 0', opacity: 0.9 }}>Total Orders</p>
            </div>
            <ShoppingBag size={40} style={{ opacity: 0.8 }} />
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          color: 'white',
          padding: '25px',
          borderRadius: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '32px' }}>{stats.totalCustomers}</h3>
              <p style={{ margin: '5px 0 0', opacity: 0.9 }}>Total Customers</p>
            </div>
            <Users size={40} style={{ opacity: 0.8 }} />
          </div>
        </div>
      </div>

      <div style={{
        background: 'white',
        padding: '25px',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h3>Recent Orders</h3>
        {orders.length === 0 ? (
          <p style={{ color: '#666' }}>No orders yet</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f0f0f0' }}>
                  <th style={{ textAlign: 'left', padding: '12px', color: '#666' }}>Order ID</th>
                  <th style={{ textAlign: 'left', padding: '12px', color: '#666' }}>Date</th>
                  <th style={{ textAlign: 'left', padding: '12px', color: '#666' }}>Items</th>
                  <th style={{ textAlign: 'right', padding: '12px', color: '#666' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(-5).reverse().map(order => (
                  <tr key={order.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '12px' }}>#{order.id.toString().slice(-6)}</td>
                    <td style={{ padding: '12px' }}>
                      {new Date(order.date).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '12px' }}>{order.items.length} items</td>
                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>
                      K{order.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  const renderBooks = () => (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h2 style={{ margin: 0 }}>Books Management</h2>
        <button
          onClick={() => setShowAddForm(true)}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            padding: '12px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: '500'
          }}
        >
          <Plus size={16} />
          Add New Book
        </button>
      </div>

      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {books.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
            <Book size={48} style={{ opacity: 0.5, marginBottom: '16px' }} />
            <p>No books available. Add your first book!</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f8f9fa' }}>
                <tr>
                  <th style={{ textAlign: 'left', padding: '15px', color: '#666', fontWeight: '600' }}>Book</th>
                  <th style={{ textAlign: 'left', padding: '15px', color: '#666', fontWeight: '600' }}>Author</th>
                  <th style={{ textAlign: 'left', padding: '15px', color: '#666', fontWeight: '600' }}>Category</th>
                  <th style={{ textAlign: 'left', padding: '15px', color: '#666', fontWeight: '600' }}>Rating</th>
                  <th style={{ textAlign: 'right', padding: '15px', color: '#666', fontWeight: '600' }}>Price</th>
                  <th style={{ textAlign: 'center', padding: '15px', color: '#666', fontWeight: '600' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map(book => (
                  <tr key={book.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '15px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={book.coverImg || '/api/placeholder/40/60'}
                          alt={book.title}
                          style={{
                            width: '40px',
                            height: '60px',
                            objectFit: 'cover',
                            borderRadius: '4px'
                          }}
                        />
                        <div>
                          <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                            {book.title}
                          </div>
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            {book.description?.substring(0, 50)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '15px' }}>{book.author}</td>
                    <td style={{ padding: '15px' }}>
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
                    </td>
                    <td style={{ padding: '15px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Star size={14} fill="#FFD700" color="#FFD700" />
                        <span>{book.rating}</span>
                      </div>
                    </td>
                    <td style={{ padding: '15px', textAlign: 'right', fontWeight: '600' }}>
                      K{book.price?.toFixed(2)}
                    </td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button
                          onClick={() => setEditingBook(book)}
                          style={{
                            background: '#28a745',
                            color: 'white',
                            border: 'none',
                            padding: '8px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => deleteBook(book.id)}
                          style={{
                            background: '#dc3545',
                            color: 'white',
                            border: 'none',
                            padding: '8px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  const renderOrders = () => (
    <div>
      <h2 style={{ marginBottom: '30px' }}>Orders Management</h2>
      
      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {orders.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
            <ShoppingBag size={48} style={{ opacity: 0.5, marginBottom: '16px' }} />
            <p>No orders yet</p>
          </div>
        ) : (
          <div>
            {orders.map(order => (
              <div key={order.id} style={{
                padding: '20px',
                borderBottom: '1px solid #f0f0f0'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '15px'
                }}>
                  <div>
                    <h4 style={{ margin: '0 0 5px 0' }}>
                      Order #{order.id.toString().slice(-6)}
                    </h4>
                    <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                      {new Date(order.date).toLocaleString()}
                    </p>
                  </div>
                  <div style={{
                    background: '#28a745',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    Completed
                  </div>
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                  <strong style={{ fontSize: '14px', color: '#666' }}>Items:</strong>
                  <div style={{ marginTop: '8px' }}>
                    {order.items.map(item => (
                      <div key={item.id} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px 0',
                        fontSize: '14px'
                      }}>
                        <span>{item.title} (Qty: {item.quantity})</span>
                        <span>K{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '15px',
                  borderTop: '1px solid #f0f0f0'
                }}>
                  <span style={{ fontWeight: '600' }}>Total</span>
                  <span style={{ fontWeight: '600', fontSize: '16px' }}>
                    K{order.total.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderUsers = () => (
    <div>
      <h2 style={{ marginBottom: '30px' }}>Users Management</h2>
      
      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f8f9fa' }}>
              <tr>
                <th style={{ textAlign: 'left', padding: '15px', color: '#666', fontWeight: '600' }}>Name</th>
                <th style={{ textAlign: 'left', padding: '15px', color: '#666', fontWeight: '600' }}>Email</th>
                <th style={{ textAlign: 'center', padding: '15px', color: '#666', fontWeight: '600' }}>Role</th>
                <th style={{ textAlign: 'center', padding: '15px', color: '#666', fontWeight: '600' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: '600'
                      }}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span style={{ fontWeight: '500' }}>{user.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '15px' }}>{user.email}</td>
                  <td style={{ padding: '15px', textAlign: 'center' }}>
                    <span style={{
                      background: user.role === 'admin' ? '#ff6b6b' : '#4ecdc4',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      textTransform: 'capitalize'
                    }}>
                      {user.role}
                    </span>
                  </td>
                  <td style={{ padding: '15px', textAlign: 'center' }}>
                    <span style={{
                      background: '#28a745',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fa' }}>
      {/* Sidebar */}
      <div style={{
        width: '250px',
        background: 'white',
        boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
        padding: '20px 0'
      }}>
        <div style={{ padding: '0 20px', marginBottom: '30px' }}>
          <h3 style={{ margin: 0, color: '#333' }}>Admin Panel</h3>
          <p style={{ margin: '5px 0 0', color: '#666', fontSize: '14px' }}>
            Welcome, {currentUser.name}
          </p>
        </div>

        <nav>
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'books', label: 'Books', icon: Book },
            { id: 'orders', label: 'Orders', icon: ShoppingBag },
            { id: 'users', label: 'Users', icon: Users }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                width: '100%',
                padding: '15px 20px',
                border: 'none',
                background: activeTab === item.id ? '#e3f2fd' : 'transparent',
                color: activeTab === item.id ? '#1976d2' : '#666',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '14px',
                fontWeight: activeTab === item.id ? '600' : '400',
                transition: 'all 0.3s'
              }}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '30px' }}>
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'books' && renderBooks()}
        {activeTab === 'orders' && renderOrders()}
        {activeTab === 'users' && renderUsers()}
      </div>

      {/* Modals */}
      {(editingBook || showAddForm) && (
        <BookForm
          book={editingBook}
          onSave={saveBook}
          onCancel={() => {
            setEditingBook(null);
            setShowAddForm(false);
          }}
        />
      )}
    </div>
  );
};
