const express = require('express');
const router = express.Router();
const { Database } = require("../scripts/database");

/** GET: Method to get list of resources  */
router.get('/', async function(req, res, next) {
  // 1. Consulta a mongo -> recursos
  const databaseManager = Database.getInstance();
  const db = databaseManager.client.db("scrapiffy");
  const cursor = db.collection("resources").find();

  const resources = [];
  while (await cursor.hasNext()) {
    const resource = await cursor.next();
    resources.push(resource);
  }

  // 2. Devolver resultado 
  if (resources.length) {
    const response = JSON.stringify(resources);
    res.contentType("json");
    res.statusCode = 200;
    res.statusMessage = "Ok";
    res.send(response);
  } else {
    res.contentType("json");
    res.statusCode = 204;
    res.statusMessage = "No hay contenido";
    res.send(response);
  }
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