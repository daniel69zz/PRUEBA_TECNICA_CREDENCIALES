import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api2 } from "../services/api2";
import { Save, ArrowLeft, Eye, EyeOff, AlertCircle } from "lucide-react";
import LoadingSkeleton from "./LoadingSkeleton";
import {
  validateField,
  validateForm,
  getPasswordStrength,
} from "../utils/validation";
import toast from "react-hot-toast";
import styled, { css } from "styled-components";

function CredentialForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    serviceName: "",
    accountUsername: "",
    password: "",
    url: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isEditing) loadCredential();
  }, [id]);

  const loadCredential = async () => {
    try {
      setLoading(true);
      const data = await api2.getCredentialById(id);
      setFormData({
        serviceName: data.serviceName || "",
        accountUsername: data.accountUsername || "",
        password: data.password || "",
        url: data.url || "",
        notes: data.notes || "",
      });
    } catch (err) {
      setError("Error al cargar la credencial");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const errors = validateField(name, value, formData);
      setFieldErrors((prev) => ({ ...prev, [name]: errors[name] || "" }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const errors = validateField(name, formData[name], formData);
    setFieldErrors((prev) => ({ ...prev, [name]: errors[name] || "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const allFields = Object.keys(formData);
    setTouched(() => Object.fromEntries(allFields.map((f) => [f, true])));

    const errors = validateForm(formData);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      setError("Por favor, corrige los errores en el formulario");
      return;
    }

    try {
      setLoading(true);
      if (isEditing) {
        await api2.updateCredential(id, formData);
        toast.success("Credencial actualizada");
      } else {
        await api2.createCredential(formData);
        toast.success("Credencial creada");
      }
      navigate("/");
    } catch (err) {
      setError(`Error al ${isEditing ? "actualizar" : "crear"} la credencial`);
      toast.error("Ocurrió un error inesperado");
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) return <LoadingSkeleton type="form" />;

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <FormContainer>
      <Card>
        <CardHeader>
          <BackButton onClick={() => navigate("/")}>
            <ArrowLeft size={16} />
          </BackButton>
          <PageTitle>
            {isEditing ? "Editar Credencial" : "Nueva Credencial"}
          </PageTitle>
        </CardHeader>

        {error && (
          <ErrorMessage>
            <AlertCircle size={16} />
            {error}
          </ErrorMessage>
        )}

        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="serviceName">Servicio *</Label>
            <Input
              type="text"
              id="serviceName"
              name="serviceName"
              value={formData.serviceName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Ej: Netflix, Spotify, etc."
              disabled={loading}
              $hasError={!!fieldErrors.serviceName}
              aria-invalid={!!fieldErrors.serviceName}
              aria-describedby={
                fieldErrors.serviceName ? "serviceName-error" : undefined
              }
            />
            {fieldErrors.serviceName && (
              <FieldError id="serviceName-error">
                <AlertCircle size={14} />
                {fieldErrors.serviceName}
              </FieldError>
            )}
          </FormGroup>

          {/* Usuario */}
          <FormGroup>
            <Label htmlFor="accountUsername">
              Usuario/Email del servicio *
            </Label>
            <Input
              type="text"
              id="accountUsername"
              name="accountUsername"
              value={formData.accountUsername}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="usuario@email.com"
              disabled={loading}
              $hasError={!!fieldErrors.accountUsername}
              aria-invalid={!!fieldErrors.accountUsername}
              aria-describedby={
                fieldErrors.accountUsername
                  ? "accountUsername-error"
                  : undefined
              }
            />
            {fieldErrors.accountUsername && (
              <FieldError id="accountUsername-error">
                <AlertCircle size={14} />
                {fieldErrors.accountUsername}
              </FieldError>
            )}
          </FormGroup>

          {/* Contraseña */}
          <FormGroup>
            <Label htmlFor="password">Contraseña *</Label>
            <PasswordInputWrapper>
              <PasswordInput
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="********"
                disabled={loading}
                $hasError={!!fieldErrors.password}
                aria-invalid={!!fieldErrors.password}
                aria-describedby={
                  fieldErrors.password ? "password-error" : "password-strength"
                }
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={
                  showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </PasswordToggle>
            </PasswordInputWrapper>

            {formData.password && (
              <PasswordStrength id="password-strength">
                <StrengthBar>
                  <StrengthFill
                    $percent={(passwordStrength.strength / 5) * 100}
                    $color={passwordStrength.color}
                  />
                </StrengthBar>
                <StrengthText $color={passwordStrength.color}>
                  {passwordStrength.text}
                </StrengthText>
              </PasswordStrength>
            )}

            {fieldErrors.password && (
              <FieldError id="password-error">
                <AlertCircle size={14} />
                {fieldErrors.password}
              </FieldError>
            )}
          </FormGroup>

          {/* URL */}
          <FormGroup>
            <Label htmlFor="url">URL (opcional)</Label>
            <Input
              type="url"
              id="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="https://ejemplo.com"
              disabled={loading}
              $hasError={!!fieldErrors.url}
              aria-invalid={!!fieldErrors.url}
              aria-describedby={fieldErrors.url ? "url-error" : undefined}
            />
            {fieldErrors.url && (
              <FieldError id="url-error">
                <AlertCircle size={14} />
                {fieldErrors.url}
              </FieldError>
            )}
          </FormGroup>

          {/* Notas */}
          <FormGroup>
            <Label htmlFor="notes">Notas (opcional)</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              onBlur={handleBlur}
              rows={4}
              placeholder="Información adicional..."
              disabled={loading}
              $hasError={!!fieldErrors.notes}
              aria-invalid={!!fieldErrors.notes}
              aria-describedby={fieldErrors.notes ? "notes-error" : undefined}
            />
            {fieldErrors.notes && (
              <FieldError id="notes-error">
                <AlertCircle size={14} />
                {fieldErrors.notes}
              </FieldError>
            )}
          </FormGroup>

          <ButtonGroup>
            <CancelButton type="button" onClick={() => navigate("/")}>
              Cancelar
            </CancelButton>
            <SubmitButton type="submit" disabled={loading}>
              <Save size={16} />
              {loading ? "Guardando..." : isEditing ? "Actualizar" : "Guardar"}
            </SubmitButton>
          </ButtonGroup>
        </form>
      </Card>
    </FormContainer>
  );
}

// ─── Styled Components ────────────────────────────────────────────────────────

const FormContainer = styled.div`
  max-width: 600px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const Card = styled.div`
  background: #ffffff;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #f3f4f6;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  color: #1f2937;
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #6b7280;
  color: #ffffff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.85;
  }
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #fee2e2;
  color: #dc2626;
  border: 1px solid #fca5a5;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 1.25rem;
`;

const Label = styled.label`
  font-weight: 600;
  font-size: 0.875rem;
  color: #1f2937;
`;

const inputBase = css`
  width: 100%;
  padding: 0.6rem 0.85rem;
  border: 1.5px solid ${({ $hasError }) => ($hasError ? "#dc2626" : "#d1d5db")};
  border-radius: 0.5rem;
  font-size: 0.95rem;
  color: #1f2937;
  background: #ffffff;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
  box-sizing: border-box;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    outline: none;
    border-color: ${({ $hasError }) => ($hasError ? "#dc2626" : "#8b5cf6")};
    box-shadow: 0 0 0 3px
      ${({ $hasError }) =>
        $hasError ? "rgba(220, 38, 38, 0.15)" : "rgba(139, 92, 246, 0.15)"};
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

const Input = styled.input`
  ${inputBase}
`;

const Textarea = styled.textarea`
  ${inputBase}
  resize: vertical;
  min-height: 96px;
`;

const FieldError = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: #dc2626;
  font-size: 0.8rem;
  margin-top: 0.15rem;
`;

// ─── Password ─────────────────────────────────────────────────────────────────

const PasswordInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const PasswordInput = styled(Input)`
  padding-right: 2.8rem;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  display: flex;
  align-items: center;
  padding: 0;
  transition: color 0.2s;

  &:hover {
    color: #1f2937;
  }
`;

const PasswordStrength = styled.div`
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const StrengthBar = styled.div`
  flex: 1;
  height: 6px;
  background: #e5e7eb;
  border-radius: 99px;
  overflow: hidden;
`;

const StrengthFill = styled.div`
  height: 100%;
  border-radius: 99px;
  transition:
    width 0.3s ease,
    background-color 0.3s ease;
  width: ${({ $percent }) => $percent}%;
  background-color: ${({ $color }) => $color};
`;

const StrengthText = styled.span`
  font-size: 0.78rem;
  font-weight: 600;
  color: ${({ $color }) => $color};
  white-space: nowrap;
`;

// ─── Button Group ─────────────────────────────────────────────────────────────

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.75rem;
`;

const CancelButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.5rem;
  background: #f3f4f6;
  color: #374151;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #e5e7eb;
  }
`;

const SubmitButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 120px;
  justify-content: center;
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  color: #ffffff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.65rem 1.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    opacity 0.2s,
    transform 0.1s;
  box-shadow: 0 4px 6px -1px rgba(139, 92, 246, 0.4);

  &:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

export default CredentialForm;
