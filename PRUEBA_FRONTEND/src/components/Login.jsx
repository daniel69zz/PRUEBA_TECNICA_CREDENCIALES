import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import { LogIn, Mail, Lock, Key } from "lucide-react";
import toast from "react-hot-toast";
import styled from "styled-components";

import logo from "/logo_key_sn.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    if (!email.trim() || !password.trim()) {
      setError("Todos los campos son obligatorios");
      return false;
    }
    if (!email.includes("@")) {
      setError("El email no es válido");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    const result = await login(email, password);

    if (result.success) {
      toast.success("¡Bienvenido de vuelta!");
      navigate("/");
    } else {
      setError(result.error || "Error al iniciar sesión");
      toast.error("Credenciales incorrectas");
    }
  };

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
            <img src={logo} alt="logo" />
          </IconWrapper>
          <h1>TECNOVISION</h1>
          <p>Tu agenda segura de contraseñas</p>
        </Header>

        {error && (
          <ErrorMessage
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {error}
          </ErrorMessage>
        )}

        <form onSubmit={handleSubmit}>
          <FormGroup
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label>Email</label>
            <InputWrapper>
              <InputIcon>
                <Mail size={18} />
              </InputIcon>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="demo@example.com"
                disabled={loading}
              />
            </InputWrapper>
          </FormGroup>

          <FormGroup
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label>Contraseña</label>
            <InputWrapper>
              <InputIcon>
                <Lock size={18} />
              </InputIcon>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                disabled={loading}
              />
            </InputWrapper>
          </FormGroup>

          <SubmitButton
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {loading ? (
              <>
                <Spinner />
                Iniciando sesión...
              </>
            ) : (
              <>
                <LogIn size={18} />
                Ingresar
              </>
            )}
          </SubmitButton>
        </form>

        <Footer>
          <RegisterSection
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <p>¿No tienes cuenta?</p>
            <LinkButton onClick={() => navigate("/register")}>
              Regístrate gratis
            </LinkButton>
          </RegisterSection>
        </Footer>
      </Card>
    </Wrapper>
  );
}

export default Login;

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

  img {
    height: 140px;
    transform: rotate(320deg);
  }
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
  padding: 0.75rem 1rem 0.75rem 2.75rem;
  border: 2px solid #e5e7eb;
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
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15);
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
`;

const DemoText = styled(motion.p)`
  text-align: center;
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

const RegisterSection = styled(motion.div)`
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;

  p {
    color: #6b7280;
    margin: 0 0 0.5rem 0;
    font-size: 0.875rem;
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
