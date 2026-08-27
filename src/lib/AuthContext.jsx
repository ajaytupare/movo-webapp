import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';

const AuthContext = createContext({
  currentUser: null,
  loading: true,
  logout: async () => {},
  reloadUser: async () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = () => signOut(auth);

  const reloadUser = async () => {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      // Force a state update with the fresh user object
      setCurrentUser({ ...auth.currentUser });
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, logout, reloadUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};