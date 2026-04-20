# Pansilius Pro | Gestión de Inventario & Perfil Corporativo

Este proyecto es una plataforma administrativa integral desarrollada con **Node.js, Express y MySQL**. Incluye un Dashboard moderno, gestión de productos, perfiles de usuario con seguridad avanzada y una potente interfaz de línea de comandos (CLI).

## ✨ Características Principales

- **Dashboard Administrativo:** Interfaz visual premium para gestionar productos en tiempo real.
- **Gestión de Productos:** CRUD completo (Crear, Leer, Actualizar, Eliminar) con estados activos/inactivos.
- **Perfil de Usuario:** Actualización de datos personales (nombre, teléfono, contraseña) y foto de perfil.
- **Seguridad JWT:** Sesiones protegidas y visualización de token de acceso mediante confirmación de contraseña.
- **Pansilius CLI:** Control total de la plataforma desde la terminal con un modo interactivo personalizado.

## 🛠️ Requisitos

- Node.js (v18 o superior)
- MySQL / MariaDB
- Docker (opcional)

## 🚀 Instalación Rápida

1.  **Clonar y Dependencias:**
    ```bash
    git clone https://github.com/yuberzmac/Pansilius.git
    cd Pansilius
    npm install
    ```

2.  **Configuración (.env):**
    Crea un archivo `.env` en la raíz:
    ```env
    PORT=3000
    DB_HOST=tu_host
    DB_USER=tu_usuario
    DB_PASSWORD=tu_password
    DB_NAME=tu_base_de_datos
    JWT_SECRET=tu_secreto_seguro
    ```

3.  **Base de Datos:**
    Asegúrate de tener las tablas `users` e `items`. La tabla `users` ahora incluye los campos `nombre`, `telefono` y `foto`.

## 💻 Pansilius CLI (Consola Interactiva)

Puedes controlar todo el sistema desde tu terminal sin usar el navegador.

1.  **Instalar globalmente:**
    ```bash
    npm link
    ```
2.  **Iniciar consola:**
    ```bash
    pansilius
    ```
3.  **Comandos disponibles dentro de Pansilius CLI:**
    - `login <usuario> <pass>`: Inicia tu sesión corporativa.
    - `list`: Muestra la tabla de productos.
    - `add "Nombre" "Descripción" true`: Añade un nuevo producto.
    - `delete <id>`: Elimina un producto por su ID.
    - `profile`: Muestra tu información personal.
    - `clear`: Limpia la consola.
    - `exit`: Cierra la sesión de consola.

## 🐳 Docker

Para correr la aplicación en un contenedor aislado:

1.  **Construir imagen:**
    ```bash
    docker build -t pansilius-app .
    ```
2.  **Correr contenedor:**
    ```bash
    docker run -p 3000:3000 --env-file .env pansilius-app
    ```

## 🔐 Seguridad del Perfil

El sistema incluye una capa extra de protección:
- Las contraseñas se encriptan con **bcryptjs**.
- Para visualizar el **Token de Sesión** desde el perfil web, el sistema solicitará tu contraseña nuevamente para verificar tu identidad, protegiendo tu acceso de terceros.

## 📂 Estructura
- `src/`: Lógica del servidor (Controladores, Rutas, Middlewares).
- `public/`: Interfaz web (Dashboard, Login, CSS).
- `cli.js`: Motor de la consola Pansilius.
- `uploads/`: Almacenamiento de fotos de perfil.
