# 🛡️ Pansilius Pro | Enterprise Inventory Management System

![Status](https://img.shields.io/badge/Status-Production--Ready-success?style=for-the-badge)
![Security](https://img.shields.io/badge/Security-SSL%20%2F%20JWT-blue?style=for-the-badge)
![Maintained](https://img.shields.io/badge/Maintained-Yes-orange?style=for-the-badge)

Pansilius Pro is a professional-grade backend solution for real-time inventory control. Engineered with **Node.js 20**, **Express 5**, and **MySQL**, it provides a secure, scalable, and high-performance environment for administrative operations.

---

## 🌐 Production Infrastructure

The system is deployed using a professional-tier architecture:

| Component | URL / Endpoint | Purpose |
| :--- | :--- | :--- |
| **Pansilius Web** | [https://git.minecraft17.online](https://git.minecraft17.online) | Main Dashboard & User Authentication |
| **Database Admin**| [https://minecraft17.online](https://minecraft17.online) | phpMyAdmin Interface (DB Management) |
| **API Base URL**  | `https://git.minecraft17.online/api` | RESTful Endpoint for external integrations |

---

## 🚀 Key Features

### 🔐 Advanced Security
- **JWT Authorization:** Stateless authentication using JSON Web Tokens.
- **Bcrypt Hashing:** Industry-standard password encryption.
- **Protected Routes:** Middleware-level access control for all sensitive operations.
- **SSL Termination:** Automatic HTTPS enforcement via Nginx and Let's Encrypt.

### 📦 Inventory Engine
- **Full CRUD:** Create, Read, Update, and Delete items with real-time validation.
- **Asset Management:** Integrated file uploading system via Multer for product images.
- **Relational Integrity:** Optimized MySQL schema for data consistency.

### 💻 Pansilius CLI (Command Line Interface)
A powerful terminal-based tool to manage the system without a browser:
- `login <user> <pass>`: Authenticate and persist session locally.
- `list`: View inventory in a formatted ASCII table.
- `add "Name" "Description"`: Quick item insertion.
- `delete <id>`: Instant removal of inventory records.
- `profile`: Check current user session details.

---

## 🛠️ Technical Architecture

```text
                     [ Internet ]
                          |
                  [ Nginx Reverse Proxy ]
                 (Port 80/443 - SSL Termination)
                 /                  \
    [ Pansilius App ]           [ Apache Server ]
    (Port 3000 - Node.js)       (Port 8080 - phpMyAdmin)
            \                       /
             \---[ MySQL Server ]---/
                  (Port 3306)
```

---

## 🔌 API Documentation

### Authentication (`/auth`)
- `POST /register`: Create new account (Supports multipart/form-data for profile photos).
- `POST /login`: Returns JWT token on success.
- `GET /profile`: (Protected) Returns logged-in user details.

### Inventory (`/items`)
- `GET /`: List all items.
- `GET /:id`: Detailed view of a single item.
- `POST /`: Add new item (JSON body: `nombre`, `descripcion`, `estado`).
- `PUT /:id`: Update existing item.
- `DELETE /:id`: Remove item from database.

---

## 📥 Local Setup & Deployment

1. **Clone & Install:**
   ```bash
   git clone https://github.com/yuberzmac/Pansilius.git
   cd Pansilius
   npm install
   ```

2. **Environment Configuration (`.env`):**
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_USER=mysql
   DB_PASSWORD=123456
   DB_NAME=Pansilius
   JWT_SECRET=your_secret_key
   ```

3. **Running in Production (PM2):**
   ```bash
   sudo npm install -g pm2
   pm2 start src/index.js --name pansilius
   pm2 save
   pm2 startup
   ```

## 🛡️ Maintenance & Logs
To monitor the system in real-time:
- **App Logs:** `pm2 logs pansilius`
- **Nginx Status:** `sudo systemctl status nginx`
- **Error Logs:** `tail -f /var/log/nginx/error.log`

---
**Developed as a specialized Backend Implementation Project.**
