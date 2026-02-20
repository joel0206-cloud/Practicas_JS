const pool = require('../models/db');

const getAllEstudiantes = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT e.*, t.nombre AS tutor_nombre 
      FROM estudiantes e
      LEFT JOIN tutores t ON e.tutor_id = t.id
      LIMIT 100
    `);
    res.json(rows);
  } catch (error) {
    console.error('ERROR getAllEstudiantes:', error);
    res.status(500).json({ error: 'Error cargando estudiantes' });
  }
};

const createEstudiante = async (req, res) => {
  try {
    const { nombre, tutor_id } = req.body;
    
    const [result] = await pool.query(
      'INSERT INTO estudiantes (nombre, tutor_id) VALUES (?, ?)',
      [nombre, tutor_id || null]
    );
    
    res.status(201).json({ 
      id: result.insertId, 
      nombre, 
      tutor_id 
    });
  } catch (error) {
    console.error('ERROR createEstudiante:', error);
    res.status(500).json({ error: error.message });
  }
};

const updateEstudiante = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { nombre, tutor_id, calificacion } = req.body;
    
    // VERIFICAR que existe
    const [exist] = await pool.query('SELECT id FROM estudiantes WHERE id = ?', [id]);
    if (exist.length === 0) {
      return res.status(404).json({ error: 'Estudiante no encontrado' });
    }
    
    const [result] = await pool.query(
      'UPDATE estudiantes SET nombre = ?, tutor_id = ?, calificacion = ? WHERE id = ?',
      [nombre, tutor_id || null, calificacion || null, id]
    );
    
    res.json({ message: 'Estudiante actualizado' });
  } catch (error) {
    console.error('ERROR updateEstudiante:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllEstudiantes,
  createEstudiante,
  updateEstudiante
};
