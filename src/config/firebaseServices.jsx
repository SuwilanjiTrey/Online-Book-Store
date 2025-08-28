// src/services/firestoreServices.js
import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { db } from './firebase';

// User Services
export const userService = {
  // Create user profile
  async createUser(userId, userData) {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...userData,
      createdAt: serverTimestamp()
    });
    return userRef;
  },

  // Get user by ID
  async getUser(userId) {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    return userSnap.exists() ? { id: userSnap.id, ...userSnap.data() } : null;
  },

  // Update user
  async updateUser(userId, userData) {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, userData);
  },

  // Get all users (admin only)
  async getAllUsers() {
    const usersRef = collection(db, 'users');
    const querySnapshot = await getDocs(usersRef);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
};

// Book Services
export const bookService = {
  // Create book
  async createBook(bookData) {
    const booksRef = collection(db, 'books');
    const docRef = await addDoc(booksRef, {
      ...bookData,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  },

  // Get all books
  async getAllBooks() {
    const booksRef = collection(db, 'books');
    const querySnapshot = await getDocs(booksRef);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Get book by ID
  async getBook(bookId) {
    const bookRef = doc(db, 'books', bookId);
    const bookSnap = await getDoc(bookRef);
    return bookSnap.exists() ? { id: bookSnap.id, ...bookSnap.data() } : null;
  },

  // Update book
  async updateBook(bookId, bookData) {
    const bookRef = doc(db, 'books', bookId);
    await updateDoc(bookRef, bookData);
  },

  // Delete book
  async deleteBook(bookId) {
    const bookRef = doc(db, 'books', bookId);
    await deleteDoc(bookRef);
  },

  // Get books by category
  async getBooksByCategory(category) {
    const booksRef = collection(db, 'books');
    const q = query(booksRef, where('category', '==', category));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Listen to books changes
  onBooksSnapshot(callback) {
    const booksRef = collection(db, 'books');
    return onSnapshot(booksRef, (snapshot) => {
      const books = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(books);
    });
  }
};

// Cart Services
export const cartService = {
  // Add item to cart
  async addToCart(userId, bookId, quantity = 1) {
    const cartRef = collection(db, 'users', userId, 'cart');
    
    // Check if item already exists
    const q = query(cartRef, where('bookId', '==', bookId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      // Update existing item
      const existingItem = querySnapshot.docs[0];
      await updateDoc(existingItem.ref, {
        quantity: existingItem.data().quantity + quantity
      });
      return existingItem.id;
    } else {
      // Add new item
      const docRef = await addDoc(cartRef, {
        bookId,
        quantity,
        addedAt: serverTimestamp()
      });
      return docRef.id;
    }
  },

  // Get cart items
  async getCartItems(userId) {
    const cartRef = collection(db, 'users', userId, 'cart');
    const querySnapshot = await getDocs(cartRef);
    
    const cartItems = [];
    for (const cartDoc of querySnapshot.docs) {
      const cartData = cartDoc.data();
      const book = await bookService.getBook(cartData.bookId);
      if (book) {
        cartItems.push({
          id: cartDoc.id,
          ...cartData,
          book
        });
      }
    }
    return cartItems;
  },

  // Update cart item quantity
  async updateCartItem(userId, cartItemId, quantity) {
    const cartItemRef = doc(db, 'users', userId, 'cart', cartItemId);
    await updateDoc(cartItemRef, { quantity });
  },

  // Remove item from cart
  async removeFromCart(userId, cartItemId) {
    const cartItemRef = doc(db, 'users', userId, 'cart', cartItemId);
    await deleteDoc(cartItemRef);
  },

  // Clear cart
  async clearCart(userId) {
    const cartRef = collection(db, 'users', userId, 'cart');
    const querySnapshot = await getDocs(cartRef);
    
    const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  },

  // Listen to cart changes
  onCartSnapshot(userId, callback) {
    const cartRef = collection(db, 'users', userId, 'cart');
    return onSnapshot(cartRef, async (snapshot) => {
      const cartItems = [];
      for (const cartDoc of snapshot.docs) {
        const cartData = cartDoc.data();
        const book = await bookService.getBook(cartData.bookId);
        if (book) {
          cartItems.push({
            id: cartDoc.id,
            ...cartData,
            book
          });
        }
      }
      callback(cartItems);
    });
  }
};

// Order Services
export const orderService = {
  // Create order
  async createOrder(userId, items, totalAmount) {
    const ordersRef = collection(db, 'orders');
    const docRef = await addDoc(ordersRef, {
      userId,
      items,
      totalAmount,
      status: 'pending',
      createdAt: serverTimestamp()
    });
    return docRef.id;
  },

  // Get user orders
  async getUserOrders(userId) {
    const ordersRef = collection(db, 'orders');
    const q = query(
      ordersRef, 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Get all orders (admin only)
  async getAllOrders() {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Update order status
  async updateOrderStatus(orderId, status) {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, { status });
  },

  // Get order by ID
  async getOrder(orderId) {
    const orderRef = doc(db, 'orders', orderId);
    const orderSnap = await getDoc(orderRef);
    return orderSnap.exists() ? { id: orderSnap.id, ...orderSnap.data() } : null;
  }
};

// Review Services
export const reviewService = {
  // Add review
  async addReview(bookId, userId, rating, comment) {
    const reviewsRef = collection(db, 'books', bookId, 'reviews');
    const docRef = await addDoc(reviewsRef, {
      userId,
      rating,
      comment,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  },

  // Get book reviews
  async getBookReviews(bookId) {
    const reviewsRef = collection(db, 'books', bookId, 'reviews');
    const q = query(reviewsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Update review
  async updateReview(bookId, reviewId, rating, comment) {
    const reviewRef = doc(db, 'books', bookId, 'reviews', reviewId);
    await updateDoc(reviewRef, { rating, comment });
  },

  // Delete review
  async deleteReview(bookId, reviewId) {
    const reviewRef = doc(db, 'books', bookId, 'reviews', reviewId);
    await deleteDoc(reviewRef);
  }
};

// Category Services
export const categoryService = {
  // Create category
  async createCategory(categoryData) {
    const categoriesRef = collection(db, 'categories');
    const docRef = await addDoc(categoriesRef, {
      ...categoryData,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  },

  // Get all categories
  async getAllCategories() {
    const categoriesRef = collection(db, 'categories');
    const querySnapshot = await getDocs(categoriesRef);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
};