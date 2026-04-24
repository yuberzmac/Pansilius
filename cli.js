#!/usr/bin/env node
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const API_URL = 'http://localhost:3000/api';
const TOKEN_FILE = path.join(__dirname, '.token');
const ROLE_FILE = path.join(__dirname, '.role');
const USER_FILE = path.join(__dirname, '.user');

const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    fg: {
        red: "\x1b[31m",
        green: "\x1b[32m",
        yellow: "\x1b[33m",
        blue: "\x1b[34m",
        magenta: "\x1b[35m",
        cyan: "\x1b[36m",
        white: "\x1b[37m",
    },
    bg: {
        blue: "\x1b[44m",
        magenta: "\x1b[45m",
        red: "\x1b[41m",
        green: "\x1b[42m"
    }
};

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const ask = (query) => new Promise((resolve) => rl.question(`${colors.fg.yellow}${query}${colors.reset} `, resolve));

const getAuth = () => ({
    token: fs.existsSync(TOKEN_FILE) ? fs.readFileSync(TOKEN_FILE, 'utf8') : null,
    role: fs.existsSync(ROLE_FILE) ? fs.readFileSync(ROLE_FILE, 'utf8') : 'invitado',
    user: fs.existsSync(USER_FILE) ? fs.readFileSync(USER_FILE, 'utf8') : '?'
});

const updatePrompt = () => {
    const auth = getAuth();
    const roleColor = auth.role === 'admin' ? colors.fg.red : (auth.role === 'user' ? colors.fg.green : colors.fg.white);
    rl.setPrompt(`${colors.bright}${roleColor}[${auth.role.toUpperCase()}] ${colors.fg.cyan}${auth.user} > ${colors.reset}`);
};

const getClient = () => {
    const { token } = getAuth();
    return axios.create({
        baseURL: API_URL,
        headers: { 'Authorization': `Bearer ${token}` }
    });
};

const commands = {
    // --- SESIÓN ---
    async login(args) {
        let [username, password] = args;
        if (!username) username = await ask('👤 Usuario:');
        if (!password) password = await ask('🔑 Contraseña:');
        try {
            const res = await axios.post(`${API_URL}/auth/login`, { username, password });
            fs.writeFileSync(TOKEN_FILE, res.data.token);
            fs.writeFileSync(ROLE_FILE, res.data.role);
            fs.writeFileSync(USER_FILE, username);
            console.log(`\n${colors.fg.green}✅ ¡Acceso concedido! Bienvenido, ${username}.${colors.reset}\n`);
        } catch (e) { console.error(`${colors.fg.red}❌ Error: Credenciales inválidas.${colors.reset}`); }
    },

    async register() {
        console.log(`\n${colors.fg.cyan}📝 CREAR NUEVA CUENTA CORPORATIVA${colors.reset}`);
        const username = await ask('👤 Elija un nombre de usuario:');
        const password = await ask('🔑 Defina una contraseña:');
        const nombre = await ask('📛 Nombre completo (opcional):');
        if (!username || !password) return console.log(`${colors.fg.red}❌ Error: Datos incompletos.${colors.reset}`);
        try {
            await axios.post(`${API_URL}/auth/register`, { username, password, nombre: nombre || null });
            console.log(`\n${colors.bg.green}${colors.fg.white} SUCCESS ${colors.reset} ${colors.fg.green}✅ Cuenta creada. Inicia sesión para continuar.${colors.reset}\n`);
        } catch (e) { console.error(`${colors.fg.red}❌ Error al registrar.${colors.reset}`); }
    },

    async profile() {
        try {
            const res = await getClient().get('/auth/profile');
            const auth = getAuth();
            console.log(`\n${colors.bright}${colors.fg.cyan}🆔 MI PERFIL CORPORATIVO${colors.reset}`);
            console.log(`${colors.dim}---------------------------------${colors.reset}`);
            console.log(`Usuario:  ${colors.bright}${res.data.username}${colors.reset}`);
            console.log(`Rol:      ${auth.role.toUpperCase()}`);
            console.log(`Nombre:   ${res.data.nombre || 'No definido'}`);
            console.log(`Teléfono: ${res.data.telefono || 'No definido'}`);
            console.log(`${colors.dim}---------------------------------${colors.reset}\n`);
        } catch (e) { console.error(`${colors.fg.red}❌ Debes iniciar sesión.${colors.reset}`); }
    },

    // --- TIENDA ---
    async list() {
        try {
            const res = await getClient().get('/items');
            console.log(`\n${colors.bright}${colors.fg.blue}📦 CATÁLOGO DE PRODUCTOS${colors.reset}`);
            console.table(res.data.map(i => ({
                ID: i.id,
                Nombre: i.nombre,
                Precio: `$${parseFloat(i.precio).toFixed(2)}`,
                Stock: i.stock > 0 ? i.stock : 'SOLDOUT',
                Estado: i.estado ? '✅ Activo' : '⏸️ Pausado'
            })));
        } catch (e) { 
            const msg = e.response?.data?.message || e.message;
            console.error(`${colors.fg.red}❌ Error al listar catálogo: ${msg}${colors.reset}`); 
        }
    },
    ls() { this.list(); },

    async buy(args) {
        if (getAuth().role !== 'user') return console.log(`${colors.fg.red}⛔ Solo clientes pueden comprar.${colors.reset}`);
        await this.list();
        let [itemId] = args;
        console.log(`\n${colors.fg.cyan}--- ASISTENTE DE COMPRA RÁPIDA ---${colors.reset}`);
        if (!itemId) itemId = await ask('🆔 Ingrese el ID del producto (o 0 para cancelar):');
        if (itemId === '0' || !itemId) return console.log(`${colors.fg.yellow}⚠ Compra cancelada.${colors.reset}`);
        try {
            await getClient().post('/shop/buy', { itemId });
            console.log(`\n${colors.bg.green}${colors.fg.white} SUCCESS ${colors.reset} 🛍️ ¡Compra exitosa! Stock actualizado.${colors.reset}\n`);
        } catch (e) { console.error(`${colors.fg.red}❌ ${e.response?.data?.message || 'Error'}${colors.reset}`); }
    },

    async myorders() {
        try {
            const res = await getClient().get('/shop/my-purchases');
            console.log(`\n${colors.fg.magenta}${colors.bright}📜 MIS COMPRAS${colors.reset}`);
            console.table(res.data.map(v => ({ Ticket: v.venta_id, Producto: v.nombre, Total: `$${v.precio}`, Fecha: new Date(v.fecha).toLocaleDateString() })));
        } catch (e) { console.error(`${colors.fg.red}❌ Error al cargar historial.${colors.reset}`); }
    },

    // --- ADMIN (PRODUCTOS) ---
    async add() {
        if (getAuth().role !== 'admin') return console.log(`${colors.fg.red}⛔ Acceso denegado.${colors.reset}`);
        console.log(`\n${colors.fg.cyan}✨ REGISTRAR NUEVO PRODUCTO${colors.reset}`);
        const nombre = await ask('📝 Nombre:');
        const precio = await ask('💰 Precio:');
        const stock = await ask('📦 Stock inicial:');
        const descripcion = await ask('📄 Descripción:');
        try {
            await getClient().post('/items', { nombre, precio: parseFloat(precio), stock: parseInt(stock), descripcion, estado: true });
            console.log(`${colors.fg.green}✅ Producto guardado con éxito.${colors.reset}`);
        } catch (e) { console.error(`${colors.fg.red}❌ Error al guardar.${colors.reset}`); }
    },

    async edit() {
        if (getAuth().role !== 'admin') return console.log(`${colors.fg.red}⛔ Acceso denegado.${colors.reset}`);
        const id = await ask('🆔 ID del producto a editar:');
        try {
            const res = await getClient().get(`/items/${id}`);
            let item = res.data;
            while (true) {
                console.log(`\n${colors.fg.cyan}🛠️  MODO EDICIÓN: ${colors.bright}${item.nombre}${colors.reset}`);
                console.log(`1. Nombre:  ${item.nombre} | 2. Precio: $${item.precio} | 3. Stock: ${item.stock}`);
                console.log(`4. Estado:  ${item.estado ? '✅ Activo' : '❌ Pausado'}`);
                console.log(`5. ${colors.fg.green}💾 GUARDAR Y SALIR${colors.reset} | 0. ${colors.fg.red}❌ CANCELAR${colors.reset}`);
                const opc = await ask('\nElija opción:');
                if (opc === '1') item.nombre = await ask('Nuevo nombre:');
                else if (opc === '2') item.precio = parseFloat(await ask('Nuevo precio:'));
                else if (opc === '3') item.stock = parseInt(await ask('Nuevo stock:'));
                else if (opc === '4') item.estado = (await ask('¿Activar? (s/n):')).toLowerCase() === 's';
                else if (opc === '5') {
                    await getClient().put(`/items/${id}`, item);
                    console.log(`${colors.fg.green}✅ Sincronizado.${colors.reset}`);
                    break;
                } else if (opc === '0') break;
            }
        } catch (e) { console.error(`${colors.fg.red}❌ Error: Producto no encontrado.${colors.reset}`); }
    },

    async delete(args) {
        if (getAuth().role !== 'admin') return console.log(`${colors.fg.red}⛔ Acceso denegado.${colors.reset}`);
        let [id] = args;
        if (!id) id = await ask('🆔 ID del producto a eliminar:');
        const confirm = await ask('⚠️ ¿Eliminar? (s/n):');
        if (confirm.toLowerCase() === 's') {
            try { await getClient().delete(`/items/${id}`); console.log(`${colors.fg.green}🗑️ Borrado.${colors.reset}`); }
            catch (e) { console.error(`${colors.fg.red}❌ Error.${colors.reset}`); }
        }
    },

    // --- ADMIN (GESTIÓN) ---
    async users() {
        if (getAuth().role !== 'admin') return console.log(`${colors.fg.red}⛔ Acceso denegado.${colors.reset}`);
        try {
            const res = await getClient().get('/admin/users');
            console.log(`\n${colors.bright}${colors.fg.cyan}👥 PLANTILLA DE USUARIOS${colors.reset}`);
            console.table(res.data.map(u => ({ ID: u.id, Usuario: u.username, Nombre: u.nombre || '-', Rango: u.role.toUpperCase() })));
        } catch (e) { console.error(`${colors.fg.red}❌ Error.${colors.reset}`); }
    },

    async setrole() {
        if (getAuth().role !== 'admin') return console.log(`${colors.fg.red}⛔ Acceso denegado.${colors.reset}`);
        const userId = await ask('👤 ID Usuario:');
        const role = await ask('🛡️  Rango (admin/user):');
        try {
            await getClient().put('/admin/users/role', { userId, role: role.toLowerCase() });
            console.log(`${colors.fg.green}✅ Rango actualizado.${colors.reset}`);
        } catch (e) { console.error(`${colors.fg.red}❌ Error.${colors.reset}`); }
    },

    async addrole() {
        if (getAuth().role !== 'admin') return console.log(`${colors.fg.red}⛔ Acceso denegado.${colors.reset}`);
        const nombre = await ask('🏷️  Nombre del nuevo rol:');
        if (nombre) {
            try { await getClient().post('/admin/roles', { nombre }); console.log(`${colors.fg.green}✅ Rol creado.${colors.reset}`); }
            catch (e) { console.error(`${colors.fg.red}❌ Error.${colors.reset}`); }
        }
    },

    async perms() {
        if (getAuth().role !== 'admin') return console.log(`${colors.fg.red}⛔ Acceso denegado.${colors.reset}`);
        try {
            const resRoles = await getClient().get('/admin/roles/list');
            console.log(`\n${colors.bright}${colors.fg.magenta}📋 ROLES DISPONIBLES:${colors.reset}`);
            console.table(resRoles.data);
            const roleId = await ask('🆔 ID del Rol a gestionar (0 para salir):');
            if (!roleId || roleId === '0') return;

            const allPerms = (await getClient().get('/admin/permisos')).data;
            const rolePerms = (await getClient().get(`/admin/roles/${roleId}/permisos`)).data;
            const rolePermIds = rolePerms.map(p => p.id);

            console.log(`\n${colors.bright}Permisos para el Rol [ID: ${roleId}]:${colors.reset}`);
            allPerms.forEach(p => {
                const has = rolePermIds.includes(p.id) ? `${colors.fg.green}[ACTIVO]${colors.reset}` : `${colors.fg.red}[INACTIVO]${colors.reset}`;
                console.log(`${p.id}. ${has} ${p.slug.padEnd(15)} - ${colors.dim}${p.descripcion}${colors.reset}`);
            });

            const permId = await ask('\n🆔 ID permiso para alternar (0 para volver):');
            if (permId && permId !== '0') {
                const res = await getClient().post('/admin/roles/toggle-permiso', { roleId: parseInt(roleId), permisoId: parseInt(permId) });
                console.log(`\n${colors.bg.green}${colors.fg.white} SUCCESS ${colors.reset} ${res.data.message}`);
                await this.perms();
            }
        } catch (e) { console.error(`${colors.fg.red}❌ Error.${colors.reset}`); }
    },

    async reports() {
        if (getAuth().role !== 'admin') return console.log(`${colors.fg.red}⛔ Acceso denegado.${colors.reset}`);
        try {
            const res = await getClient().get('/admin/reports/sales');
            console.log(`\n${colors.bg.blue}${colors.fg.white} 📈 BALANCE DE VENTAS ${colors.reset}`);
            console.table(res.data);
            const total = res.data.reduce((sum, s) => sum + parseFloat(s.precio), 0);
            console.log(`${colors.fg.green}${colors.bright}CAJA TOTAL: $${total.toFixed(2)}${colors.reset}\n`);
        } catch (e) { console.error(`${colors.fg.red}❌ Error en reporte.${colors.reset}`); }
    },

    logout() {
        if (fs.existsSync(TOKEN_FILE)) fs.unlinkSync(TOKEN_FILE);
        if (fs.existsSync(ROLE_FILE)) fs.unlinkSync(ROLE_FILE);
        if (fs.existsSync(USER_FILE)) fs.unlinkSync(USER_FILE);
        console.log(`${colors.fg.green}👋 Sesión terminada.${colors.reset}`);
    },

    help() {
        const { role } = getAuth();
        console.log(`\n${colors.fg.cyan}${colors.bright}🛠️ COMANDOS DISPONIBLES:${colors.reset}`);
        console.log(`  ${colors.bright}login${colors.reset}      - Autenticación guiada`);
        console.log(`  ${colors.bright}register${colors.reset}   - Crear cuenta corporativa`);
        console.log(`  ${colors.bright}list / ls${colors.reset}  - Ver inventario corporativo`);
        console.log(`  ${colors.bright}profile${colors.reset}    - Ver mi ficha técnica`);
        console.log(`  ${colors.bright}logout${colors.reset}     - Cerrar sesión`);

        if (role === 'user') {
            console.log(`\n${colors.fg.green}🛒 TIENDA:${colors.reset}`);
            console.log(`  buy         - Realizar compra`);
            console.log(`  myorders    - Historial de compras`);
        }
        if (role === 'admin') {
            console.log(`\n${colors.fg.red}🛡️  ADMINISTRACIÓN:${colors.reset}`);
            console.log(`  add         - Registrar producto`);
            console.log(`  edit        - Modificar producto (Asistente)`);
            console.log(`  delete      - Eliminar producto`);
            console.log(`  users       - Listar personal/clientes`);
            console.log(`  setrole     - Asignar rango a un usuario`);
            console.log(`  addrole     - Crear un nuevo rango (Rol)`);
            console.log(`  perms       - GESTIONAR PERMISOS (Granular)`);
            console.log(`  reports     - Auditoría de ventas`);
        }
        console.log(`\n  ${colors.dim}clear, exit${colors.reset}\n`);
    }
};

console.clear();
console.log(`${colors.fg.cyan}${colors.bright}==========================================`);
console.log(`    PANSILIUS COMMAND CENTER v2.8 PRO`);
console.log(`==========================================${colors.reset}\n`);

updatePrompt();
rl.prompt();

rl.on('line', async (line) => {
    const parts = line.trim().split(/\s+/);
    const cmd = parts.shift().toLowerCase();
    if (cmd === 'exit') process.exit(0);
    if (cmd === 'clear' || cmd === 'cls') { console.clear(); updatePrompt(); rl.prompt(); return; }
    if (commands[cmd]) { await commands[cmd](parts); }
    else if (cmd !== '') { console.log(`${colors.fg.red}❓ Comando no reconocido.${colors.reset}`); }
    updatePrompt();
    rl.prompt();
});
