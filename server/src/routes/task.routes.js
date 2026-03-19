const express = require('express'); // Importa Express.
const router = express.Router(); // Crea un router modular (mini servidor de rutas)

const taskController = require('../controllers/task.controller'); // Importa el controlador

// Rutas

/* GET /api/v1/tasks */
router.get('/', taskController.obtenerTodas); // Cuando llegue un GET → ejecuta obtenerTodas

/* POST /api/v1/tasks */
router.post('/', taskController.crearTarea); // POST → crea tarea

/* DELETE /api/v1/tasks/:id */
router.delete('/:id', taskController.eliminarTarea); // DELETE con parámetro id → elimina tarea

module.exports = router; // Exporta el router para usarlo en la app principal