const pool = require('../config/db');

const getItems = async (req, res) => {
  try {
    // Si es admin (rol id 1), ve todo. Si es user, solo activos.
    const query = req.user.role === 'admin' 
      ? 'SELECT * FROM items' 
      : 'SELECT * FROM items WHERE estado = TRUE';
      
    const [rows] = await pool.execute(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los items', error: error.message });
  }
};

const getItemById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.execute('SELECT * FROM items WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Item no encontrado' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el item', error: error.message });
  }
};

const createItem = async (req, res) => {
  const { nombre, descripcion, precio, stock, estado } = req.body;
  try {
    const [result] = await pool.execute(
      'INSERT INTO items (nombre, descripcion, precio, stock, estado) VALUES (?, ?, ?, ?, ?)',
      [nombre, descripcion, precio || 0, stock || 0, estado !== undefined ? estado : true]
    );
    res.status(201).json({ id: result.insertId, nombre, descripcion, precio, stock, estado });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el item', error: error.message });
  }
};

const updateItem = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, stock, estado } = req.body;
  try {
    const [result] = await pool.execute(
      'UPDATE items SET nombre = ?, descripcion = ?, precio = ?, stock = ?, estado = ? WHERE id = ?',
      [nombre, descripcion, precio, stock, estado, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Item no encontrado' });
    res.json({ message: 'Item actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el item', error: error.message });
  }
};

const deleteItem = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.execute('DELETE FROM items WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Item no encontrado' });
    res.json({ message: 'Item eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el item', error: error.message });
  }
};

module.exports = { getItems, getItemById, createItem, updateItem, deleteItem };
