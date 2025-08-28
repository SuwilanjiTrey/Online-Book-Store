// src/services/authService.js
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';

export const authService = {
  // Register new user
  async register(email, password, name, role = 'customer') {
    try {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update profile with display name
      await updateProfile(user, {
        displayName: name
      });

      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        role,
        createdAt: new Date()
      });

      return {
        id: user.uid,
        name,
        email,
        role
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  // Login user
  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        return {
          id: user.uid,
          ...userDoc.data()
        };
      } else {
        throw new Error('User data not found');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Logout user
  async logout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  // Get current user
  getCurrentUser() {
    return auth.currentUser;
  },

  // Listen to auth state changes
  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Get user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          callback({
            id: user.uid,
            ...userDoc.data()
          });
        } else {
          callback(null);
        }
      } else {
        callback(null);
      }
    });
  },

  // Initialize demo users (for development)
  async initializeDemoUsers() {
    try {
      // Check if demo users already exist
      const adminDoc = await getDoc(doc(db, 'users', 'demo-admin'));
      if (!adminDoc.exists()) {
        // Create demo admin
        await this.register('admin@bookworm.com', 'admin123', 'Admin User', 'admin');
      }

      const userDoc = await getDoc(doc(db, 'users', 'demo-user'));
      if (!userDoc.exists()) {
        // Create demo user
        await this.register('john@example.com', 'user123', 'John Doe', 'customer');
      }
    } catch (error) {
      console.error('Error creating demo users:', error);
    }
  }
};