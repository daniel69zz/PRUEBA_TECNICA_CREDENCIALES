// Form validation utilities
export const validateField = (name, value, formData) => {
  const errors = {};

  switch (name) {
    case 'serviceName':
      if (!value.trim()) {
        errors.serviceName = 'El nombre del servicio es obligatorio';
      } else if (value.length < 2) {
        errors.serviceName = 'El nombre debe tener al menos 2 caracteres';
      } else if (value.length > 100) {
        errors.serviceName = 'El nombre no puede exceder 100 caracteres';
      }
      break;

    case 'accountUsername':
      if (!value.trim()) {
        errors.accountUsername = 'El usuario o email es obligatorio';
      } else if (value.length < 2) {
        errors.accountUsername = 'Debe tener al menos 2 caracteres';
      } else if (value.length > 255) {
        errors.accountUsername = 'No puede exceder 255 caracteres';
      }
      break;

    case 'password':
      if (!value.trim()) {
        errors.password = 'La contraseña es obligatoria';
      } else if (value.length < 4) {
        errors.password = 'La contraseña debe tener al menos 4 caracteres';
      } else if (value.length > 255) {
        errors.password = 'La contraseña no puede exceder 255 caracteres';
      }
      break;

    case 'name':
      if (!value.trim()) {
        errors.name = 'El nombre es obligatorio';
      } else if (value.length < 2) {
        errors.name = 'El nombre debe tener al menos 2 caracteres';
      } else if (value.length > 50) {
        errors.name = 'El nombre no puede exceder 50 caracteres';
      }
      break;

    case 'email':
      if (!value.trim()) {
        errors.email = 'El email es obligatorio';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errors.email = 'El email no es válido';
      } else if (value.length > 255) {
        errors.email = 'El email no puede exceder 255 caracteres';
      }
      break;

    case 'confirmPassword':
      if (!value.trim()) {
        errors.confirmPassword = 'Debes confirmar la contraseña';
      } else if (formData.password && value !== formData.password) {
        errors.confirmPassword = 'Las contraseñas no coinciden';
      }
      break;

    case 'url':
      if (value && !isValidUrl(value)) {
        errors.url = 'La URL no es válida (ej: https://ejemplo.com)';
      }
      break;

    case 'notes':
      if (value && value.length > 1000) {
        errors.notes = 'Las notas no pueden exceder 1000 caracteres';
      }
      break;

    default:
      break;
  }

  return errors;
};

export const validateForm = (formData) => {
  const errors = {};
  
  // Validate all fields
  Object.keys(formData).forEach(field => {
    const fieldErrors = validateField(field, formData[field], formData);
    Object.assign(errors, fieldErrors);
  });

  return errors;
};

export const isValidUrl = (string) => {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
};

export const getPasswordStrength = (password) => {
  if (!password) return { strength: 0, text: '', color: '' };
  
  let strength = 0;
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    numbers: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  strength = Object.values(checks).filter(Boolean).length;

  const strengthLevels = {
    0: { text: 'Muy débil', color: '#ef4444' },
    1: { text: 'Débil', color: '#f59e0b' },
    2: { text: 'Regular', color: '#eab308' },
    3: { text: 'Buena', color: '#84cc16' },
    4: { text: 'Fuerte', color: '#22c55e' },
    5: { text: 'Muy fuerte', color: '#10b981' }
  };

  return {
    strength,
    ...strengthLevels[strength],
    checks
  };
};
