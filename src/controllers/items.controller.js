const pool = require('../config/db');

const getItems = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM items');
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
  const { nombre, descripcion, estado } = req.body;
  try {
    const [result] = await pool.execute(
      'INSERT INTO items (nombre, descripcion, estado) VALUES (?, ?, ?)',
      [nombre, descripcion, estado || false]
    );
    res.status(201).json({ id: result.insertId, nombre, descripcion, estado });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el item', error: error.message });
  }
};

const updateItem = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, estado } = req.body;
  try {
    const [result] = await pool.execute(
      'UPDATE items SET nombre = ?, descripcion = ?, estado = ? WHERE id = ?',
      [nombre, descripcion, estado, id]
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
