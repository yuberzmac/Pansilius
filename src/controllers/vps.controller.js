const { Client } = require('ssh2');
const pool = require('../config/db');

exports.listVps = async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT host, username, alias FROM vps_remotas ORDER BY created_at DESC');
        res.json(rows);
    } catch (e) { res.status(500).json({ message: 'Error en DB', error: e.message }); }
};

exports.addVps = async (req, res) => {
    // ... (código existente)
};

exports.deleteVps = async (req, res) => {
    const { host } = req.params;
    try {
        await pool.execute('DELETE FROM vps_remotas WHERE host = ?', [host]);
        res.json({ message: 'VPS eliminada' });
    } catch (e) { res.status(500).json({ message: 'Error al eliminar', error: e.message }); }
};

exports.getVpsStatus = async (req, res) => {
    const { host } = req.params;
    try {
        const [rows] = await pool.execute('SELECT * FROM vps_remotas WHERE host = ?', [host]);
        const vps = rows[0];
        if (!vps) return res.status(404).json({ message: 'No encontrada' });

        const conn = new Client();
        conn.on('ready', () => {
            // Comando avanzado: RAM (MB), DISCO, UPTIME y LOAD AVERAGE
            const cmd = `free -m && echo "---" && df -h / | tail -1 && echo "---" && uptime`;
            conn.exec(cmd, (err, stream) => {
                if (err) return res.status(500).json({ message: 'Error SSH' });
                let output = '';
                stream.on('data', (d) => output += d.toString());
                stream.on('close', () => {
                    conn.end();
                    const parts = output.split('---');
                    
                    // Parseo de RAM
                    const ramLines = parts[0].trim().split('\n');
                    const ramValues = ramLines[1].split(/\s+/); // [mem:, total, used, free...]
                    
                    // Parseo de Disco
                    const diskValues = parts[1].trim().split(/\s+/);
                    
                    // Parseo de Uptime y Load
                    const uptimeInfo = parts[2].trim();

                    res.json({ 
                        ram: { total: ramValues[1], used: ramValues[2], percent: Math.round((ramValues[2]/ramValues[1])*100) },
                        disk: { total: diskValues[1], used: diskValues[2], percent: diskValues[4].replace('%','') },
                        uptime: uptimeInfo
                    });
                });
            });
        }).on('error', (err) => res.status(500).json({ message: err.message }))
          .connect({ host: vps.host, port: 22, username: vps.username, password: vps.password, readyTimeout: 10000 });
    } catch (e) { res.status(500).json({ message: e.message }); }
};
