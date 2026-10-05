const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middlewares/authMiddleware')
const roleMiddleware = require('../middlewares/roleMiddleware')

router.get('/medicos', authMiddleware, userController.listarMedicos)
router.get('/pacientes', authMiddleware, roleMiddleware('medico', 'admin'), userController.listarPacientes)

module.exports = router
