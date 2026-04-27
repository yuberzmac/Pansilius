import { useState, useEffect } from 'react';
import axios from 'axios';

function VpsManager() {
    const [vpsList, setVpsList] = useState([]);
    const [newVps, setNewVps] = useState({ host: '', username: '', password: '' });
    const [status, setStatus] = useState({});

    useEffect(() => {
        fetchVps();
    }, []);

    const fetchVps = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/system/vps', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setVpsList(res.data);
        } catch (e) { console.error('Error al cargar VPS'); }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/api/system/vps', newVps, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setNewVps({ host: '', username: '', password: '' });
            fetchVps();
        } catch (e) { alert('Error al agregar'); }
    };

    const checkStatus = async (host) => {
        setStatus(prev => ({ ...prev, [host]: 'Cargando...' }));
        try {
            const res = await axios.get(`http://localhost:3000/api/system/vps/${host}/status`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setStatus(prev => ({ ...prev, [host]: res.data }));
        } catch (e) { setStatus(prev => ({ ...prev, [host]: 'Error de conexión' })); }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>🌐 Gestor de VPS Remotas</h2>
            
            <form onSubmit={handleAdd} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '15px' }}>
                <h3>Agregar Nueva VPS</h3>
                <input type="text" placeholder="IP del Servidor" value={newVps.host} onChange={e => setNewVps({...newVps, host: e.target.value})} required /><br /><br />
                <input type="text" placeholder="Usuario SSH" value={newVps.username} onChange={e => setNewVps({...newVps, username: e.target.value})} required /><br /><br />
                <input type="password" placeholder="Contraseña SSH" value={newVps.password} onChange={e => setNewVps({...newVps, password: e.target.value})} required /><br /><br />
                <button type="submit">Guardar Servidor</button>
            </form>

            <div style={{ display: 'grid', gap: '20px' }}>
                {vpsList.map(vps => (
                    <div key={vps.host} style={{ border: '1px solid #ddd', padding: '15px' }}>
                        <strong>{vps.host}</strong> ({vps.username})
                        <button onClick={() => checkStatus(vps.host)} style={{ marginLeft: '10px' }}>Ver RAM/Disco</button>
                        
                        {status[vps.host] && (
                            <div style={{ marginTop: '10px', backgroundColor: '#f4f4f4', padding: '10px' }}>
                                <pre>{typeof status[vps.host] === 'string' ? status[vps.host] : `RAM:\n${status[vps.host].ram}\n\nDISCO:\n${status[vps.host].disk}`}</pre>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default VpsManager;
