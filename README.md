# 🔐 Credentials Manager (TECVISION)

Gestor de credenciales segura con cifrado de extremo a extremo, autenticación JWT y registro de auditoría.

---

## 👥 Integrantes

| Nombre | GitHub |
|---|---|
| Luis Daniel Rojas | [@daniel69zz](https://github.com/daniel69zz) |
| Dayana Gretel Rojas | [@Rosav-dotcom](https://github.com/Rosav-dotcom) |
| Jorge Manuel Calizaya | [@Jorge-UCB](https://github.com/Jorge-UCB) |
| Oscar Brandon Gutierrez | [@GutyOs23](https://github.com/GutyOs23) |
| David Alessandro Chuquimia | [@davidchuquimia-bot](https://github.com/davidchuquimia-bot) |
| Aylen Adriana Claros | [@lendeliq](https://github.com/lendeliq) |


---

## 📁 Estructura del proyecto

```
PRUEBA_TECNICA_CREDENCIALES/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── middlewares/
│   │   │   └── auth_middleware.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   └── credential.js
│   │   ├── encryption.js
│   │   └── app.js
│   └── server.js
└── frontend/
    └── src/
        ├── components/
        ├── pages/
        └── services/
            └── api2.js
```

---

## 🗄️ Base de datos

El proyecto utiliza **PostgreSQL** con 3 tablas principales:

| Tabla | Descripción |
|---|---|
| `USERS` | Usuarios registrados |
| `CREDENTIALS` | Credenciales cifradas por usuario |
| `AUDIT_LOGS` | Registro de acciones sensibles |

El fichero .sql para la creación de la base de datos esta en la raíz del repositorio.

---

## ⚙️ Instalación

### Pre-requisitos

- Node.js v18+
- PostgreSQL 14+

---

### 🔧 Backend

1. Entra al directorio del backend:
```bash
cd PRUEBA_BACKEND
```

2. Instala las dependencias:
```bash
npm install
```

3. Ejecuta las migraciones SQL en tu base de datos PostgreSQL (dado que no puedas acceder al fichero .sql):
```sql
CREATE TABLE AUDIT_LOGS (
    id_audit serial  NOT NULL,
    id_user int  NOT NULL,
    action varchar(70)  NOT NULL,
    created_at timestamp  NOT NULL DEFAULT NOW(),
    metadata jsonb  NOT NULL,
    CONSTRAINT AUDIT_LOGS_pk PRIMARY KEY (id_audit)
);

CREATE TABLE CREDENTIALS (
    id_credential serial  NOT NULL,
    id_user int  NOT NULL,
    service_name varchar(70)  NOT NULL,
    account_username varchar(70)  NOT NULL,
    password_encrypted text  NOT NULL,
    url text  NULL,
    notes text  NULL,
    created_at timestamp  NOT NULL DEFAULT NOW(),
    updated_at timestamp  NOT NULL DEFAULT NOW(),
    CONSTRAINT CREDENTIALS_pk PRIMARY KEY (id_credential)
);

CREATE TABLE USERS (
    id_user serial  NOT NULL,
    email varchar(70)  NOT NULL,
    password_hash text  NOT NULL,
    created_at timestamp  NOT NULL DEFAULT NOW(),
    CONSTRAINT USERS_pk PRIMARY KEY (id_user)
);

ALTER TABLE CREDENTIALS ADD CONSTRAINT CREDENTIALS_USERS
    FOREIGN KEY (id_user)
    REFERENCES USERS (id_user)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;
```

5. Configuración de variables de entorno

Renombrar el archivo `.env.clear` a `.env`.
Editar el archivo `.env` y completar las variables necesarias con las credenciales de su entorno local (base de datos, puerto, etc.).

6. Inicia el servidor:
```bash
node server.js
```

El backend estará corriendo en `http://localhost:3000`

---

### 🎨 Frontend

1. Entra al directorio del frontend:
```bash
cd PRUEBA_FRONTEND
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia la aplicación:
```bash
npm run dev
```

El frontend estará corriendo en `http://localhost:5173`

---

## 🌐 API Endpoints

### 🔐 Autenticación

| Método | Endpoint | Auth | Descripción |
|---|---|---|---|
| `POST` | `/auth/register` | ❌ | Registrar usuario |
| `POST` | `/auth/login` | ❌ | Iniciar sesión, devuelve JWT |

#### Ejemplos

```http
POST /auth/register
Content-Type: application/json

{
  "email": "usuario@email.com",
  "password": "miPassword123"
}
```

```http
POST /auth/login
Content-Type: application/json

{
  "email": "usuario@email.com",
  "password": "miPassword123"
}
```

---

### 🔑 Credenciales
> Todos los endpoints requieren header: `Authorization: Bearer <token>`

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/credentials` | Obtener todas las credenciales |
| `POST` | `/credentials` | Crear nueva credencial |
| `GET` | `/credentials/:id` | Obtener credencial por ID |
| `PUT` | `/credentials/:id` | Actualizar credencial |
| `DELETE` | `/credentials/:id` | Eliminar credencial |
| `GET` | `/credentials/:id/password` | Revelar contraseña (genera log) |

#### Ejemplos

```http
POST /credentials
Authorization: Bearer <token>
Content-Type: application/json

{
  "service_name": "GitHub",
  "account_username": "mi_usuario",
  "password": "miPasswordSegura",
  "url": "https://github.com",
  "notes": "Cuenta personal"
}
```

```http
PUT /credentials/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "service_name": "GitHub",
  "account_username": "mi_usuario",
  "url": "https://github.com",
  "notes": "Cuenta personal actualizada"
}
```

> 💡 En el `PUT`, el campo `password` es opcional. Si no se envía, se conserva la contraseña anterior.

---

## 🔒 Seguridad

- **Contraseñas de usuarios** hasheadas con `bcryptjs`
- **Autenticación** mediante JWT con expiración de 1 hora
- **Auditoría** de accesos sensibles registrada en `AUDIT_LOGS` con IP y User-Agent
- Las contraseñas **nunca se devuelven** en los listados, solo bajo petición explícita

---

## 🪵 Auditoría

Cada vez que un usuario solicita ver una contraseña, se registra automáticamente en `AUDIT_LOGS`:

```json
{
  "action": "SHOW_PASSWORD",
  "metadata": {
    "credential_id": "1",
    "ip": "192.168.1.1",
    "user_agent": "Mozilla/5.0 ..."
  }
}
```

---

## 🛠️ Tecnologías

### Backend
| Tecnología | Uso |
|---|---|
| Node.js + Express | Servidor HTTP |
| PostgreSQL + pg | Base de datos |
| bcryptjs | Hash de contraseñas |
| jsonwebtoken | Autenticación JWT |
| dotenv | Variables de entorno |

### Frontend
| Tecnología | Uso |
|---|---|
| React | Interfaz de usuario |
| React Router | Navegación |
| Styled Components | Estilos |
| Lucide React | Iconos |

---

## 📄 Licencia

MIT
