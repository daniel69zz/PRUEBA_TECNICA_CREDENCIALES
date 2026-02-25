const API_URL = "http://localhost:3000";

const getToken = () => localStorage.getItem("token");

export const api2 = {
  // GET /credentials
  getCredentials: async () => {
    const response = await fetch(`${API_URL}/credentials`, {
      headers: { Authorization: getToken() },
    });
    if (!response.ok) throw new Error("Error al obtener credenciales");
    return response.json();
  },

  // GET /credentials/:id
  getCredentialById: async (id) => {
    const response = await fetch(`${API_URL}/credentials/${id}`, {
      headers: { Authorization: getToken() },
    });
    if (!response.ok) throw new Error("Error al obtener credencial");
    return response.json();
  },

  // POST /credentials ← esta es la que necesitas
  createCredential: async (formData) => {
    const response = await fetch(`${API_URL}/credentials`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: getToken(),
      },
      body: JSON.stringify({
        service_name: formData.serviceName,
        account_username: formData.accountUsername,
        password: formData.password,
        url: formData.url || null,
        notes: formData.notes || null,
      }),
    });
    if (!response.ok) throw new Error("Error al crear credencial");
    return response.json();
  },

  // PUT /credentials/:id
  updateCredential: async (id, formData) => {
    const response = await fetch(`${API_URL}/credentials/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: getToken(),
      },
      body: JSON.stringify({
        service_name: formData.serviceName,
        account_username: formData.accountUsername,
        password: formData.password || undefined,
        url: formData.url || null,
        notes: formData.notes || null,
      }),
    });
    if (!response.ok) throw new Error("Error al actualizar credencial");
    return response.json();
  },

  // DELETE /credentials/:id
  deleteCredential: async (id) => {
    const response = await fetch(`${API_URL}/credentials/${id}`, {
      method: "DELETE",
      headers: { Authorization: getToken() },
    });
    if (!response.ok) throw new Error("Error al eliminar credencial");
    return response.json();
  },

  // GET /credentials/:id/password
  getPassword: async (id) => {
    const response = await fetch(`${API_URL}/credentials/${id}/password`, {
      headers: { Authorization: getToken() },
    });
    if (!response.ok) throw new Error("Error al obtener contraseña");
    return response.json();
  },
};
