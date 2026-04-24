const pool = require('../config/db');

const buyItem = async (req, res) => {
  try {
    const { itemId } = req.body;
    const userId = req.user.id;

    // 1. Verificar si hay stock disponible
    const [rows] = await pool.execute('SELECT * FROM items WHERE id = ? AND estado = TRUE', [itemId]);
    const item = rows[0];

    if (!item) {
      return res.status(404).json({ message: 'Producto no encontrado o inactivo' });
    }

    if (item.stock <= 0) {
      return res.status(400).json({ message: 'Producto agotado' });
    }

    // 2. Restar stock y registrar la venta en una transacción
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      // Restar 1 al stock
      await connection.execute('UPDATE items SET stock = stock - 1 WHERE id = ?', [itemId]);
      
      // Registrar venta
      await connection.execute('INSERT INTO ventas (user_id, item_id) VALUES (?, ?)', [userId, itemId]);
      
      await connection.commit();
      res.json({ message: '¡Compra realizada con éxito!' });
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al procesar la compra', error: error.message });
  }
};

const getMyPurchases = async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await pool.execute(`
      SELECT v.id as venta_id, v.fecha, i.nombre, i.precio 
      FROM ventas v 
      JOIN items i ON v.item_id = i.id 
      WHERE v.user_id = ?
      ORDER BY v.fecha DESC
    `, [userId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener compras', error: error.message });
  }
};

const getAllSales = async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT v.id, u.username as cliente, i.nombre as producto, i.precio, v.fecha 
      FROM ventas v 
      JOIN users u ON v.user_id = u.id 
      JOIN items i ON v.item_id = i.id 
      ORDER BY v.fecha DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener reporte', error: error.message });
  }
};

module.exports = { buyItem, getMyPurchases, getAllSales };
