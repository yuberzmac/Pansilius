# 🛡️ Pansilius Pro | Sistema de Gestión Empresarial Avanzado

![Estado](https://img.shields.io/badge/Status-Producción-success?style=for-the-badge)
![Seguridad](https://img.shields.io/badge/Seguridad-RBAC%20%2F%20JWT-blue?style=for-the-badge)
![Versión](https://img.shields.io/badge/Versión-2.8%20PRO-orange?style=for-the-badge)

Pansilius Pro es una solución integral de backend para el control de inventarios y ventas en tiempo real. Desarrollado con un enfoque en la seguridad granular y la escalabilidad, el sistema permite una administración total de recursos, empleados y transacciones comerciales.

---

## 🚀 Funcionalidades Principales

### 🔐 Seguridad y Control de Acceso (RBAC Avanzado)
- **Permisos Granulares:** Sistema basado en "chips" de permisos (`hasPermission`). Los roles no son estáticos; puedes activar o desactivar funciones específicas (crear, editar, borrar, comprar, ver reportes) para cualquier rango.
- **Jerarquía de Roles:** Soporte para múltiples niveles (Admin, Usuario, Supervisor, etc.) creados dinámicamente.
- **Autenticación Robusta:** JWT (JSON Web Tokens) con una duración de 24 horas y encriptación Bcrypt para contraseñas.

### 📦 Motor de Inventario y Stock
- **Control de Stock Real:** El sistema descuenta automáticamente unidades del inventario tras cada compra exitosa.
- **Estados Automáticos:** Los productos se marcan como "Agotado" visualmente cuando el stock llega a cero, bloqueando nuevas ventas.
- **Gestión de Precios:** Soporte para valores decimales y descripciones detalladas.

### 🛒 Experiencia de Usuario (Tienda)
- **Interfaz de Cliente:** Vista dedicada (`tienda.html`) donde el usuario solo ve productos activos y disponibles.
- **Historial de Compras:** Cada usuario tiene acceso a su lista de tickets y transacciones realizadas.

### 💻 Pansilius Command Center (CLI v2.8 PRO)
Una terminal interactiva y guiada para la administración total del negocio:
- **`login` / `register`**: Acceso y creación de cuentas asistida paso a paso.
- **`ls` / `list`**: Visualización de inventario con tablas ASCII profesionales.
- **`buy`**: Asistente de compra rápido que muestra el catálogo antes de pedir el ID.
- **`edit`**: Menú interactivo para modificar nombre, precio, stock o estado sin comandos complejos.
- **`perms`**: Centro de control de seguridad para activar/desactivar permisos por rol.
- **`reports`**: Auditoría financiera que calcula el balance total de ventas y muestra el detalle por cliente.

---

## 🌐 Infraestructura y Despliegue

| Componente | Dirección | Propósito |
| :--- | :--- | :--- |
| **Pansilius Web** | [https://git.minecraft17.online](https://git.minecraft17.online) | Panel de Control y Tienda |
| **Admin DB**| [https://minecraft17.online](https://minecraft17.online) | Gestión de Base de Datos (phpMyAdmin) |
| **Gitea Server** | [136.248.245.181:3002](http://136.248.245.181:3002) | Repositorio privado de código |

---

## 🛠️ Stack Tecnológico
- **Backend:** Node.js 22 + Express 5
- **Base de Datos:** MySQL 8 (Arquitectura relacional avanzada)
- **Frontend:** HTML5, CSS3 (Glassmorphism & Plus Jakarta Sans), JavaScript (Vanilla)
- **Herramientas:** Axios, Bcrypt, JWT, Multer, SweetAlert2

---

## 🔌 Documentación de la API (Endpoints Críticos)

### Administración (`/api/admin`)
- `GET /users`: Listar toda la plantilla de usuarios.
- `PUT /users/role`: Cambiar el rango de un empleado.
- `POST /roles`: Crear un nuevo rol jerárquico.
- `POST /roles/toggle-permiso`: Conceder o revocar permisos específicos.
- `GET /reports/sales`: Obtener balance total de ingresos.

### Tienda y Compras (`/api/shop`)
- `POST /buy`: Procesar compra y descontar stock.
- `GET /my-purchases`: Obtener historial del usuario autenticado.

---

## 📥 Instalación Local

1. **Clonar Repositorio:**
   ```bash
   git clone https://github.com/yuberzmac/Pansilius.git
   cd Pansilius
   npm install
   ```

2. **Variables de Entorno (`.env`):**
   ```env
   PORT=3000
   DB_HOST=136.248.245.181
   DB_USER=mysql
   DB_PASSWORD=your_password
   DB_NAME=Pansilius
   JWT_SECRET=tu_secreto_seguro
   ```

3. **Ejecutar CLI:**
   ```bash
   node cli.js
   ```

---
**Desarrollado como un Proyecto de Implementación Backend Profesional.**

### ✅ Fase 3 - Sincronizada
- [x] Sistema de Permisos Granulares (RBAC)
- [x] Control Automatizado de Stock
- [x] Interfaz de Tienda para Clientes
- [x] CLI v2.8 PRO con Reportes Financieros
- [x] Documentación Completa en Español
