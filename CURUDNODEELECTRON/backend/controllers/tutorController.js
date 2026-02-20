const Tutor = require('../models/tutor');

const getAllTutores = async (req, res, next) => {
  try {
    const tutores = await Tutor.findAll();
    res.json(tutores);
  } catch (err) {
    next(err);
  }
};

const getTutorById = async (req, res, next) => {
  try {
    const tutor = await Tutor.findById(req.params.id);
    if (!tutor) return res.status(404).json({ message: 'Tutor no encontrado' });
    res.json(tutor);
  } catch (err) {
    next(err);
  }
};

const createTutor = async (req, res, next) => {
  try {
    const { nombre, email } = req.body;
    if (!nombre || !email) {
      return res.status(400).json({ message: 'Nombre y email son obligatorios' });
    }
    const nuevo = await Tutor.create({ nombre, email });
    res.status(201).json(nuevo);
  } catch (err) {
    next(err);
  }
};
/*
const deleteTutor = async (req, res, next) => {
  try {
    const ok = await Tutor.delete(req.params.id);
    if (!ok) return res.status(404).json({ message: 'Tutor no encontrado' });
    res.json({ message: 'Tutor eliminado' });
  } catch (err) {
    next(err);
  }
};*/
const deleteTutor = async (req, res, next) => {
  try {
    console.log('🗑️ DELETE tutor ID:', req.params.id);
    
    const ok = await Tutor.delete(req.params.id);
    
    if (!ok) {
      console.log('❌ Tutor NO encontrado:', req.params.id);
      return res.status(404).json({ 
        success: false, 
        message: 'Tutor no encontrado' 
      });
    }
    
    console.log('✅ Tutor eliminado:', req.params.id);
    res.json({ 
      success: true,  // ← AGREGADO para frontend
      message: 'Tutor eliminado correctamente',
      deletedId: req.params.id
    });
    
  } catch (err) {
    console.error('❌ Error DELETE tutor:', err);
    next(err);
  }
}


module.exports = {
  getAllTutores,
  getTutorById,
  createTutor,
  deleteTutor
};
