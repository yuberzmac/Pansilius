#!/usr/bin/env node
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const API_URL = 'http://localhost:3000/api';
const TOKEN_FILE = path.join(__dirname, '.token');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '\x1b[35mPansilius > \x1b[0m' // Prompt color morado
});

const getClient = () => {
    let token = '';
    if (fs.existsSync(TOKEN_FILE)) {
        token = fs.readFileSync(TOKEN_FILE, 'utf8');
    }
    return axios.create({
        baseURL: API_URL,
        headers: { 'Authorization': `Bearer ${token}` }
    });
};

const commands = {
    async login(args) {
        const [username, password] = args;
        if (!username || !password) return console.log('Uso: login <usuario> <password>');
        try {
            const res = await axios.post(`${API_URL}/auth/login`, { username, password });
            fs.writeFileSync(TOKEN_FILE, res.data.token);
            console.log('✅ Login exitoso. Sesión guardada.');
        } catch (e) {
            console.error('❌ Error:', e.response?.data?.message || e.message);
        }
    },

    async list() {
        try {
            const res = await getClient().get('/items');
            if (res.data.length === 0) return console.log('No hay productos.');
            console.table(res.data.map(i => ({
                ID: i.id,
                Nombre: i.nombre,
                Descripción: i.descripcion,
                Estado: i.estado ? 'Activo' : 'Inactivo'
            })));
        } catch (e) {
            console.error('❌ Error:', e.response?.data?.message || 'Error de conexión');
        }
    },

    async add(args) {
        const [nombre, descripcion, estado = 'true'] = args;
        if (!nombre) return console.log('Uso: add <nombre> <desc> [estado]');
        try {
            await getClient().post('/items', { 
                nombre, 
                descripcion, 
                estado: estado === 'true' 
            });
            console.log(`✅ Producto "${nombre}" añadido.`);
        } catch (e) {
            console.error('❌ Error:', e.response?.data?.message || e.message);
        }
    },

    async delete(args) {
        const [id] = args;
        if (!id) return console.log('Uso: delete <id>');
        try {
            await getClient().delete(`/items/${id}`);
            console.log(`✅ ID ${id} eliminado.`);
        } catch (e) {
            console.error('❌ Error:', e.response?.data?.message || e.message);
        }
    },

    async profile() {
        try {
            const res = await getClient().get('/auth/profile');
            console.log('\n--- MI PERFIL ---');
            console.log('Usuario:', res.data.username);
            console.log('Nombre:', res.data.nombre || 'No definido');
            console.log('Teléfono:', res.data.telefono || 'No definido');
            console.log('-----------------\n');
        } catch (e) {
            console.error('❌ Error:', e.response?.data?.message || e.message);
        }
    },

    help() {
        console.log(`
Comandos Disponibles:
  login <u? <p>  - Iniciar sesión
  list           - Listar productos
  add <n> <d>    - Añadir producto
  delete <id>    - Borrar producto
  profile        - Ver mi perfil
  clear          - Limpiar pantalla
  exit           - Salir
        `);
    }
};

console.log('\x1b[35m');
console.log('####################################');
console.log('#   BIENVENIDO A PANSILIUS CLI     #');
console.log('#   Escribe "help" para comandos   #');
console.log('####################################');
console.log('\x1b[0m');

rl.prompt();

rl.on('line', async (line) => {
    const [cmd, ...args] = line.trim().split(/\s+/);

    if (cmd === 'exit') {
        process.exit(0);
    } else if (cmd === 'clear') {
        console.clear();
    } else if (commands[cmd]) {
        await commands[cmd](args);
    } else if (cmd !== '') {
        console.log(`Comando desconocido: "${cmd}". Escribe "help" para ver la lista.`);
    }

    rl.prompt();
}).on('close', () => {
    console.log('\n¡Adiós!');
    process.exit(0);
});
