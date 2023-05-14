const express = require('express');
const resourceSchema = require('../schemas/resource.json');
const resourcePutSchema = require("../schemas/resourcePut.json");
const router = express.Router();
const { Database } = require("../scripts/database");

// Load schema beforehand
const Ajv = require('ajv/dist/2020');
const { resolveSchema } = require('ajv/dist/compile');
const ajv = new Ajv();

ajv.addSchema(resourceSchema, 'resource');
ajv.addSchema(resourcePutSchema, "resourcePut");

/** GET: Method to get list of resources  */
router.get('/', async function (req, res, next) {
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
    sendResponse(res, 200, response);
  } else {
    sendResponse(res, 204, "No hay contenido");
  }
});

router.post('/', async function (req, res, next) {
  const admin = checkAdmin(req, res);
  if (admin) {
    const data = req.body;
    const valid = validateSchema("resource", req, res);
    if (valid) {
      // 2. Añadir en mongo recurso
      const databaseManager = Database.getInstance();
      const db = databaseManager.client.db("scrapiffy");
      const mongoResponse = await db.collection("resources").insertOne({
        _id: data.id,
        descripcion: data.descripcion
      });

      // 3. Devolver respuesta
      const response = JSON.stringify({
        id: mongoResponse.insertedId
      });
      sendResponse(res, 201, response);
    }
  }
});

router.put('/:idRecurso', async function (req, res, next) {
  const admin = checkAdmin(req, res);
  if (admin) {
    const valid = validateSchema("resourcePut", req, res)
    const data = req.body;

    if (valid) {
      // 2. Añadir en mongo recurso
      const databaseManager = Database.getInstance();
      const db = databaseManager.client.db("scrapiffy");

      const updateDoc = {
        $set: {
          descripcion: data.descripcion
        },
      };

      await db.collection("resources").updateOne({ _id: req.params.idRecurso }, updateDoc);

      // 3. Devolver respuesta
      sendResponse(res, 200, "Todo correcto");
    }
  }
});

router.delete('/:idRecurso', async function (req, res, next) {
  //const admin = checkAdmin(req, res);
  const admin = true;
  if (admin) {
    // 2. Añadir en mongo recurso
    const databaseManager = Database.getInstance();
    const db = databaseManager.client.db("scrapiffy");
    const mongoResponse = await db.collection("resources").deleteOne({ _id: req.params.idRecurso });

    // 3. Devolver respuesta
    if (mongoResponse.deletedCount) {
      sendResponse(res, 200, "Todo correcto");
    } else {
      sendResponse(res, 404, `El recurso ${req.params.idRecurso} no existe`);
    }
  }
});

function checkAdmin(req, res) {
  if (req.user && req.user.admin) {
    return true;
  }
  else {
    if (req.user) {
      sendResponse(res, 403, "No se dispone de los permisos necesarios para realizar esta operación");
    }
    else {
      sendResponse(res, 401, "Esta operación requiere autentificación");
    }
  }
  return false;
}

function validateSchema(schema, req, res) {
  const validate = ajv.getSchema(schema);
  const valid = validate(req.body);
  
  if (!valid) {
    sendResponse(res, 400, "Formato incorrecto");
  }

  return valid;
}

function sendResponse(res, statusCode, response) {
  res.contentType("json");
  res.statusCode = statusCode;
  res.send(response);
}

router.get('/:idRecurso/:idActivo', function (req, res, next) {
  // 1. Comprueba en Mongo si hay activo

  // 2. Si hay, lo devuelve, si no devuleve 404
});

router.post('/:idRecurso/:idActivo', function (req, res, next) {
  // 1. Comprobar admin

  // 2. Añadir recurso

  // 3. Devolver recursos
});

router.put('/:idRecurso/:idActivo', function (req, res, next) {
  // 1. Comprobar admin

  // 2. Añadir recurso

  // 3. Devolver recursos
});

router.delete('/:idRecurso/:idActivo', function (req, res, next) {
  // 1. Comprobar admin

  // 2. Añadir recurso

  // 3. Devolver recursos
});

module.exports = router;