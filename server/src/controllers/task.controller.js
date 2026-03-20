
const taskService = require('../services/task.service'); // Importa el servicio que he creado antes.

/* GET /tasks */
function obtenerTodas(req, res) { // req (request): contiene datos de la petición. + res (response): se usa para enviar la respuesta al cliente.
  const tasks = taskService.obtenerTodas();
  return res.status(200).json(tasks); // 200 → OK (todo correcto).
}

/**
 * POST /tasks
 */
function crearTarea(req, res) {
  const data = req.body; // Extrae los datos enviados por el cliente en el body (JSON).

  // Validación defensiva
  if (!data || typeof data !== 'object') { // Comprueba que data exista. + que sea un objeto.
    return res.status(400).json({ error: 'INVALID_BODY' }); // Devuelve 400 Bad Request
  }

  if (!data.title || typeof data.title !== 'string') { //Comprueba que exista title. + que sea un string.
    return res.status(400).json({ error: 'TITLE_REQUIRED' });
  }

  try {
    const nuevaTarea = taskService.crearTarea({
      title: data.title, // Solo pasa el campo title (controla qué datos entran al sistema) + Guarda el resultado en nuevaTarea.
    });

    return res.status(201).json(nuevaTarea); // 201 Created → recurso creado correctamente.
  } catch (error) {
    return res.status(500).json({ error: 'INTERNAL_ERROR' }); // 500 Internal Server Error.
  }
}

/**
 * DELETE /tasks/:id
 */
function eliminarTarea(req, res) {
  const { id } = req.params; // Extrae el id de la URL. Ejemplo: /tasks/5 → id = "5"

  // Validación defensiva
  if (!id || isNaN(Number(id))) { // Comprueba que exista id. + que sea un número
    return res.status(400).json({ error: 'INVALID_ID' });
  }

  try {
    taskService.eliminarTarea(id);
    return res.status(204).send(); // 204 No Content → éxito sin contenido
  } catch (error) {
    if (error.message === 'NOT_FOUND') {
      return res.status(404).json({ error: 'TASK_NOT_FOUND' });
    }

    return res.status(500).json({ error: 'INTERNAL_ERROR' });
  }
}

module.exports = {
  obtenerTodas,
  crearTarea,
  eliminarTarea,
};