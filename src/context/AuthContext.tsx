import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { UserProfile } from '../types';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isDemoUser: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, name: string, phone: string, address: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginAsDemo: () => void;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  saveUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER_ID = 'demo_praktisi_bekam';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isDemoUser, setIsDemoUser] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  // Load user profile from Firestore
  const fetchUserProfile = async (user: User) => {
    const userDocRef = doc(db, 'users', user.uid);
    try {
      const snap = await getDoc(userDocRef);
      if (snap.exists()) {
        setUserProfile(snap.data() as UserProfile);
      } else {
        // Create initial profile if not exists
        const initialProfile: UserProfile = {
          userId: user.uid,
          name: user.displayName || user.email?.split('@')[0] || 'Praktisi Bekam',
          phone: '',
          address: '',
          avatarUrl: user.photoURL || '',
          bannerUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1000&auto=format&fit=crop&q=80',
          bannerPosition: 'center',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        try {
          await setDoc(userDocRef, {
            ...initialProfile,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        } catch (e) {
          console.warn('Gagal menyimpan profil awal ke Firestore:', e);
        }
        setUserProfile(initialProfile);
      }
    } catch (error) {
      console.warn('Gagal memuat profil pengguna dari Firestore:', error);
      setUserProfile({
        userId: user.uid,
        name: user.displayName || 'Praktisi Bekam',
        phone: '',
        address: '',
        bannerPosition: 'center',
      });
    }
  };

  useEffect(() => {
    // Check if demo user was active
    const savedDemo = localStorage.getItem('bekam_demo_active');
    if (savedDemo === 'true') {
      const demoProfile: UserProfile = {
        userId: DEMO_USER_ID,
        name: 'Ustadz Ahmad Fauzi (Praktisi Demo)',
        phone: '081234567890',
        address: 'Klinik Thibbun Nabawi Al-Kautsar, Jakarta',
        avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80',
        bannerUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1000&auto=format&fit=crop&q=80',
        bannerPosition: 'center',
      };
      setCurrentUser({
        uid: DEMO_USER_ID,
        email: 'demo@bekamjr.app',
        displayName: 'Ustadz Ahmad Fauzi',
      } as unknown as User);
      setUserProfile(demoProfile);
      setIsDemoUser(true);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        setIsDemoUser(false);
        localStorage.removeItem('bekam_demo_active');
        await fetchUserProfile(user);
      } else {
        setUserProfile(null);
        setIsDemoUser(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const register = async (email: string, pass: string, name: string, phone: string, address: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    if (cred.user) {
      await updateProfile(cred.user, { displayName: name });
      const newProfile: UserProfile = {
        userId: cred.user.uid,
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        bannerUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1000&auto=format&fit=crop&q=80',
        bannerPosition: 'center',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const userDocRef = doc(db, 'users', cred.user.uid);
      try {
        await setDoc(userDocRef, {
          ...newProfile,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `users/${cred.user.uid}`);
      }
      setUserProfile(newProfile);
    }
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const loginAsDemo = () => {
    const demoProfile: UserProfile = {
      userId: DEMO_USER_ID,
      name: 'Ustadz Ahmad Fauzi (Praktisi Demo)',
      phone: '081234567890',
      address: 'Klinik Thibbun Nabawi Al-Kautsar, Jakarta',
      avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1000&auto=format&fit=crop&q=80',
      bannerPosition: 'center',
    };
    setCurrentUser({
      uid: DEMO_USER_ID,
      email: 'demo@bekamjr.app',
      displayName: 'Ustadz Ahmad Fauzi',
    } as unknown as User);
    setUserProfile(demoProfile);
    setIsDemoUser(true);
    localStorage.setItem('bekam_demo_active', 'true');
  };

  const logout = async () => {
    localStorage.removeItem('bekam_demo_active');
    setIsDemoUser(false);
    if (auth.currentUser) {
      await signOut(auth);
    }
    setCurrentUser(null);
    setUserProfile(null);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const saveUserProfile = async (data: Partial<UserProfile>) => {
    if (!currentUser) return;
    if (isDemoUser) {
      setUserProfile((prev) => (prev ? { ...prev, ...data } : null));
      return;
    }
    const userDocRef = doc(db, 'users', currentUser.uid);
    try {
      await updateDoc(userDocRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
      setUserProfile((prev) => (prev ? { ...prev, ...data } : null));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${currentUser.uid}`);
    }
  };

  const refreshProfile = async () => {
    if (currentUser && !isDemoUser) {
      await fetchUserProfile(currentUser);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        isDemoUser,
        login,
        register,
        loginWithGoogle,
        loginAsDemo,
        logout,
        resetPassword,
        saveUserProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth harus digunakan di dalam AuthProvider');
  }
  return context;
};
