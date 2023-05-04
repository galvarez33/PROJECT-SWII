const express = require('express');
const router = express.Router();

/** GET: Method to get list of resources  */
router.get('/', function(req, res, next) {
  // 1. Consulta a mongo -> recursos

  // 2. Devolver resultado 
  res.send('respond with a resource');
});

router.post('/', function(req, res, next) {
  // 1. Comprobar admin

  // 2. Añadir en mongo recurso

  // 3. Devolver respuesta
});

router.put('/:idRecurso', function(req, res, next) { 
  // 1. Comprobar admin

  // 2. Añadir recurso

  // 3. Devolver recursos
});

router.delete('/:idRecurso', function(req, res, next) { 
  // 1. Comprobar admin

  // 2. Añadir recurso

  // 3. Devolver recursos
});

router.get('/:idRecurso/:idActivo', function(req, res, next) {
  // 1. Comprueba en Mongo si hay activo
  
  // 2. Si hay, lo devuelve, si no devuleve 404
});

router.post('/:idRecurso/:idActivo', function(req, res, next) {
  // 1. Comprobar admin

  // 2. Añadir recurso

  // 3. Devolver recursos
});

router.put('/:idRecurso/:idActivo', function(req, res, next) {
  // 1. Comprobar admin

  // 2. Añadir recurso

  // 3. Devolver recursos
});

router.delete('/:idRecurso/:idActivo', function(req, res, next) {
  // 1. Comprobar admin

  // 2. Añadir recurso

  // 3. Devolver recursos
});

module.exports = router;