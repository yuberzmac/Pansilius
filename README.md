# API Backend con Node.js y MySQL

Este proyecto es una API REST desarrollada con Node.js y Express, integrada con una base de datos MySQL (db4free.net) y autenticación mediante JWT.

## Requisitos

- Node.js (v18 o superior)
- Docker (opcional, para contenerización)
- Base de datos MySQL en db4free.net o similar

## Configuración

1. Clonar el repositorio.
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Configurar las variables de entorno en un archivo `.env` (basado en el archivo `.env` de ejemplo):
   ```env
   PORT=3000
   DB_HOST=db4free.net
   DB_USER=tu_usuario
   DB_PASSWORD=tu_password
   DB_NAME=tu_base_de_datos
   DB_PORT=3306
   JWT_SECRET=tu_secreto_seguro
   ```

## Base de Datos

Deberás crear las siguientes tablas en tu base de datos:

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  estado BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Endpoints

### Autenticación
- `POST /register`: Registrar un nuevo usuario.
- `POST /login`: Iniciar sesión y obtener el token JWT.

### CRUD de Items (Requiere Token)
- `GET /api/items`: Listar todos los items.
- `GET /api/items/:id`: Obtener un item por ID.
- `POST /api/items`: Crear un nuevo item.
- `PUT /api/items/:id`: Actualizar un item existente.
- `DELETE /api/items/:id`: Eliminar un item.

## Ejecución

### Modo Desarrollo
```bash
npm run dev
```

### Modo Producción
```bash
npm start
```

### Con Docker
```bash
docker build -t backend-api .
docker run -p 3000:3000 --env-file .env backend-api
```

## Estructura del Proyecto
- `src/config`: Configuración de la base de datos.
- `src/controllers`: Lógica de los endpoints.
- `src/middleware`: Middlewares (Autenticación).
- `src/routes`: Definición de rutas.
- `src/app.js`: Configuración de Express.
- `src/index.js`: Punto de entrada del servidor.
