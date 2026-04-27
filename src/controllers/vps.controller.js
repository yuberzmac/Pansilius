const { Client } = require('ssh2');
const pool = require('../config/db');

exports.listVps = async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT host, username, alias FROM vps_remotas ORDER BY created_at DESC');
        res.json(rows);
    } catch (e) { res.status(500).json({ message: 'Error en DB', error: e.message }); }
};

exports.addVps = async (req, res) => {
    let { host, username, password, alias } = req.body;
    if (!host || !username || !password) return res.status(400).json({ message: 'Faltan datos' });
    host = host.trim();
    username = username.trim();
    try {
        await pool.query('INSERT INTO vps_remotas (host, username, password, alias) VALUES (?, ?, ?, ?)', [host, username, password, alias || null]);
        res.json({ message: 'VPS guardada' });
    } catch (e) { res.status(500).json({ message: 'Error en DB', error: e.message }); }
};

exports.deleteVps = async (req, res) => {
    const host = req.params.host.trim();
    try {
        await pool.execute('DELETE FROM vps_remotas WHERE host = ?', [host]);
        res.json({ message: 'VPS eliminada' });
    } catch (e) { res.status(500).json({ message: 'Error al eliminar', error: e.message }); }
};

exports.getVpsStatus = async (req, res) => {
    const host = req.params.host.trim();
    try {
        const [rows] = await pool.execute('SELECT * FROM vps_remotas WHERE host = ?', [host]);
        const vps = rows[0];
        if (!vps) return res.status(404).json({ message: 'No encontrada' });

        const conn = new Client();
        conn.on('ready', () => {
            const cmd = `free -m && echo "---" && df -h / | tail -1 && echo "---" && uptime`;
            conn.exec(cmd, (err, stream) => {
                if (err) {
                    conn.end();
                    return res.status(500).json({ message: 'Error al ejecutar comando' });
                }
                let output = '';
                stream.on('data', (d) => output += d.toString());
                stream.on('close', () => {
                    conn.end();
                    const parts = output.split('---');
                    if(parts.length < 3) return res.status(500).json({ message: 'Respuesta incompleta del servidor' });
                    const ramLines = parts[0].trim().split('\n');
                    const ramValues = ramLines[1].split(/\s+/);
                    const diskValues = parts[1].trim().split(/\s+/);
                    const uptimeInfo = parts[2].trim();

                    res.json({ 
                        ram: { total: ramValues[1], used: ramValues[2], percent: Math.round((ramValues[2]/ramValues[1])*100) },
                        disk: { total: diskValues[1], used: diskValues[2], percent: diskValues[4].replace('%','') },
                        uptime: uptimeInfo
                    });
                });
            });
        })
        .on('keyboard-interactive', (name, instructions, instructionsLang, prompts, finish) => {
            // Esto responde automáticamente a la solicitud de contraseña del servidor
            finish([vps.password]);
        })
        .on('error', (err) => {
            console.error('Error SSH:', err.message);
            res.status(500).json({ message: 'Error: ' + err.message });
        })
        .connect({ 
            host: vps.host, 
            port: 22, 
            username: vps.username, 
            password: vps.password, 
            tryKeyboard: true, // Habilitamos el modo interactivo
            readyTimeout: 15000 
        });
    } catch (e) { res.status(500).json({ message: e.message }); }
};
