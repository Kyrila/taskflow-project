const express = require('express');
const app = express();

const taskRoutes = require('./src/routes/task.routes');

// Middleware para leer JSON
app.use(express.json()); // Permite que req.body funcione (parsea JSON).

// Rutas - Prefijo profesional de API
app.use('/api/v1/tasks', taskRoutes); // Monta el router bajo ese prefijo.

// Middleware global de manejo de errores
app.use((err, req, res, next) => { // Tiene 4 parámetros obligatorios → eso le dice a Express que es de errores + Se ejecuta cuando alguien hace throw o next(error)
    console.error(err); // Log para debugging
  
    // Mapeo semántico de errores conocidos (problemas del cliente)
    if (err.message === 'NOT_FOUND') {
      return res.status(404).json({ error: 'RESOURCE_NOT_FOUND' });
    }
  
    // Error genérico
    return res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' });
  });
  
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });

// Versionado: /v1 permite evolucionar la API sin romper clientes
// Modularidad: rutas separadas por dominio (tasks)
// Escalable: puedes añadir /users, /auth, etc.

// middleware -> Debe ir al FINAL porque Express ejecuta middlewares en orden + Si se pone antes, no capturará errores de rutas
// Debe tener 4 parámetros -> (err, req, res, next) + Si falta err, Express NO lo reconoce como manejador de errores
// Centraliza errores -> Se evita repetir try/catch en todos lados + Se mantiene el código limpio.