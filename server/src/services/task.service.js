
let tasks = [];
let currentId = 1; // Variable que lleva el control del siguiente ID disponible

/* Obtener todas las tareas */
function obtenerTodas() {
  return tasks;
}

/**
 * Crear una nueva tarea
 * @param {Object} data
 */
function crearTarea(data) { // Recibe un objeto data con la información de la tarea (por ejemplo: { title: "Estudiar" })
  const nuevaTarea = {
    id: currentId++,
    ...data, // Usa el operador spread (...) para copiar todas las propiedades de data dentro del objeto
  };

  tasks.push(nuevaTarea); // Añade la nueva tarea al array tasks
  return nuevaTarea;
}

/**
 * Eliminar una tarea por ID
 * @param {number} id
 */
function eliminarTarea(id) {
  const index = tasks.findIndex(task => task.id === Number(id)); // findIndex devuelve: El índice si lo encuentra y -1 si no existe.

  if (index === -1) { // Comprueba si no se encontró la tarea.
    throw new Error('NOT_FOUND');
  }

  const tareaEliminada = tasks.splice(index, 1); // splice elimina elementos del array. + index → posición a eliminar. + 1 → número de elementos a eliminar.
  return tareaEliminada[0];
}

module.exports = {
  obtenerTodas,
  crearTarea,
  eliminarTarea,
};