import { useState } from 'react';

function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Registro con:', formData);
    alert('Usuario registrado (simulado).');
  };

  return (
    <div>
      <h2>Crear Cuenta</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Nombre" onChange={(e) => setFormData({...formData, name: e.target.value})} /><br /><br />
        <input type="email" placeholder="Email" onChange={(e) => setFormData({...formData, email: e.target.value})} /><br /><br />
        <input type="password" placeholder="Contraseña" onChange={(e) => setFormData({...formData, password: e.target.value})} /><br /><br />
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}

export default Register;
