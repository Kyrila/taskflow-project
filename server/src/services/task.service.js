// Persistencia simulada en memoria
let tasks = [];
let nextId = 1; // autoincremental simple

// Obtener todas las tareas
function obtenerTodas() {
  return tasks;
}

// Crear una nueva tarea
function crearTarea(data) {
  const nuevaTarea = {
    id: nextId++,
    ...data,
  };

  tasks.push(nuevaTarea);
  return nuevaTarea;
}

// Eliminar una tarea por ID
function eliminarTarea(id) {
  const index = tasks.findIndex(t => t.id === Number(id));

  if (index === -1) {
    throw new Error('NOT_FOUND');
  }

  const tareaEliminada = tasks.splice(index, 1); // splice elimina elementos del array + index → posición a eliminar + 1 → número de elementos a eliminar + splice devuelve un array con los elementos eliminados.
  return tareaEliminada[0];
}

module.exports = {
  obtenerTodas,
  crearTarea,
  eliminarTarea,
};