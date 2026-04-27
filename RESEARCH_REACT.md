# Investigación: Fundamentos de Frontend con React

## Conceptos Clave

1. **SPA (Single Page Application):** Es una aplicación web que carga una sola página HTML y actualiza dinámicamente el contenido a medida que el usuario interactúa. Esto evita recargar toda la página, mejorando la velocidad y la experiencia del usuario (UX).

2. **Estructura de Proyectos:** React organiza el código en una jerarquía de archivos donde `src` es la carpeta principal. Se suelen separar componentes, servicios, hooks y vistas para mantener el código limpio y escalable.

3. **Componentes:** Son las piezas de construcción de la interfaz. Pueden ser funciones que retornan JSX (una mezcla de HTML y JavaScript). Permiten la reutilización de código (ej: un botón que se usa en varias páginas).

4. **Estado (State):** Es la "memoria" de un componente. Permite que React sepa cuándo algo ha cambiado (como el texto de un input o el resultado de una API) y actualice la interfaz automáticamente.

5. **Hooks:** Son funciones especiales que permiten "engancharse" a características de React. Los más comunes son:
   - `useState`: Para manejar el estado.
   - `useEffect`: Para ejecutar código cuando el componente se monta (ej: llamar a la API del backend).

6. **Enrutamiento (Routing):** Permite navegar entre diferentes "páginas" (vistas) sin recargar el navegador. En React se usa comúnmente `react-router-dom`.

7. **Formularios y Manejo de Eventos:** React controla los formularios mediante el estado (controlled components). Los eventos como `onClick` o `onSubmit` se manejan con funciones de JavaScript para procesar los datos antes de enviarlos al backend.

## Relación con el Backend desarrollado
El frontend desarrollado en React actuará como el cliente que consume los servicios de la API de Node.js. 
- Los **servicios** de React usarán `axios` o `fetch` para enviar peticiones `POST` a `/login` y `/register`.
- Los **componentes** de lista usarán peticiones `GET` a `/api/items` para mostrar los datos de la base de datos MySQL.
- El **estado** de React almacenará el `token` de autenticación para proteger las rutas del frontend.
