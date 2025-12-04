/**
 * Authentication Hook
 * Manages user authentication state
 */

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser, signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { getCurrentUser, createOrUpdateUser, generateInviteCode } from '../services/firebase/users';
import { User } from '../services/firebase/types';

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        // Fetch user data from Firestore
        let userData = await getCurrentUser(firebaseUser.uid);
        
        // If user doesn't exist in Firestore, create it
        if (!userData) {
          const inviteCode = generateInviteCode(firebaseUser.uid);
          userData = {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || 'User',
            city: 'Miami', // Default city
            inviteCode,
            isFoundingMember: true, // For Phase 1, all users are founding members
            createdAt: new Date().toISOString(),
          };
          
          await createOrUpdateUser(userData);
        }
        
        setUser(userData);
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ firebaseUser, user, loading, signOut: handleSignOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

