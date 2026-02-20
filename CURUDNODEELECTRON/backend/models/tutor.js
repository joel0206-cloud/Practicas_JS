const db = require('./db');

class Tutor {
  static async findAll() {
    const [rows] = await db.query('SELECT * FROM tutores ORDER BY created_at DESC');
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM tutores WHERE id = ?', [id]);
    return rows[0];
  }

  static async create({ nombre, email }) {
    const [result] = await db.query(
      'INSERT INTO tutores (nombre, email) VALUES (?, ?)',
      [nombre, email]
    );
    return { id: result.insertId, nombre, email };
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM tutores WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Tutor;
