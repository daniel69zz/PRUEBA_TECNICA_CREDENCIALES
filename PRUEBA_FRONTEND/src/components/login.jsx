import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, Key } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    if (!email.trim() || !password.trim()) {
      setError('Todos los campos son obligatorios');
      return false;
    }
    if (!email.includes('@')) {
      setError('El email no es válido');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    const result = await login(email, password);
    
    if (result.success) {
      toast.success('¡Bienvenido de vuelta!');
      navigate('/');
    } else {
      setError(result.error || 'Error al iniciar sesión');
      toast.error('Credenciales incorrectas');
    }
  };

  return (
    <div className="login-wrapper">
      <motion.div 
        className="login-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="login-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}
          >
            <Key size={64} color="var(--primary)" />
          </motion.div>
          <h1 style={{ fontSize: '2rem', color: 'var(--dark)', marginBottom: '0.5rem' }}>Mini Vault</h1>
          <p style={{ color: 'var(--gray)' }}>Tu agenda segura de contraseñas</p>
        </div>
        
        {error && (
          <motion.div 
            className="error-message"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {error}
          </motion.div>
        )}
        
        <form onSubmit={handleSubmit}>
          <motion.div 
            className="form-group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label>Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="demo@example.com"
                disabled={loading}
                style={{ paddingLeft: '40px' }}
              />
            </div>
          </motion.div>
          
          <motion.div 
            className="form-group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label>Contraseña</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                disabled={loading}
                style={{ paddingLeft: '40px' }}
              />
            </div>
          </motion.div>
          
          <motion.button
            type="submit"
            className="btn btn-primary"
            style={{ 
              width: '100%', 
              padding: '1rem',
              marginTop: '1rem'
            }}
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {loading ? (
              <>
                <div className="loading-spinner" style={{ width: '20px', height: '20px' }} />
                Iniciando sesión...
              </>
            ) : (
              <>
                <LogIn size={18} />
                Ingresar
              </>
            )}
          </motion.button>
        </form>
        
        <div className="login-footer">
          <motion.p 
            style={{ textAlign: 'center', color: 'var(--gray)', fontSize: '0.875rem', marginBottom: '1rem' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <strong>Demo:</strong> demo@example.com / 123456
          </motion.p>
          
          <motion.div 
            style={{ textAlign: 'center', paddingTop: '1.5rem', borderTop: '1px solid var(--gray-light)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <p style={{ color: 'var(--gray)', margin: '0 0 0.5rem 0' }}>
              ¿No tienes cuenta?
            </p>
            <button 
              onClick={() => navigate('/register')}
              className="link-btn"
              style={{ fontSize: '0.875rem' }}
            >
              Regístrate gratis
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;