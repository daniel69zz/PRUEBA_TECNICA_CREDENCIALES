// Simulación de datos
let credentials = [
  {
    id: 1,
    serviceName: 'Netflix',
    accountUsername: 'usuario@email.com',
    password: 'netflix123',
    url: 'https://netflix.com',
    notes: 'Cuenta premium',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 2,
    serviceName: 'Spotify',
    accountUsername: 'musica@email.com',
    password: 'spotify456',
    url: 'https://spotify.com',
    notes: 'Cuenta familiar',
    lastUpdated: new Date().toISOString()
  }
];

export const api = {
  // Autenticación
  login: async (email, password) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (email === 'demo@example.com' && password === '123456') {
      return { token: 'fake-token', user: { email, name: 'Demo User' } };
    }
    throw new Error('Credenciales inválidas');
  },

  // Credenciales
  getCredentials: async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return [...credentials];
  },

  getCredentialById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const credential = credentials.find(c => c.id === parseInt(id));
    if (!credential) throw new Error('Credencial no encontrada');
    return { ...credential };
  },

  createCredential: async (data) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const newCredential = {
      id: credentials.length + 1,
      ...data,
      lastUpdated: new Date().toISOString()
    };
    credentials.push(newCredential);
    return newCredential;
  },

  updateCredential: async (id, data) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const index = credentials.findIndex(c => c.id === parseInt(id));
    if (index === -1) throw new Error('Credencial no encontrada');
    
    credentials[index] = {
      ...credentials[index],
      ...data,
      lastUpdated: new Date().toISOString()
    };
    return credentials[index];
  },

  deleteCredential: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    credentials = credentials.filter(c => c.id !== parseInt(id));
    return { success: true };
  }
};