import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { api2 } from "../services/api2";
import {
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Globe,
  Clock,
  Key,
  Mail,
  AlertCircle,
  LogOut,
} from "lucide-react";
import LoadingSkeleton from "./LoadingSkeleton";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import toast from "react-hot-toast";
import styled, { css } from "styled-components";

// ─── Component ────────────────────────────────────────────────────────────────

const CredentialList = () => {
  const [credentials, setCredentials] = useState([]);
  const [filteredCredentials, setFilteredCredentials] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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
      const data = await api2.getCredentials();
      setCredentials(data);
      setFilteredCredentials(data);
    } catch (err) {
      setError("Error al cargar las credenciales");
      toast.error("No pudimos cargar tus credenciales");
    } finally {
      setLoading(false);
    }
  };

  const filterCredentials = () => {
    if (!searchTerm.trim()) {
      setFilteredCredentials(credentials);
    } else {
      const filtered = credentials.filter((cred) =>
        cred.serviceName.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredCredentials(filtered);
    }
  };

  const handleDelete = async (id, serviceName) => {
    if (window.confirm(`¿Estás seguro de eliminar ${serviceName}?`)) {
      try {
        await api2.deleteCredential(id);
        await loadCredentials();
        toast.success("Credencial eliminada correctamente");
      } catch (err) {
        toast.error("Error al eliminar la credencial");
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.ceil(Math.abs(now - date) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Hoy";
    if (diffDays === 1) return "Ayer";
    if (diffDays < 7) return `Hace ${diffDays} días`;
    return date.toLocaleDateString();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  if (loading) {
    return (
      <ContainerFull>
        <PageHeader>
          <h1>Mis Credenciales</h1>
          <p>Gestiona todas tus contraseñas de forma segura</p>
        </PageHeader>
        <LoadingSkeleton type="card" count={3} />
      </ContainerFull>
    );
  }

  return (
    <ContainerFull>
      <PageHeader>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <HeaderInner>
            <HeaderText>
              <h1>Mis Credenciales</h1>
              <p>Gestiona todas tus contraseñas de forma segura</p>
            </HeaderText>
            <HeaderActions>
              <ThemeButton onClick={toggleTheme} aria-label="Cambiar tema">
                <Key size={16} />
              </ThemeButton>
              <GreetingText>Hola, {user.name}</GreetingText>
              <NewCredentialLink to="/credentials">
                <Plus size={20} />
                Nueva Credencial
              </NewCredentialLink>
              <LogoutButton onClick={logout}>
                <LogOut size={16} />
                Cerrar Sesión
              </LogoutButton>
            </HeaderActions>
          </HeaderInner>
        </motion.div>
      </PageHeader>

      {error && (
        <ErrorMessage
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <AlertCircle size={20} />
          {error}
        </ErrorMessage>
      )}

      <SearchContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <SearchIcon size={20} />
        <SearchInput
          type="text"
          placeholder="Buscar por nombre del servicio..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SearchContainer>

      {filteredCredentials.length === 0 ? (
        <EmptyCard
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Key size={64} color="#9ca3af" style={{ marginBottom: "1rem" }} />
          <EmptyTitle>No hay credenciales para mostrar</EmptyTitle>
          <EmptySubtitle>
            Comienza agregando tu primera credencial
          </EmptySubtitle>
          <AddCredentialLink to="/crear">
            <Plus size={18} />
            Agregar Credencial
          </AddCredentialLink>
        </EmptyCard>
      ) : (
        <CredentialGrid
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <AnimatePresence>
            {filteredCredentials.map((cred, index) => (
              <CredentialCard
                key={index}
                variants={itemVariants}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -5 }}
              >
                <CredentialHeader>
                  <ServiceName>{cred.service_name}</ServiceName>
                  <DateBadge>
                    <Clock size={12} style={{ marginRight: "4px" }} />
                    {formatDate(cred.updated_at)}
                  </DateBadge>
                </CredentialHeader>

                <UsernameRow>
                  <Mail size={16} />
                  {cred.accountUsername}
                </UsernameRow>

                {cred.url && (
                  <UrlRow>
                    <Globe size={16} />
                    <UrlLink
                      href={cred.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {cred.url.replace(/(^\w+:|^)\/\//, "").split("/")[0]}
                    </UrlLink>
                  </UrlRow>
                )}

                <PasswordRow>
                  <Key size={16} />
                  <PasswordMask>••••••••</PasswordMask>
                </PasswordRow>

                <ActionsRow>
                  <ActionLink
                    to={`/credentials/${cred.id_credential}`}
                    $variant="view"
                    data-tooltip="Ver detalles"
                  >
                    <Eye size={18} />
                  </ActionLink>
                  <ActionLink
                    to={`/credentials/${cred.id_credential}`}
                    $variant="edit"
                    data-tooltip="Editar"
                  >
                    <Edit size={18} />
                  </ActionLink>
                  <ActionButton
                    onClick={() =>
                      handleDelete(cred.id_credential, cred.service_name)
                    }
                    $variant="delete"
                    data-tooltip="Eliminar"
                  >
                    <Trash2 size={18} />
                  </ActionButton>
                </ActionsRow>
              </CredentialCard>
            ))}
          </AnimatePresence>
        </CredentialGrid>
      )}
    </ContainerFull>
  );
};

export default CredentialList;

// ─── Styled Components ────────────────────────────────────────────────────────

const ContainerFull = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
`;

const PageHeader = styled.div`
  background: linear-gradient(
    135deg,
    var(--primary, #6366f1),
    var(--primary-dark, #4f46e5)
  );
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  color: white;

  h1 {
    margin: 0 0 0.25rem;
    font-size: 1.75rem;
    font-weight: 700;
  }

  p {
    margin: 0;
    opacity: 0.85;
    font-size: 0.95rem;
  }
`;

const HeaderInner = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const HeaderText = styled.div``;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const GreetingText = styled.span`
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  white-space: nowrap;
`;

const baseButtonStyles = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition:
    opacity 0.2s,
    transform 0.1s;
  text-decoration: none;

  &:hover {
    opacity: 0.88;
    transform: translateY(-1px);
  }
`;

const ThemeButton = styled.button`
  ${baseButtonStyles}
  background: var(--light, #f3f4f6);
  color: var(--dark, #111827);
  padding: 0;
  border-radius: 50%;
  width: 40px;
  height: 40px;
`;

const NewCredentialLink = styled(Link)`
  ${baseButtonStyles}
  background: #22c55e;
  color: white;
  padding: 0.75rem 1.5rem;
`;

const LogoutButton = styled.button`
  ${baseButtonStyles}
  background: #ef4444;
  color: white;
  padding: 0.75rem 1.5rem;
`;

const ErrorMessage = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #fee2e2;
  color: #dc2626;
  border: 1px solid #fca5a5;
  border-radius: 10px;
  padding: 0.85rem 1rem;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
`;

const SearchContainer = styled(motion.div)`
  position: relative;
  margin-bottom: 1.75rem;
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  font-size: 0.95rem;
  background: white;
  color: var(--dark, #111827);
  box-sizing: border-box;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    outline: none;
    border-color: var(--primary, #6366f1);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
  }
`;

const EmptyCard = styled(motion.div)`
  background: white;
  border-radius: 14px;
  padding: 3rem 2rem;
  text-align: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.07);
`;

const EmptyTitle = styled.h3`
  color: #4b5563;
  margin: 0 0 0.5rem;
  font-size: 1.1rem;
`;

const EmptySubtitle = styled.p`
  color: #6b7280;
  margin: 0 0 2rem;
  font-size: 0.95rem;
`;

const AddCredentialLink = styled(Link)`
  ${baseButtonStyles}
  background: var(--primary, #6366f1);
  color: white;
  padding: 0.7rem 1.5rem;
`;

const CredentialGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.25rem;
`;

const CredentialCard = styled(motion.div)`
  background: #1e1b1b;
  border-radius: 14px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.07);
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  }
`;

const CredentialHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.85rem;
`;

const ServiceName = styled.span`
  font-weight: 700;
  font-size: 1.05rem;
  color: var(--dark, #111827);
`;

const DateBadge = styled.span`
  display: inline-flex;
  align-items: center;
  background: #ede9fe;
  color: #6d28d9;
  border-radius: 99px;
  padding: 0.25rem 0.65rem;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
`;

const UsernameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4b5563;
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
`;

const UrlRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

const UrlLink = styled.a`
  color: var(--primary, #6366f1);
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const PasswordRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4b5563;
  font-size: 0.9rem;
  margin-bottom: 1.25rem;
`;

const PasswordMask = styled.span`
  font-family: monospace;
  letter-spacing: 2px;
`;

const ActionsRow = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const actionVariantStyles = {
  view: css`
    background: #ede9fe;
    color: #6d28d9;
    &:hover {
      background: #ddd6fe;
    }
  `,
  edit: css`
    background: #dbeafe;
    color: #1d4ed8;
    &:hover {
      background: #bfdbfe;
    }
  `,
  delete: css`
    background: #fee2e2;
    color: #dc2626;
    &:hover {
      background: #fecaca;
    }
  `,
};

const actionBase = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  text-decoration: none;
  transition:
    background 0.2s,
    transform 0.1s;
  position: relative;

  &:hover {
    transform: translateY(-1px);
  }

  /* Tooltip */
  &[data-tooltip]::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: calc(100% + 6px);
    left: 50%;
    transform: translateX(-50%);
    background: #1f2937;
    color: white;
    font-size: 0.72rem;
    padding: 0.3rem 0.6rem;
    border-radius: 6px;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s;
  }

  &[data-tooltip]:hover::after {
    opacity: 1;
  }

  ${({ $variant }) => actionVariantStyles[$variant]}
`;

const ActionLink = styled(Link)`
  ${actionBase}
`;

const ActionButton = styled.button`
  ${actionBase}
`;
