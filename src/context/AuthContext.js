import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const demoAccounts = [
    {
      title: 'Lead Labor',
      email: 'lead@jdpelectric.com',
      password: 'password123',
      role: 'Lead Labor',
      name: 'Sarah Johnson',
    },
    {
      title: 'Labor',
      email: 'tech@jdpelectric.com',
      password: 'password123',
      role: 'Labor',
      name: 'Mike Wilson',
    },
  ];

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    const validAccount = demoAccounts.find(
      account => account.email === email && account.password === password
    );

    if (validAccount) {
      const userData = {
        email: validAccount.email,
        role: validAccount.role,
        name: validAccount.name,
        title: validAccount.title,
      };
      
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } else {
      return { success: false, error: 'Invalid credentials. Please use demo accounts.' };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userData');
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const value = {
    user,
    login,
    logout,
    isLoading,
    demoAccounts,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

