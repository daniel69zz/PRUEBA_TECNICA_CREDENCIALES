import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState(() => {
    // Load users from localStorage or initialize with demo user
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      return JSON.parse(storedUsers);
    }
    // Initialize with demo user
    const demoUsers = [
      { id: 1, email: 'demo@example.com', name: 'Usuario Demo', password: '123456' }
    ];
    localStorage.setItem('users', JSON.stringify(demoUsers));
    return demoUsers;
  });

  const login = async (email, password) => {
    setLoading(true);
    try {
      // Simulación de llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Buscar usuario en el "localStorage"
      const foundUser = users.find(u => u.email === email.toLowerCase() && u.password === password);
      
      if (foundUser) {
        const userData = { 
          id: foundUser.id,
          email: foundUser.email, 
          name: foundUser.name 
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true };
      } else {
        throw new Error('Email o contraseña incorrectos');
      }
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      // Simulación de llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verificar si el email ya existe
      const existingUser = users.find(u => u.email === userData.email);
      if (existingUser) {
        throw new Error('El email ya está registrado');
      }
      
      // Crear nuevo usuario
      const newUser = {
        id: Date.now(),
        email: userData.email,
        name: userData.name,
        password: userData.password
      };
      
      // Guardar en localStorage
      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Verificar si hay usuario en localStorage al iniciar
  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};