import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api';
import { Save, ArrowLeft, Eye, EyeOff, AlertCircle, Check } from 'lucide-react';
import LoadingSkeleton from './LoadingSkeleton';
import { validateField, validateForm, getPasswordStrength } from '../utils/validation';
import toast from 'react-hot-toast';

const CredentialForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    serviceName: '',
    accountUsername: '',
    password: '',
    url: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isEditing) {
      loadCredential();
    }
  }, [id]);

  const loadCredential = async () => {
    try {
      setLoading(true);
      const data = await api.getCredentialById(id);
      setFormData({
        serviceName: data.serviceName || '',
        accountUsername: data.accountUsername || '',
        password: data.password || '',
        url: data.url || '',
        notes: data.notes || ''
      });
    } catch (err) {
      setError('Error al cargar la credencial');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Real-time validation
    if (touched[name]) {
      const errors = validateField(name, value, formData);
      setFieldErrors(prev => ({
        ...prev,
        [name]: errors[name] || ''
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const errors = validateField(name, formData[name], formData);
    setFieldErrors(prev => ({
      ...prev,
      [name]: errors[name] || ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Mark all fields as touched
    const allFields = Object.keys(formData);
    setTouched(prev => {
      const newTouched = {};
      allFields.forEach(field => {
        newTouched[field] = true;
      });
      return newTouched;
    });

    // Validate all fields
    const errors = validateForm(formData);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      setError('Por favor, corrige los errores en el formulario');
      return;
    }

    try {
      setLoading(true);
      if (isEditing) {
        await api.updateCredential(id, formData);
      } else {
        await api.createCredential(formData);
      }
      navigate('/');
    } catch (err) {
      setError(`Error al ${isEditing ? 'actualizar' : 'crear'} la credencial`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) return <LoadingSkeleton type="form" />;

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="form-container">
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <button 
            onClick={() => navigate('/')} 
            className="btn" 
            style={{ background: 'var(--gray)', color: 'white', padding: '0.5rem 1rem' }}
          >
            <ArrowLeft size={16} />
          </button>
          <h1 style={{ color: 'var(--dark)', margin: 0 }}>{isEditing ? 'Editar Credencial' : 'Nueva Credencial'}</h1>
        </div>
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="serviceName">Servicio *</label>
            <input
              type="text"
              id="serviceName"
              name="serviceName"
              value={formData.serviceName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Ej: Netflix, Spotify, etc."
              disabled={loading}
              className={fieldErrors.serviceName ? 'error' : ''}
              aria-invalid={fieldErrors.serviceName ? 'true' : 'false'}
              aria-describedby={fieldErrors.serviceName ? 'serviceName-error' : ''}
            />
            {fieldErrors.serviceName && (
              <div className="field-error" id="serviceName-error">
                <AlertCircle size={14} />
                {fieldErrors.serviceName}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="accountUsername">Usuario/Email del servicio *</label>
            <input
              type="text"
              id="accountUsername"
              name="accountUsername"
              value={formData.accountUsername}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="usuario@email.com"
              disabled={loading}
              className={fieldErrors.accountUsername ? 'error' : ''}
              aria-invalid={fieldErrors.accountUsername ? 'true' : 'false'}
              aria-describedby={fieldErrors.accountUsername ? 'accountUsername-error' : ''}
            />
            {fieldErrors.accountUsername && (
              <div className="field-error" id="accountUsername-error">
                <AlertCircle size={14} />
                {fieldErrors.accountUsername}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña *</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="********"
                disabled={loading}
                className={fieldErrors.password ? 'error' : ''}
                aria-invalid={fieldErrors.password ? 'true' : 'false'}
                aria-describedby={fieldErrors.password ? 'password-error' : 'password-strength'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {formData.password && (
              <div className="password-strength" id="password-strength">
                <div className="strength-bar">
                  <div 
                    className="strength-fill" 
                    style={{ 
                      width: `${(passwordStrength.strength / 5) * 100}%`,
                      backgroundColor: passwordStrength.color 
                    }}
                  />
                </div>
                <span className="strength-text" style={{ color: passwordStrength.color }}>
                  {passwordStrength.text}
                </span>
              </div>
            )}
            {fieldErrors.password && (
              <div className="field-error" id="password-error">
                <AlertCircle size={14} />
                {fieldErrors.password}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="url">URL (opcional)</label>
            <input
              type="url"
              id="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="https://ejemplo.com"
              disabled={loading}
              className={fieldErrors.url ? 'error' : ''}
              aria-invalid={fieldErrors.url ? 'true' : 'false'}
              aria-describedby={fieldErrors.url ? 'url-error' : ''}
            />
            {fieldErrors.url && (
              <div className="field-error" id="url-error">
                <AlertCircle size={14} />
                {fieldErrors.url}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notas (opcional)</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              onBlur={handleBlur}
              rows="4"
              placeholder="Información adicional..."
              disabled={loading}
              className={fieldErrors.notes ? 'error' : ''}
              aria-invalid={fieldErrors.notes ? 'true' : 'false'}
              aria-describedby={fieldErrors.notes ? 'notes-error' : ''}
            />
            {fieldErrors.notes && (
              <div className="field-error" id="notes-error">
                <AlertCircle size={14} />
                {fieldErrors.notes}
              </div>
            )}
          </div>

          <div className="button-group">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ minWidth: '120px' }}
            >
              <Save size={16} />
              {loading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Guardar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CredentialForm;