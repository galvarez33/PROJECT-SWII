const express = require('express');
const resourceSchema = require('../schemas/resource.json');
const router = express.Router();
const { Database } = require("../scripts/database");

// Load schema beforehand
const Ajv = require('ajv/dist/2020');
const ajv = new Ajv();

ajv.addSchema(resourceSchema,'resource');

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

router.post('/', async function(req, res, next) {
  req.user = {
    admin : true
  }
// 1. Comprobar admin
if (req.user && req.user.admin){
  try {
    console.log('ping');
    const data = JSON.parse(req.body);
    const validate = ajv.getSchema('resource');
    const valid = validate(data);
    if (valid) {
      // 2. Añadir en mongo recurso
      const databaseManager = Database.getInstance();
      const db = databaseManager.client.db("scrapiffy");
      const mongoResponse = await db.collection("resources").insertOne({
        _id : data.id,
        description: data.description
      });
       // 3. Devolver respuesta
       const response = JSON.stringify({
          id : mongoResponse.insertedId
       });
        res.contentType("json");
        res.statusCode = 201;
        res.statusMessage = "Created";
        res.send(response);
    } else {
      throw new Error();
    }
  } catch {
    res.statusCode = 400;
    res.statusMessage = "Formato incorrecto";
    res.send();
  } 

}
else {
  if (req.user) {
    res.statusCode = 401;
    res.statusMessage = "Esta operación requiere autentificación";
    res.send();
  }
  else {
    res.contentType("json");
    res.statusCode = 403;
    res.statusMessage = "No se dispone de los permisos necesarios para realizar esta operación";
    res.send();
  }
}

 
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