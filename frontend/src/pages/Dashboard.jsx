import { useEffect, useState } from 'react';

function Dashboard() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Aquí iría la llamada real al backend: axios.get('/api/items')
    setItems([
      { id: 1, nombre: 'Item Ejemplo 1', descripcion: 'Descripción del backend' },
      { id: 2, nombre: 'Item Ejemplo 2', descripcion: 'Otra descripción' },
    ]);
  }, []);

  return (
    <div>
      <h2>Dashboard de Items</h2>
      <p>Bienvenido. Aquí se listarán los productos desde el backend.</p>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            <strong>{item.nombre}</strong>: {item.descripcion}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
