# 🛡️ Pansilius Pro | Sistema de Gestión Empresarial All-in-One

![Estado](https://img.shields.io/badge/Status-Producción-success?style=for-the-badge)
![Seguridad](https://img.shields.io/badge/Seguridad-RBAC%20%2F%20JWT-blue?style=for-the-badge)
![Versión](https://img.shields.io/badge/Versión-2.8%20PRO-orange?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-22.x-green?style=for-the-badge&logo=node.js)
![MySQL](https://img.shields.io/badge/Database-MySQL%208-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

**Pansilius Pro** es una plataforma empresarial de alto rendimiento diseñada para centralizar la gestión de inventarios, ventas y administración de servidores en una única interfaz. Combina la potencia de una **CLI interactiva** con un **Panel Web Premium** totalmente responsivo.

---

## 📖 Tabla de Contenidos
1. [Características Principales](#-características-principales)
2. [Arquitectura del Sistema](#-arquitectura-del-sistema)
3. [Instalación y Configuración](#-instalación-y-configuración)
4. [Gestión de Seguridad (RBAC)](#-gestión-de-seguridad-rbac)
5. [Centro de Comando CLI](#-centro-de-comando-cli)
6. [Módulos Avanzados](#-módulos-avanzados)
7. [Stack Tecnológico](#-stack-tecnológico)

---

## ✨ Características Principales

### 🔐 Seguridad de Grado Empresarial
*   **RBAC Dinámico:** Control de acceso basado en roles. Permite activar/desactivar permisos específicos (chips) sin reiniciar el sistema.
*   **Protección Anti-Fuerza Bruta:** Bloqueo automático de cuentas tras 3 intentos fallidos.
*   **Sesiones Seguras:** Uso de JWT con `token_version` para invalidar sesiones de forma remota ("Kick").

### 📦 Gestión de Inventario Inteligente
*   **Sincronización de Stock:** Descuento automático en ventas con prevención de sobreventa mediante transacciones SQL.
*   **Catálogo Adaptativo:** Interfaz de tienda que se ajusta a la disponibilidad real de los productos.

### 🛠️ Herramientas de Administración de Servidor
*   **Terminal Web Pro:** Acceso a una terminal real (Bash) mediante WebSockets desde el navegador.
*   **Gestor de Archivos:** Explorador para subir, descargar, borrar y editar archivos del servidor en tiempo real.
*   **Monitor de Recursos:** Visualización gráfica del consumo de RAM y almacenamiento.

---

## 🏗️ Arquitectura del Sistema

El proyecto sigue un patrón **MVC (Modelo-Vista-Controlador)** optimizado para Node.js:

```text
Pansilius/
├── src/
│   ├── config/      # Conexiones (DB, Mail, Multer)
│   ├── controllers/ # Lógica central (Auth, Admin, Shop, System)
│   ├── middleware/  # Filtros de seguridad (JWT, CheckPermissions)
│   ├── routes/      # Definición de Endpoints API
│   └── views/       # Motor de plantillas EJS y UI
├── public/          # Assets (CSS Premium, JS Client, Imágenes)
├── uploads/         # Almacenamiento dinámico de archivos
└── cli.js           # Binario del Command Center
```

---

## 🚀 Instalación y Configuración

### Requisitos Previos
*   **Node.js** v20 o superior.
*   **MySQL** v8.0+.

### Pasos de Instalación

1.  **Clonar y Acceder:**
    ```bash
    git clone https://github.com/yuberzmac/Pansilius.git
    cd Pansilius
    ```

2.  **Instalar Dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar Variables de Entorno:**
    Crea un archivo `.env` en la raíz con:
    ```env
    PORT=3000
    DB_HOST=tu_host
    DB_USER=tu_usuario
    DB_PASSWORD=tu_password
    DB_NAME=Pansilius
    JWT_SECRET=una_clave_muy_segura_123
    ```

4.  **Sincronizar Base de Datos:**
    No necesitas importar SQL manualmente. Al ejecutar `npm start`, el script `initDB` creará y sincronizará todas las tablas, roles y permisos iniciales automáticamente.

---

## 🛡️ Gestión de Seguridad (RBAC)

El sistema utiliza un middleware de permisos granulares. Para añadir seguridad a una ruta:

```javascript
router.post('/delete-item', verifyToken, hasPermission('item:delete'), controller.delete);
```

**Permisos por Defecto:**
*   `admin:panel`: Acceso total al centro de control.
*   `item:create/edit/delete`: Gestión de inventario.
*   `user:view/manage`: Control de personal y roles.
*   `shop:buy`: Capacidad de realizar pedidos.

---

## 💻 Centro de Comando CLI

El sistema incluye una herramienta de terminal (`cli.js`) para administración rápida:

*   **Iniciar CLI:** `npm run cli`
*   **Comandos disponibles:**
    *   `login`: Autenticación guiada.
    *   `ls`: Ver inventario en tablas profesionales.
    *   `perms`: Gestionar permisos de roles de forma interactiva.
    *   `reports`: Auditoría de ventas y balance total.

---

## 🛠️ Stack Tecnológico

*   **Servidor:** Node.js, Express.
*   **Real-time:** Socket.io (Terminal Web).
*   **Base de Datos:** MySQL (mysql2 con Promises).
*   **Seguridad:** Bcrypt (Hashing), JWT (Auth), Helmet (Seguridad de headers).
*   **Frontend:** Vanilla JavaScript, CSS3 Custom Properties (Variables), EJS Templates.
*   **Notificaciones:** SweetAlert2.

---

## 📧 Soporte y Contacto
Desarrollado por **Yuberzmac**. Para reportar fallos o solicitar nuevas funcionalidades, abre un issue en el repositorio o contacta a soporte técnico corporativo.

---
© 2026 Pansilius Corp. Todos los derechos reservados.
