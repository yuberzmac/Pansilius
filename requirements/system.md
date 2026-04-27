# 📋 Requerimientos del Sistema - Pansilius Pro

Para garantizar el correcto funcionamiento de la plataforma **Pansilius Pro**, el entorno de ejecución debe cumplir con los siguientes estándares técnicos:

---

## 💻 Entorno de Software
*   **Runtime:** Node.js v20.x o superior (Recomendado v22.x LTS).
*   **Gestor de Paquetes:** NPM v10.x o superior.
*   **Base de Datos:** MySQL v8.0 o superior (Debe permitir conexiones mediante el protocolo `mysql_native_password` o `caching_sha2_password`).
*   **Sistema Operativo:** Linux (Ubuntu/Debian recomendado), macOS o Windows 10/11.

---

## 🌐 Conectividad y Red
*   **Puerto Local:** El puerto `3000` (o el definido en el `.env`) debe estar liberado.
*   **Acceso a Internet:** Necesario para la carga de librerías externas vía CDN:
    *   SweetAlert2 (Alertas interactivas).
    *   Google Fonts (Tipografía Plus Jakarta Sans).
    *   Material Icons (Iconografía).
    *   Xterm.js (Terminal Web).

---

## 🗄️ Configuración de Base de Datos
*   **Esquema:** El sistema crea las tablas automáticamente, pero el usuario de MySQL debe tener permisos de:
    *   `CREATE`, `ALTER`, `DROP` (Para la sincronización inicial).
    *   `SELECT`, `INSERT`, `UPDATE`, `DELETE` (Para la operación diaria).
*   **Variables Obligatorias:** Se requiere un archivo `.env` configurado con credenciales válidas.

---

## 📸 Recursos de Hardware (Mínimos)
*   **RAM:** 1GB (El servidor Node.js consume aprox. 150MB en reposo).
*   **Almacenamiento:** 200MB de espacio libre (Aumentará según la cantidad de imágenes subidas a `/uploads`).
*   **CPU:** 1 Core a 2.0GHz.

---
© 2026 Pansilius Corp. Documentación Técnica.
