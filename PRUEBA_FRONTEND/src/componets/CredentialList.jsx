import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';
import { 
  Eye, Edit, Trash2, Plus, Search, 
  Globe, Clock, Key, Mail, AlertCircle, LogOut 
} from 'lucide-react';
import LoadingSkeleton from './LoadingSkeleton';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import toast from 'react-hot-toast';

const CredentialList = () => {
  const [credentials, setCredentials] = useState([]);
  const [filteredCredentials, setFilteredCredentials] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, logout } = useAuth();
  const { toggleTheme } = useTheme();

  useEffect(() => {
    loadCredentials();
  }, []);

  useEffect(() => {
    filterCredentials();
  }, [searchTerm, credentials]);

  const loadCredentials = async () => {
    try {
      setLoading(true);
      const data = await api.getCredentials();
      setCredentials(data);
      setFilteredCredentials(data);
    } catch (err) {
      setError('Error al cargar las credenciales');
      toast.error('No pudimos cargar tus credenciales');
    } finally {
      setLoading(false);
    }
  };

  const filterCredentials = () => {
    if (!searchTerm.trim()) {
      setFilteredCredentials(credentials);
    } else {
      const filtered = credentials.filter(cred =>
        cred.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCredentials(filtered);
    }
  };

  const handleDelete = async (id, serviceName) => {
    if (window.confirm(`¿Estás seguro de eliminar ${serviceName}?`)) {
      try {
        await api.deleteCredential(id);
        await loadCredentials();
        toast.success('Credencial eliminada correctamente');
      } catch (err) {
        toast.error('Error al eliminar la credencial');
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    return date.toLocaleDateString();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  if (loading) {
    return (
      <div className="container-full">
        <div className="page-header">
          <h1>Mis Credenciales</h1>
          <p>Gestiona todas tus contraseñas de forma segura</p>
        </div>
        <LoadingSkeleton type="card" count={3} />
      </div>
    );
  }

  return (
    <div className="container-full">
      <div className="page-header">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}
        >
          <div>
            <h1>Mis Credenciales</h1>
            <p>Gestiona todas tus contraseñas de forma segura</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={toggleTheme}
              className="btn"
              style={{ 
                background: 'var(--light)', 
                color: 'var(--dark)', 
                padding: '0.5rem',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              aria-label="Cambiar tema"
            >
              <Key size={16} />
            </button>
            <span style={{ color: 'rgba(255,255,255,0.9)', fontWeight: '500' }}>Hola, {user.name}</span>
            <Link 
              to="/crear" 
              className="btn btn-success"
              style={{ padding: '0.75rem 1.5rem' }}
            >
              <Plus size={20} />
              Nueva Credencial
            </Link>
            <button 
              onClick={logout}
              className="btn btn-danger"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem' }}
            >
              <LogOut size={16} />
              Cerrar Sesión
            </button>
          </div>
        </motion.div>
      </div>

      {error && (
        <motion.div 
          className="error-message"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <AlertCircle size={20} />
          {error}
        </motion.div>
      )}

      <motion.div 
        className="search-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Search className="search-icon" size={20} />
        <input
          type="text"
          className="search-input"
          placeholder="Buscar por nombre del servicio..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </motion.div>

      {filteredCredentials.length === 0 ? (
        <motion.div 
          className="card card-sm"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ textAlign: 'center', padding: '3rem 2rem' }}
        >
          <Key size={64} color="#9ca3af" style={{ marginBottom: '1rem' }} />
          <h3 style={{ color: '#4b5563', marginBottom: '0.5rem' }}>
            No hay credenciales para mostrar
          </h3>
          <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
            Comienza agregando tu primera credencial
          </p>
          <Link to="/crear" className="btn btn-primary">
            <Plus size={18} />
            Agregar Credencial
          </Link>
        </motion.div>
      ) : (
        <motion.div 
          className="credential-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <AnimatePresence>
            {filteredCredentials.map((cred, index) => (
              <motion.div
                key={cred.id}
                variants={itemVariants}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -5 }}
                className="credential-card"
              >
                <div className="credential-header">
                  <span className="credential-service">{cred.serviceName}</span>
                  <span className="badge badge-primary">
                    <Clock size={12} style={{ marginRight: '4px' }} />
                    {formatDate(cred.lastUpdated)}
                  </span>
                </div>
                
                <div className="credential-username">
                  <Mail size={16} />
                  {cred.accountUsername}
                </div>
                
                {cred.url && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem' }}>
                    <Globe size={16} />
                    <a 
                      href={cred.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: 'var(--primary)', textDecoration: 'none' }}
                    >
                      {cred.url.replace(/(^\w+:|^)\/\//, '').split('/')[0]}
                    </a>
                  </div>
                )}
                
                <div className="credential-password">
                  <Key size={16} />
                  <span style={{ fontFamily: 'monospace' }}>••••••••</span>
                </div>
                
                <div className="credential-actions">
                  <Link 
                    to={`/detalle/${cred.id}`}
                    className="action-button view tooltip"
                    data-tooltip="Ver detalles"
                  >
                    <Eye size={18} />
                  </Link>
                  <Link 
                    to={`/editar/${cred.id}`}
                    className="action-button edit tooltip"
                    data-tooltip="Editar"
                  >
                    <Edit size={18} />
                  </Link>
                  <button
                    onClick={() => handleDelete(cred.id, cred.serviceName)}
                    className="action-button delete tooltip"
                    data-tooltip="Eliminar"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default CredentialList;