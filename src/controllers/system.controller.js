const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

exports.listDirectory = async (req, res) => {
    try {
        const dirPath = req.query.path || process.cwd();
        const files = await fs.readdir(dirPath, { withFileTypes: true });
        
        const result = files.map(file => ({
            name: file.name,
            isDirectory: file.isDirectory(),
            path: path.join(dirPath, file.name)
        }));

        res.json({ currentPath: dirPath, files: result });
    } catch (error) {
        res.status(500).json({ message: 'Error al leer directorio', error: error.message });
    }
};

exports.executeCommand = async (req, res) => {
    let { command, cwd } = req.body;
    if (!command) return res.status(400).json({ message: 'No se proporcionó un comando' });

    const currentDir = cwd || process.cwd();

    try {
        // --- MANEJO DE 'CD' (Navegación Real) ---
        if (command.trim().startsWith('cd ')) {
            const parts = command.trim().split(' ');
            const newPath = path.resolve(currentDir, parts[1] || '.');
            try {
                await fs.access(newPath);
                return res.json({ output: '', cwd: newPath });
            } catch (e) {
                return res.json({ error: `cd: no such file or directory: ${parts[1]}`, cwd: currentDir });
            }
        }

        // --- COMANDO ESPECIAL PARA VER EL CATÁLOGO ---
        if (command.trim() === 'pansi items') {
            const pool = require('../config/db');
            const [rows] = await pool.execute('SELECT id, nombre, precio, stock FROM items');
            let out = '\r\n\x1b[1;35m📦 CATÁLOGO DE PRODUCTOS (DB)\x1b[0m\r\n';
            out += '------------------------------------------------\r\n';
            rows.forEach(i => out += `🔹 ${i.nombre.padEnd(20)} | $${i.precio} | Stock: ${i.stock}\r\n`);
            return res.json({ output: out, cwd: currentDir });
        }

        // --- EJECUCIÓN DE COMANDOS DE SISTEMA REALES ---
        exec(command, { cwd: currentDir }, (error, stdout, stderr) => {
            res.json({
                output: stdout ? stdout.replace(/\n/g, '\r\n') : null,
                error: stderr ? stderr.replace(/\n/g, '\r\n') : (error ? error.message : null),
                cwd: currentDir
            });
        });

    } catch (err) {
        res.status(500).json({ error: 'Error: ' + err.message });
    }
};

exports.getFileContent = async (req, res) => {
    try {
        const filePath = req.query.path;
        const resolvedPath = path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath);
        const content = await fs.readFile(resolvedPath, 'utf-8');
        res.json({ content });
    } catch (error) {
        res.status(500).json({ message: 'Error al leer archivo', error: error.message });
    }
};

exports.saveFileContent = async (req, res) => {
    try {
        const { path: filePath, content } = req.body;
        const resolvedPath = path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath);
        await fs.writeFile(resolvedPath, content, 'utf-8');
        res.json({ message: 'Archivo guardado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al guardar archivo', error: error.message });
    }
};

exports.downloadFile = (req, res) => {
    let filePath = req.query.path;
    if (!filePath) return res.status(400).json({ message: 'Ruta no proporcionada' });
    
    const resolvedPath = path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath);
    
    res.download(resolvedPath, (err) => {
        if (err) {
            if (!res.headersSent) {
                console.error('Error en descarga:', err.message, 'Ruta:', resolvedPath);
                res.status(404).json({ message: 'El archivo ya no existe en el servidor', error: err.message });
            }
        }
    });
};

exports.deleteItem = async (req, res) => {
    try {
        let { path: itemPath } = req.body;
        const resolvedPath = path.isAbsolute(itemPath) ? itemPath : path.resolve(process.cwd(), itemPath);
        const stats = await fs.stat(resolvedPath);
        
        if (stats.isDirectory()) {
            await fs.rm(resolvedPath, { recursive: true, force: true });
        } else {
            await fs.unlink(resolvedPath);
        }
        
        res.json({ message: 'Eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar', error: error.message });
    }
};

exports.uploadFile = (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No se subió ningún archivo' });
    res.json({ message: 'Archivo subido con éxito', filename: req.file.filename });
};

exports.getLogs = async (req, res) => {
    try {
        const os = require('os');
        const homeDir = os.homedir();
        const outLogPath = path.join(homeDir, '.pm2/logs/pansilius-out.log');
        const errLogPath = path.join(homeDir, '.pm2/logs/pansilius-error.log');

        let output = '--- OUTPUT LOG ---\n';
        try {
            const outLog = await fs.readFile(outLogPath, 'utf8');
            output += outLog.split('\n').slice(-100).join('\n');
        } catch (e) { output += 'No se pudo leer el log de salida.\n'; }

        output += '\n\n--- ERROR LOG ---\n';
        try {
            const errLog = await fs.readFile(errLogPath, 'utf8');
            output += errLog.split('\n').slice(-100).join('\n');
        } catch (e) { output += 'No se pudo leer el log de errores.\n'; }

        res.json({ logs: output });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener logs', error: error.message });
    }
};

exports.getSystemStats = async (req, res) => {
    try {
        const os = require('os');
        const { exec } = require('child_process');
        
        // RAM Info
        const totalRam = (os.totalmem() / (1024 ** 3)).toFixed(2);
        const freeRam = (os.freemem() / (1024 ** 3)).toFixed(2);
        const usedRam = (totalRam - freeRam).toFixed(2);
        const ramPercent = ((usedRam / totalRam) * 100).toFixed(0);

        // Almacenamiento (vía comando de sistema para mayor precisión en Linux)
        exec('df -h / | tail -1', (err, stdout) => {
            let storage = { total: 'N/A', used: 'N/A', percent: '0' };
            if (!err) {
                const parts = stdout.trim().split(/\s+/);
                storage = {
                    total: parts[1],
                    used: parts[2],
                    percent: parts[4].replace('%', '')
                };
            }

            res.json({
                ram: { total: totalRam, used: usedRam, percent: ramPercent },
                storage: storage,
                uptime: (os.uptime() / 3600).toFixed(1)
            });
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener estadísticas', error: error.message });
    }
};

exports.getDatabaseTables = async (req, res) => {
    const pool = require('../config/db');
    try {
        const [tables] = await pool.execute('SHOW TABLES');
        const dbName = process.env.DB_NAME;
        const keyName = `Tables_in_${dbName}`;
        
        const result = await Promise.all(tables.map(async (t) => {
            const tableName = t[keyName];
            const [countRows] = await pool.execute(`SELECT COUNT(*) as total FROM ${tableName}`);
            return { name: tableName, rows: countRows[0].total };
        }));

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener tablas', error: error.message });
    }
};

exports.getStorageAnalysis = (req, res) => {
    const { exec } = require('child_process');
    // Analizar carpetas principales
    exec('du -sh node_modules src public uploads .git 2>/dev/null', (err, stdout) => {
        if (err) return res.status(500).json({ message: 'Error al analizar' });
        
        const lines = stdout.trim().split('\n');
        const analysis = lines.map(line => {
            const [size, name] = line.split('\t');
            return { name, size };
        });
        
        res.json(analysis);
    });
};
