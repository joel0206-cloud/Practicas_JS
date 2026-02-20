const db = require('./db');

class Estudiante {
  static async findAll() {
    const [rows] = await db.query(
      `SELECT e.*, t.nombre AS tutor_nombre
       FROM estudiantes e
       LEFT JOIN tutores t ON e.tutor_id = t.id
       ORDER BY e.created_at DESC`
    );
    return rows;
  }

  static async create({ nombre, tutor_id }) {
    const [result] = await db.query(
      'INSERT INTO estudiantes (nombre, tutor_id) VALUES (?, ?)',
      [nombre, tutor_id]
    );
    return { id: result.insertId, nombre, tutor_id };
  }

   // UPDATE ← ESTA FALTABA
  static async update(id, { nombre, tutor_id, calificacion }) {
    const [result] = await db.query(
      'UPDATE estudiantes SET nombre = ?, tutor_id = ?, calificacion = ? WHERE id = ?',
      [nombre, tutor_id || null, calificacion || null, id]
    );
    return result.affectedRows > 0;
  }

  // GET por ID (opcional)
  static async findById(id) {
    const [rows] = await db.query(`
      SELECT e.*, t.nombre AS tutor_nombre 
      FROM estudiantes e
      LEFT JOIN tutores t ON e.tutor_id = t.id
      WHERE e.id = ?
    `, [id]);
    return rows[0];
  }

}




module.exports = Estudiante;
