import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import { UserPlus, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { getPasswordStrength } from "../utils/validation";
import toast from "react-hot-toast";
import styled from "styled-components";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      validateSingleField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateSingleField(name, formData[name]);
  };

  const validateSingleField = (name, value) => {
    let error = "";

    if (name === "email") {
      if (!value.trim()) error = "El email es obligatorio";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        error = "El email no es válido";
    }

    if (name === "password") {
      if (!value.trim()) error = "La contraseña es obligatoria";
      else if (value.length < 6)
        error = "La contraseña debe tener al menos 6 caracteres";
    }

    if (name === "confirmPassword") {
      if (!value.trim()) error = "Debes confirmar la contraseña";
      else if (value !== formData.password)
        error = "Las contraseñas no coinciden";
    }

    setFieldErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateRegisterForm = () => {
    const errors = {};

    if (!formData.email.trim()) errors.email = "El email es obligatorio";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errors.email = "El email no es válido";

    if (!formData.password.trim())
      errors.password = "La contraseña es obligatoria";
    else if (formData.password.length < 6)
      errors.password = "La contraseña debe tener al menos 6 caracteres";

    if (!formData.confirmPassword.trim())
      errors.confirmPassword = "Debes confirmar la contraseña";
    else if (formData.password !== formData.confirmPassword)
      errors.confirmPassword = "Las contraseñas no coinciden";

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    setTouched({ email: true, password: true, confirmPassword: true });

    const errors = validateRegisterForm();
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      setError("Por favor, corrige los errores en el formulario");
      return;
    }

    try {
      setLoading(true);
      const result = await register({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      if (result.success) {
        toast.success("¡Cuenta creada exitosamente!");
        navigate("/login");
      } else {
        setError(result.error || "Error al crear la cuenta");
        toast.error("No pudimos crear tu cuenta");
      }
    } catch (err) {
      setError("Error al crear la cuenta. Intenta nuevamente.");
      toast.error("Ocurrió un error inesperado");
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <Wrapper>
      <Card
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Header>
          <IconWrapper
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <UserPlus size={64} color="#8b5cf6" />
          </IconWrapper>
          <h1>Crear Cuenta</h1>
          <p>Únete a nuestro gestor de credenciales seguro</p>
        </Header>

        {error && (
          <ErrorMessage
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <AlertCircle size={20} />
            {error}
          </ErrorMessage>
        )}

        <form onSubmit={handleSubmit}>
          {/* EMAIL */}
          <FormGroup
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label htmlFor="email">Email *</label>
            <InputWrapper>
              <InputIcon>
                <Mail size={18} />
              </InputIcon>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="correo@ejemplo.com"
                disabled={loading}
                hasError={!!fieldErrors.email}
              />
            </InputWrapper>
            {fieldErrors.email && (
              <FieldError>
                <AlertCircle size={14} />
                {fieldErrors.email}
              </FieldError>
            )}
          </FormGroup>

          <FormGroup
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label htmlFor="password">Contraseña *</label>
            <InputWrapper>
              <InputIcon>
                <Lock size={18} />
              </InputIcon>
              <Input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Mínimo 6 caracteres"
                disabled={loading}
                hasError={!!fieldErrors.password}
              />
              <ToggleButton
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={
                  showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </ToggleButton>
            </InputWrapper>

            {formData.password && (
              <StrengthWrapper>
                <StrengthBar>
                  <StrengthFill
                    width={(passwordStrength.strength / 5) * 100}
                    color={passwordStrength.color}
                  />
                </StrengthBar>
                <StrengthText color={passwordStrength.color}>
                  {passwordStrength.text}
                </StrengthText>
              </StrengthWrapper>
            )}

            {fieldErrors.password && (
              <FieldError>
                <AlertCircle size={14} />
                {fieldErrors.password}
              </FieldError>
            )}
          </FormGroup>

          <FormGroup
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label htmlFor="confirmPassword">Confirmar Contraseña *</label>
            <InputWrapper>
              <InputIcon>
                <Lock size={18} />
              </InputIcon>
              <Input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Repite tu contraseña"
                disabled={loading}
                hasError={!!fieldErrors.confirmPassword}
              />
              <ToggleButton
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={
                  showConfirmPassword
                    ? "Ocultar contraseña"
                    : "Mostrar contraseña"
                }
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </ToggleButton>
            </InputWrapper>
            {fieldErrors.confirmPassword && (
              <FieldError>
                <AlertCircle size={14} />
                {fieldErrors.confirmPassword}
              </FieldError>
            )}
          </FormGroup>

          <SubmitButton
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {loading ? (
              <>
                <Spinner />
                Creando cuenta...
              </>
            ) : (
              <>
                <UserPlus size={18} />
                Crear Cuenta
              </>
            )}
          </SubmitButton>
        </form>

        <Footer>
          <p>
            ¿Ya tienes cuenta?{" "}
            <LinkButton onClick={() => navigate("/login")}>
              Inicia Sesión
            </LinkButton>
          </p>
        </Footer>
      </Card>
    </Wrapper>
  );
}

export default Register;

// ─── Styled Components ────────────────────────────────────────────────────────

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 80px);
  padding: 1rem;
  background: #f5f3ff;
`;

const Card = styled(motion.div)`
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-radius: 1.5rem;
  padding: 2.5rem;
  width: 100%;
  max-width: 400px;
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #8b5cf6, #ec4899);
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;

  h1 {
    font-size: 2rem;
    color: #1f2937;
    margin-bottom: 0.5rem;
    font-weight: 700;
  }

  p {
    color: #6b7280;
    margin: 0;
    font-size: 0.95rem;
  }
`;

const IconWrapper = styled(motion.div)`
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
`;

const ErrorMessage = styled(motion.div)`
  background: linear-gradient(135deg, #fee2e2, #fecaca);
  color: #991b1b;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  border-left: 4px solid #ef4444;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
`;

const FormGroup = styled(motion.div)`
  margin-bottom: 1.5rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #1f2937;
    font-size: 0.875rem;
  }
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const InputIcon = styled.span`
  position: absolute;
  left: 12px;
  display: flex;
  align-items: center;
  color: #9ca3af;
  pointer-events: none;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 2.75rem;
  border: 2px solid ${({ hasError }) => (hasError ? "#ef4444" : "#e5e7eb")};
  border-radius: 0.5rem;
  font-size: 1rem;
  background: #ffffff;
  color: #1f2937;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
  box-sizing: border-box;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    outline: none;
    border-color: ${({ hasError }) => (hasError ? "#ef4444" : "#8b5cf6")};
    box-shadow: 0 0 0 3px
      ${({ hasError }) =>
        hasError ? "rgba(239, 68, 68, 0.15)" : "rgba(139, 92, 246, 0.15)"};
  }

  &:disabled {
    background: #f3f4f6;
    cursor: not-allowed;
    opacity: 0.7;
  }

  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus {
    -webkit-text-fill-color: #1f2937;
    -webkit-box-shadow: 0 0 0px 1000px #ffffff inset;
    transition: background-color 5000s ease-in-out 0s;
  }
`;

const ToggleButton = styled.button`
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  display: flex;
  align-items: center;
  padding: 0;

  &:hover {
    color: #6b7280;
  }
`;

const StrengthWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const StrengthBar = styled.div`
  flex: 1;
  height: 4px;
  background: #e5e7eb;
  border-radius: 9999px;
  overflow: hidden;
`;

const StrengthFill = styled.div`
  height: 100%;
  width: ${({ width }) => width}%;
  background-color: ${({ color }) => color};
  border-radius: 9999px;
  transition: width 0.3s ease;
`;

const StrengthText = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${({ color }) => color};
`;

const FieldError = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #ef4444;
  font-size: 0.8rem;
  margin-top: 0.4rem;
`;

const SubmitButton = styled(motion.button)`
  width: 100%;
  padding: 1rem;
  margin-top: 1rem;
  border: none;
  border-radius: 0.5rem;
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  color: #ffffff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(139, 92, 246, 0.4);

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Spinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const Footer = styled.div`
  margin-top: 1.5rem;
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;

  p {
    color: #6b7280;
    font-size: 0.875rem;
    margin: 0;
  }
`;

const LinkButton = styled.button`
  background: none;
  border: none;
  color: #8b5cf6;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.875rem;
  text-decoration: underline;
  transition: color 0.2s ease;

  &:hover {
    color: #7c3aed;
  }
`;
