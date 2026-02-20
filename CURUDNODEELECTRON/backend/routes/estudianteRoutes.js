const express = require('express');
const router = express.Router();
const estudianteController = require('../controllers/estudianteController');

router.get('/estudiantes', estudianteController.getAllEstudiantes);
router.post('/estudiantes', estudianteController.createEstudiante);
router.put('/estudiantes/:id', estudianteController.updateEstudiante); 
module.exports = router;