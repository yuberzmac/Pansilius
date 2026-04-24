# Pansilius Pro | Sistema de Gestión de Inventario

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)

Pansilius Pro es una plataforma administrativa integral para la gestión de productos y usuarios. Cuenta con una API REST robusta, seguridad avanzada con JWT y una interfaz de línea de comandos (CLI) personalizada.

## 🌐 Accesos en Producción

El sistema está desplegado y protegido con certificados SSL (HTTPS):

- **Panel de Control (App):** [https://git.minecraft17.online](https://git.minecraft17.online)
- **Base de Datos (phpMyAdmin):** [https://minecraft17.online](https://minecraft17.online)

## 🚀 Características Principales

- **API RESTful:** Gestión completa de productos y usuarios.
- **Autenticación Segura:** Encriptación con `bcryptjs` y protección de rutas mediante `JWT`.
- **Arquitectura de Producción:** 
  - **Proxy Inverso:** Nginx gestionando el tráfico HTTPS.
  - **Gestor de Procesos:** PM2 para garantizar alta disponibilidad (auto-restart).
  - **SSL:** Certificados automáticos con Let's Encrypt.
- **Pansilius CLI:** Control total desde la terminal.

## 💻 Pansilius CLI

La herramienta de consola permite interactuar con la API sin usar el navegador.

### Instalación
```bash
sudo npm link
```

### Comandos
- `login <user> <pass>`: Iniciar sesión y guardar token.
- `list`: Ver tabla de productos.
- `add <nombre> <desc>`: Crear nuevo ítem.
- `delete <id>`: Eliminar ítem por ID.
- `profile`: Ver datos del usuario actual.

## 🛠️ Tecnologías Utilizadas

- **Backend:** Node.js, Express.
- **Base de Datos:** MySQL.
- **Servidor Web:** Nginx (Proxy) & Apache (phpMyAdmin).
- **Seguridad:** JWT, BcryptJS, Certbot (SSL).

## 📂 Estructura del Proyecto

```text
├── src/
│   ├── config/      # Conexión a DB
│   ├── controllers/ # Lógica de negocio
│   ├── middleware/  # Verificación de JWT
│   ├── routes/      # Endpoints de la API
│   ├── app.js       # Configuración Express
│   └── index.js     # Arranque del servidor
├── public/          # Frontend Web
├── cli.js           # Motor de Pansilius CLI
└── uploads/         # Almacenamiento de imágenes
```

## ⚙️ Configuración del Entorno (.env)
```env
PORT=3000
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_NAME=pansilius_db
JWT_SECRET=tu_secreto_super_seguro
```

---
**Desarrollado como proyecto de implementación de API Backend.**
