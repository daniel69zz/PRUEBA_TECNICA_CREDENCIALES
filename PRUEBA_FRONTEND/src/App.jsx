import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ErrorBoundary from './componets/ErrorBoundary';
import PrivateRoute from './componets/PrivateRoute';
import Navbar from './componets/Navbar';
import Login from './componets/login';
import Register from './componets/Register';
import CredentialList from './componets/CredentialList';
import CredentialForm from './componets/CredentialForm';
import CredentialDetail from './componets/CredentialDetail';
import { AnimatePresence } from 'framer-motion';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <div className="app">
              <Navbar />
              <main className="main-content">
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                    borderRadius: '10px',
                  },
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: '#10b981',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    duration: 4000,
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/" element={
                    <PrivateRoute>
                      <CredentialList />
                    </PrivateRoute>
                  } />
                  <Route path="/crear" element={
                    <PrivateRoute>
                      <CredentialForm />
                    </PrivateRoute>
                  } />
                  <Route path="/editar/:id" element={
                    <PrivateRoute>
                      <CredentialForm />
                    </PrivateRoute>
                  } />
                  <Route path="/detalle/:id" element={
                    <PrivateRoute>
                      <CredentialDetail />
                    </PrivateRoute>
                  } />
                </Routes>
              </AnimatePresence>
            </main>
          </div>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </ErrorBoundary>
  );
}

export default App;