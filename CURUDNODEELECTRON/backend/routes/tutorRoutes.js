const express = require('express');
const router = express.Router();
const tutorController = require('../controllers/tutorController');

router.get('/tutores', tutorController.getAllTutores);
router.get('/tutores/:id', tutorController.getTutorById);
router.post('/tutores', tutorController.createTutor);
router.delete('/tutores/:id', tutorController.deleteTutor);

module.exports = router;
