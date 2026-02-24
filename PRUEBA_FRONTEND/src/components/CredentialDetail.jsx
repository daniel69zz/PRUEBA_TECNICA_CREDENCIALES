import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Eye, EyeOff, Edit, ArrowLeft, Globe, FileText, Key, Mail, Clock } from 'lucide-react';

const CredentialDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [credential, setCredential] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    loadCredential();
  }, [id]);

  const loadCredential = async () => {
    try {
      setLoading(true);
      const data = await api.getCredentialById(id);
      setCredential(data);
    } catch (err) {
      setError('Error al cargar la credencial');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p className="loading-text">Cargando detalle...</p>
    </div>
  );
  
  if (error) return <div className="error-message">{error}</div>;
  if (!credential) return <div className="error-message">Credencial no encontrada</div>;

  return (
    <div className="detail-container">
      <div className="detail-card">
        <div className="detail-header">
          <button 
            onClick={() => navigate('/')} 
            className="btn" 
            style={{ background: 'var(--gray)', color: 'white', padding: '0.5rem 1rem' }}
          >
            <ArrowLeft size={16} />
          </button>
          <h1>Detalle de Credencial</h1>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="form-group">
            <label>Servicio</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', background: 'var(--light)', borderRadius: 'var(--radius-md)' }}>
              <Globe size={20} color="var(--primary)" />
              <span style={{ fontSize: '1.1rem', fontWeight: '500' }}>{credential.serviceName}</span>
            </div>
          </div>

          <div className="form-group">
            <label>Usuario/Email</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', background: 'var(--light)', borderRadius: 'var(--radius-md)' }}>
              <Mail size={20} color="var(--primary)" />
              <span>{credential.accountUsername}</span>
            </div>
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', background: 'var(--light)', borderRadius: 'var(--radius-md)' }}>
              <Key size={20} color="var(--primary)" />
              <span style={{ flex: 1, fontFamily: 'monospace' }}>
                {showPassword ? credential.password : '•'.repeat(credential.password?.length || 8)}
              </span>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="btn"
                style={{ background: 'var(--primary)', color: 'white', padding: '0.5rem' }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {credential.url && (
            <div className="form-group">
              <label>URL</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', background: 'var(--light)', borderRadius: 'var(--radius-md)' }}>
                <Globe size={20} color="var(--primary)" />
                <a 
                  href={credential.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: 'var(--primary)', textDecoration: 'none' }}
                >
                  {credential.url}
                </a>
              </div>
            </div>
          )}

          {credential.notes && (
            <div className="form-group">
              <label>Notas</label>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', padding: '0.75rem', background: 'var(--light)', borderRadius: 'var(--radius-md)' }}>
                <FileText size={20} color="var(--primary)" style={{ marginTop: '2px' }} />
                <span>{credential.notes}</span>
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Fecha de creación</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', background: 'var(--light)', borderRadius: 'var(--radius-md)' }}>
              <Clock size={20} color="var(--gray)" />
              <span style={{ color: 'var(--gray)' }}>{formatDate(credential.createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="button-group">
          <button
            onClick={() => navigate(`/editar/${id}`)}
            className="btn btn-primary"
          >
            <Edit size={16} />
            Editar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CredentialDetail;