// src/services/testService.js
import { authService } from '../components/AnA/AuthServices';
import { userService } from '../config/firebaseServices';
import { doc, setDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export const testService = {
  // Check if any users exist (with error handling)
  async anyUsersExist() {
    try {
      const usersRef = collection(db, 'users');
      const querySnapshot = await getDocs(usersRef);
      return !querySnapshot.empty;
    } catch (error) {
      console.warn('Cannot check users - permissions issue:', error.message);
      // Return false so setup shows, but don't throw error
      return false;
    }
  },

  // Check if admin exists (with error handling)
  async checkAdminExists() {
    try {
      const users = await userService.getAllUsers();
      return users.some(user => user.role === 'admin');
    } catch (error) {
      console.warn('Cannot check admin - permissions issue:', error.message);
      return false;
    }
  },

  // Create test users with Firebase Auth + Firestore (force recreate)
  async createTestUsersDirectlyWithAuth() {
    try {
      console.log('Starting test user creation...');
      
      // Skip cleanup if permissions are an issue
      try {
        console.log('Attempting cleanup...');
        await this.cleanupTestUsers();
      } catch (error) {
        console.warn('Cleanup failed, continuing anyway:', error.message);
      }
      
      // Wait a moment
      await new Promise(resolve => setTimeout(resolve, 1000));

      const testUsers = [];
      
      // Create admin user
      try {
        console.log('Creating admin user...');
        const adminUser = await authService.register(
          'admin@bookworm.com',
          'admin123',
          'Admin User',
          'admin'
        );
        testUsers.push({
          id: adminUser.uid,
          name: 'Admin User',
          email: 'admin@bookworm.com',
          role: 'admin'
        });
        console.log('Admin user created successfully');
      } catch (error) {
        console.error('Failed to create admin user:', error.message);
        if (error.message.includes('configuration-not-found')) {
          throw new Error('Firebase Authentication is not properly configured. Please check your Firebase project settings.');
        }
        if (error.message.includes('email-already-in-use')) {
          console.log('Admin user already exists, continuing...');
        } else {
          throw new Error(`Failed to create admin user: ${error.message}`);
        }
      }

      // Create customer user
      try {
        console.log('Creating customer user...');
        const customerUser = await authService.register(
          'john@example.com',
          'user123',
          'John Customer',
          'customer'
        );
        testUsers.push({
          id: customerUser.uid,
          name: 'John Customer',
          email: 'john@example.com',
          role: 'customer'
        });
        console.log('Customer user created successfully');
      } catch (error) {
        console.error('Failed to create customer user:', error.message);
        if (error.message.includes('email-already-in-use')) {
          console.log('Customer user already exists, continuing...');
        } else {
          console.warn('Customer user creation failed, continuing...');
        }
      }

      // Create tester user
      try {
        console.log('Creating tester user...');
        const testerUser = await authService.register(
          'tester@bookworm.com',
          'tester123',
          'Test User',
          'tester'
        );
        testUsers.push({
          id: testerUser.uid,
          name: 'Test User',
          email: 'tester@bookworm.com',
          role: 'tester'
        });
        console.log('Tester user created successfully');
      } catch (error) {
        console.error('Failed to create tester user:', error.message);
        if (error.message.includes('email-already-in-use')) {
          console.log('Tester user already exists, continuing...');
        } else {
          console.warn('Tester user creation failed, continuing...');
        }
      }

      if (testUsers.length === 0) {
        throw new Error('No users were created. Please check Firebase configuration and try again.');
      }

      console.log(`Successfully created ${testUsers.length} test users with authentication`);
      return testUsers;
    } catch (error) {
      console.error('Error creating test users with auth:', error);
      throw error;
    }
  },

  // Fallback: Create test users directly in Firestore (when Auth fails)
  async createTestUsersDirectly() {
    try {
      console.log('Creating test users directly in Firestore (no authentication)...');
      
      const testUsers = [
        {
          id: 'admin-fallback-' + Date.now(),
          name: 'Admin User (Fallback)',
          email: 'admin@bookworm.com',
          role: 'admin',
          createdAt: new Date(),
          note: 'Created without Firebase Auth - cannot login'
        },
        {
          id: 'customer-fallback-' + Date.now(),
          name: 'John Customer (Fallback)', 
          email: 'john@example.com',
          role: 'customer',
          createdAt: new Date(),
          note: 'Created without Firebase Auth - cannot login'
        },
        {
          id: 'tester-fallback-' + Date.now(),
          name: 'Test User (Fallback)',
          email: 'tester@bookworm.com',
          role: 'tester',
          createdAt: new Date(),
          note: 'Created without Firebase Auth - cannot login'
        }
      ];

      // Create each user document directly
      for (const user of testUsers) {
        await setDoc(doc(db, 'users', user.id), user);
        console.log(`Created fallback user: ${user.email}`);
      }

      return testUsers;
    } catch (error) {
      console.error('Error creating fallback users:', error);
      throw error;
    }
  },

  // Legacy method - kept for compatibility
  async createTestUsers() {
    try {
      return await this.createTestUsersDirectlyWithAuth();
    } catch (error) {
      console.warn('Auth creation failed, falling back to Firestore-only users');
      return await this.createTestUsersDirectly();
    }
  },

  // Clean up test users (with error handling)
  async cleanupTestUsers() {
    try {
      const testEmails = [
        'admin@bookworm.com',
        'john@example.com', 
        'tester@bookworm.com'
      ];
      
      // Try to get users, but handle permission errors
      let users = [];
      try {
        users = await userService.getAllUsers();
      } catch (error) {
        console.warn('Cannot access users for cleanup:', error.message);
        return; // Skip cleanup if we can't read users
      }
      
      // Delete users that match test emails
      for (const user of users) {
        if (testEmails.includes(user.email)) {
          try {
            await authService.deleteUser(user.id);
            console.log(`Deleted user: ${user.email}`);
          } catch (error) {
            console.warn(`Could not delete ${user.email}:`, error.message);
            
            // Try to delete just the Firestore document
            try {
              const userDoc = doc(db, 'users', user.id);
              await deleteDoc(userDoc);
              console.log(`Deleted Firestore document for: ${user.email}`);
            } catch (firestoreError) {
              console.warn(`Could not delete Firestore document for ${user.email}:`, firestoreError.message);
            }
          }
        }
      }
      
      // Also clean up any fallback documents
      const fallbackPatterns = ['admin-fallback-', 'customer-fallback-', 'tester-fallback-'];
      for (const user of users) {
        if (fallbackPatterns.some(pattern => user.id.startsWith(pattern))) {
          try {
            const userDoc = doc(db, 'users', user.id);
            await deleteDoc(userDoc);
            console.log(`Deleted fallback document: ${user.id}`);
          } catch (error) {
            console.warn(`Could not delete fallback document ${user.id}:`, error.message);
          }
        }
      }
      
    } catch (error) {
      console.error('Error cleaning up test users:', error);
      // Don't throw error here, as cleanup failure shouldn't stop user creation
    }
  }
};