# Pansilius Pro | API Backend de Gestión de Inventario

Este proyecto consiste en una plataforma administrativa integral desarrollada con **Node.js, Express y MySQL**. La aplicación permite la gestión de productos, perfiles de usuario con seguridad avanzada, y cuenta con una interfaz web dinámica y una potente línea de comandos (CLI).

Esta versión corresponde a la **Fase 2**, que incluye integración con base de datos MySQL remota, autenticación JWT, protección de rutas y contenerización con Docker.

## 🚀 Características Principales

- **API RESTful:** Endpoints para gestión de productos y usuarios con respuestas en formato JSON.
- **Autenticación Segura:** Registro e inicio de sesión protegidos mediante encriptación (bcryptjs) y tokens de acceso (JWT).
- **Protección de Rutas:** Middleware de seguridad para asegurar que solo usuarios autenticados realicen cambios en el inventario.
- **Base de Datos Remota:** Conexión optimizada para trabajar con servicios MySQL en la nube.
- **Pansilius CLI:** Consola interactiva personalizada para controlar el sistema directamente desde la terminal.
- **Docker Ready:** Configuración completa para desplegar la aplicación en contenedores aislados.

## 🛠️ Requisitos del Entorno

- **Node.js:** v18 o superior.
- **MySQL:** Base de datos remota activa con puerto 3306 abierto.
- **Docker:** Instalado y configurado (opcional para despliegue).

## 📥 Instalación y Configuración

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/Pansilius.git
   cd Pansilius
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   Crea un archivo `.env` en la raíz del proyecto basándote en el archivo `.env.example`:
   ```env
   PORT=3000
   DB_HOST=tu_host_remoto
   DB_USER=tu_usuario
   DB_PASSWORD=tu_password
   DB_NAME=tu_base_de_datos
   DB_PORT=3306
   JWT_SECRET=tu_secreto_seguro
   ```

## 🗄️ Estructura de la Base de Datos

La API utiliza dos tablas principales. Si no existen, el sistema las creará automáticamente al iniciar el servidor:

- **users:** Almacena credenciales, nombres, teléfonos y fotos de perfil.
- **items:** Gestiona el inventario (id, nombre, descripción, estado, fecha de creación).

## 🔌 Documentación de la API

### Autenticación
| Método | Ruta | Descripción |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Registro de nuevos usuarios (acepta imagen/multipart). |
| `POST` | `/api/auth/login` | Inicio de sesión y generación de Token JWT. |

### CRUD de Items (Rutas Protegidas)
| Método | Ruta | Descripción |
| :--- | :--- | :--- |
| `GET` | `/api/items` | Listar todos los productos. |
| `GET` | `/api/items/:id` | Obtener detalles de un producto específico. |
| `POST` | `/api/items` | Crear un nuevo producto. |
| `PUT` | `/api/items/:id` | Actualizar información de un producto. |
| `DELETE` | `/api/items/:id` | Eliminar un producto del sistema. |

## 💻 Pansilius CLI

Controla el backend desde la terminal:

1. **Vincular comando globalmente:**
   ```bash
   npm link
   ```
2. **Iniciar consola interactiva:**
   ```bash
   pansilius
   ```
3. **Comandos disponibles:** `login`, `list`, `add`, `delete`, `profile`, `exit`.

## 🐳 Despliegue con Docker

Sigue estos pasos para ejecutar la aplicación dentro de un contenedor:

1. **Construir la imagen:**
   ```bash
   docker build -t backend-api .
   ```

2. **Ejecutar el contenedor:**
   ```bash
   docker run -p 3000:3000 --env-file .env backend-api
   ```

## 📂 Estructura del Proyecto

```text
├── src/
│   ├── config/      # Configuración de base de datos
│   ├── controllers/ # Lógica de negocio (Auth e Items)
│   ├── middleware/  # Seguridad y JWT
│   ├── routes/      # Definición de endpoints
│   ├── app.js       # Configuración de Express
│   └── index.js     # Punto de entrada del servidor
├── public/          # Interfaz Web (Dashboard y Login)
├── uploads/         # Almacenamiento local de archivos
├── cli.js           # Motor de Pansilius CLI
├── Dockerfile       # Configuración de imagen Docker
└── .env.example     # Plantilla de configuración
```

---
**Desarrollado como parte del curso de Implementación de API Backend con Node.js.**
