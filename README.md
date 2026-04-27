# 🛡️ Pansilius Pro | Sistema de Gestión Empresarial Avanzado

![Estado](https://img.shields.io/badge/Status-Producción-success?style=for-the-badge)
![Seguridad](https://img.shields.io/badge/Seguridad-RBAC%20%2F%20JWT-blue?style=for-the-badge)
![Versión](https://img.shields.io/badge/Versión-2.8%20PRO-orange?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-22.x-green?style=for-the-badge&logo=node.js)

Pansilius Pro es una solución integral de backend y frontend para el control de inventarios, ventas y administración de sistemas en tiempo real. Desarrollado con un enfoque en la **seguridad granular (RBAC)** y una **arquitectura modular**, permite una gestión total desde una interfaz web moderna o una potente terminal interactiva.

---

## 🚀 Funcionalidades Principales

### 🔐 Seguridad y Control de Acceso (RBAC Avanzado)
- **Permisos Granulares:** Sistema basado en "chips" de permisos. Los roles son dinámicos; puedes conceder o revocar funciones específicas (crear, editar, borrar, comprar, ver reportes) en tiempo real.
- **Protección de Cuentas:** Bloqueo automático tras 3 intentos fallidos y cierre de sesiones remotas ("Kick").
- **Autenticación Robusta:** JWT (JSON Web Tokens) con control de versiones para invalidación inmediata de tokens.

### 📦 Motor de Inventario y Ventas
- **Control de Stock Real:** Transacciones SQL seguras que descuentan unidades automáticamente tras cada compra.
- **Estados Inteligentes:** Los productos se marcan como "Agotado" automáticamente, bloqueando ventas si no hay stock.
- **Auditoría Financiera:** Reportes detallados de ventas con cálculo de balance total y detalle por cliente.

### 💻 Centro de Control del Servidor (Web & CLI)
- **Terminal Web Real:** Emulación de terminal (TTY) mediante WebSockets para ejecución de comandos bash directamente en el navegador.
- **Explorador de Archivos:** Gestión remota de archivos (subir, descargar, editar con resaltado de sintaxis, eliminar).
- **Monitor de Recursos:** Visualización en tiempo real del uso de RAM, CPU y almacenamiento.
- **Pansilius Shell (CLI):** Una terminal asistida para administración rápida del negocio.

### 📱 Interfaz Premium y Responsiva
- **Diseño Modular:** Totalmente adaptable a móviles y tablets con una experiencia "App-like".
- **Visuales Modernos:** Interfaz basada en Glassmorphism, tipografía Plus Jakarta Sans y notificaciones interactivas.

---

## 🛠️ Stack Tecnológico
- **Backend:** Node.js + Express (Arquitectura MVC)
- **Base de Datos:** MySQL (Pool de conexiones con Sequelize-style init)
- **Comunicación:** Socket.io para terminal en tiempo real
- **Frontend:** HTML5, CSS3 (Custom Variables), JavaScript (Vanilla ES6+)
- **Seguridad:** JWT, Bcrypt, Helmet (CSP), CORS

---

## 🏗️ Estructura del Proyecto
```text
Pansilius/
├── src/
│   ├── config/      # Configuración de DB, Mail y Multer
│   ├── controllers/ # Lógica de negocio (Auth, Items, Shop, Admin, System)
│   ├── middleware/  # Verificación de Token y RBAC
│   ├── routes/      # Endpoints de la API
│   └── views/       # Plantillas EJS y Vistas HTML
├── public/          # Archivos estáticos (CSS, JS, Imágenes)
├── cli.js           # Pansilius Command Center (CLI)
└── uploads/         # Almacenamiento de fotos de perfil y archivos
```

---

## 📥 Instalación Local

1. **Clonar Repositorio:**
   ```bash
   git clone <repo-url>
   cd Pansilius
   ```

2. **Instalar Dependencias:**
   ```bash
   npm install
   ```

3. **Configurar Entorno:**
   Crea un archivo `.env` basado en `.env.example`:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=pansilius
   JWT_SECRET=tu_secreto_seguro
   ```

4. **Iniciar el Sistema:**
   ```bash
   npm start
   ```

---

## 🔌 Documentación de la API (Resumen)

| Método | Endpoint | Permiso Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Público | Inicio de sesión y entrega de JWT |
| `GET` | `/api/items` | `item:view` | Listar catálogo (Admin ve todo) |
| `POST` | `/api/shop/buy` | `shop:buy` | Procesar compra y bajar stock |
| `GET` | `/api/admin/users` | `user:view` | Listar personal y clientes |
| `POST` | `/api/system/terminal` | `admin:panel` | Ejecutar comandos de sistema |

---

## 🛡️ Mantenimiento y Seguridad
Para asegurar la integridad del sistema:
- **`npm run cli`**: Accede a las herramientas de auditoría rápida.
- Las tablas se sincronizan automáticamente al arrancar el servidor mediante el script `initDB`.
- Todos los archivos peligrosos (swp, logs, legacy PHP) han sido eliminados del core.

---
© 2026 Pansilius Corp. Todos los derechos reservados.
