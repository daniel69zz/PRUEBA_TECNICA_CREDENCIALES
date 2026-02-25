import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api2 } from "../services/api2";
import {
  Eye,
  EyeOff,
  Edit,
  ArrowLeft,
  Globe,
  FileText,
  Key,
  Mail,
  Clock,
} from "lucide-react";
import styled from "styled-components";

function CredentialDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [credential, setCredential] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState(null);
  const [loadingPassword, setLoadingPassword] = useState(false);

  useEffect(() => {
    loadCredential();
  }, [id]);

  const loadCredential = async () => {
    try {
      setLoading(true);
      const data = await api2.getCredentialById(id);
      setCredential(data);
    } catch (err) {
      setError("Error al cargar la credencial");
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePassword = async () => {
    if (!showPassword && !password) {
      try {
        setLoadingPassword(true);
        const data = await api2.getPassword(id);
        setPassword(data.password);
      } catch (err) {
        setError("Error al revelar la contraseña");
        return;
      } finally {
        setLoadingPassword(false);
      }
    }
    setShowPassword((prev) => !prev);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading)
    return (
      <LoadingContainer>
        <Spinner />
        <LoadingText>Cargando detalle...</LoadingText>
      </LoadingContainer>
    );

  if (error) return <ErrorMessage>{error}</ErrorMessage>;
  if (!credential) return <ErrorMessage>Credencial no encontrada</ErrorMessage>;

  return (
    <Container>
      <Card>
        <Header>
          <BackButton onClick={() => navigate("/")}>
            <ArrowLeft size={16} />
          </BackButton>
          <h1>Detalle de Credencial</h1>
        </Header>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <FieldsWrapper>
          <FormGroup>
            <label>Servicio</label>
            <FieldBox>
              <Globe size={20} color="var(--primary)" />
              <ServiceText>{credential.service_name}</ServiceText>
            </FieldBox>
          </FormGroup>

          <FormGroup>
            <label>Usuario/Email</label>
            <FieldBox>
              <Mail size={20} color="var(--primary)" />
              <FieldText>{credential.account_username}</FieldText>
            </FieldBox>
          </FormGroup>

          <FormGroup>
            <label>Contraseña</label>
            <FieldBox>
              <Key size={20} color="var(--primary)" />
              <PasswordText>
                {showPassword && password ? password : "•".repeat(8)}
              </PasswordText>
              <TogglePasswordButton
                type="button"
                onClick={handleTogglePassword}
                disabled={loadingPassword}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </TogglePasswordButton>
            </FieldBox>
          </FormGroup>

          {credential.url && (
            <FormGroup>
              <label>URL</label>
              <FieldBox>
                <Globe size={20} color="var(--primary)" />
                <UrlLink
                  href={credential.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {credential.url}
                </UrlLink>
              </FieldBox>
            </FormGroup>
          )}

          {credential.notes && (
            <FormGroup>
              <label>Notas</label>
              <FieldBox alignStart>
                <FileText
                  size={20}
                  color="var(--primary)"
                  style={{ marginTop: "2px" }}
                />
                <FieldText>{credential.notes}</FieldText>
              </FieldBox>
            </FormGroup>
          )}

          <FormGroup>
            <label>Fecha de creación</label>
            <FieldBox>
              <Clock size={20} color="var(--gray)" />
              <GrayText>{formatDate(credential.created_at)}</GrayText>
            </FieldBox>
          </FormGroup>
        </FieldsWrapper>

        <ButtonGroup>
          <EditButton onClick={() => navigate(`/credentials/${id}`)}>
            <Edit size={16} />
            Editar
          </EditButton>
        </ButtonGroup>
      </Card>
    </Container>
  );
}

export default CredentialDetail;

// ─── Styled Components ────────────────────────────────────────────────────────

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  background: var(--background);
`;

const Card = styled.div`
  background: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  padding: 2rem;
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  h1 {
    font-size: 1.4rem;
    font-weight: 600;
    color: var(--dark);
    margin: 0;
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gray);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.85;
  }
`;

const FieldsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  label {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--gray);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
`;

const FieldBox = styled.div`
  display: flex;
  align-items: ${({ alignStart }) => (alignStart ? "flex-start" : "center")};
  gap: 0.5rem;
  padding: 0.75rem;
  background: var(--light);
  border-radius: var(--radius-md);
`;

const FieldText = styled.span`
  font-size: 1rem;
  color: var(--dark);
`;

const ServiceText = styled(FieldText)`
  font-size: 1.1rem;
  font-weight: 500;
`;

const PasswordText = styled(FieldText)`
  flex: 1;
  font-family: monospace;
  letter-spacing: 0.05em;
`;

const GrayText = styled(FieldText)`
  color: var(--gray);
`;

const UrlLink = styled.a`
  color: var(--primary);
  text-decoration: none;
  font-size: 1rem;

  &:hover {
    text-decoration: underline;
  }
`;

const TogglePasswordButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  padding: 0.5rem;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.85;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 0.5rem;
`;

const EditButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.85;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 1rem;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid var(--light);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  color: var(--gray);
  font-size: 1rem;
`;

const ErrorMessage = styled.div`
  color: var(--danger);
  background: var(--danger-light, #fdecea);
  border-radius: var(--radius-md);
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
`;
