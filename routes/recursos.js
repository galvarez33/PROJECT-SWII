const express = require('express');
const resourceSchema = require('../schemas/resource.json');
const resourcePutSchema = require("../schemas/resourcePut.json");
const assetSchema = require("../schemas/asset.json");
const assetPutSchema = require("../schemas/assetPutSchema.json");
const router = express.Router();
const { Database } = require("../scripts/database");
const Libxml = require('node-libxml');
let libxml = new Libxml();
const { XMLParser, XMLBuilder, XMLValidator } = require("fast-xml-parser");
const parser = new XMLParser()


// Load schema beforehand
const Ajv = require('ajv/dist/2020');
const ajv = new Ajv();

ajv.addSchema(resourceSchema, 'resource');
ajv.addSchema(resourcePutSchema, "resourcePut");
ajv.addSchema(assetSchema, "assetSchema");
ajv.addSchema(assetPutSchema, "assetPutSchema");

const dtds = {
  resource: "../schemas/resource.dtd",
  resourcePut: "../schemas/resourcePut.dtd",
  assetSchema: "../schemas/asset.dtd",
  assetPutSchema: "../schemas/assetPutSchema.dtd"
}

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
  const admin = true //checkAdmin(req, res);
  if (admin) {
    const data = getContent(req, res, "resource")
    if (data) {
      // 2. Añadir en mongo recurso
      const databaseManager = Database.getInstance();
      const db = databaseManager.client.db("scrapiffy");
      const mongoResponse = await db.collection("resources").insertOne({
        _id: data.id,
        descripcion: data.descripcion
      });

      //crear colección para el recurso
      await db.createCollection(data.id);

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
    const data = getContent(req, res, "resourcePut")
    if (data) {
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

function getContent(req, res, validator) {
  if (req.is("application/xml")) {
    const wellFormed = libxml.loadXmlFromString(req.body);
    libxml.loadDtds([dtds[validator]]);
    const valid = libxml.validateAgainstDtds();
    if (valid && wellFormed) {
      return parser.parse(req.body);
    } else {
      sendResponse(res, 400, "Formato incorrecto");
      return null;
    }
  } else if (req.is("application/json")) {
    const data = req.body;
    const valid = validateSchema(validator, req, res);
    return valid ? data : null;
  } else sendResponse(res, 400, "Formato incorrecto");
}

router.get('/:idRecurso/:idActivo', async function (req, res, next) {
  // 1. Consulta a mongo -> activos
  const resource = req.params.idRecurso;
  const asset = req.params.idActivo;

  const databaseManager = Database.getInstance();
  const db = databaseManager.client.db("scrapiffy");
  const mongoResponse = await db.collection(resource).findOne({ _id: asset });

  if (mongoResponse) {
    console.log(mongoResponse)
    const ocurrencias = [];
    mongoResponse.ocurrencias.forEach(o => {
      ocurrencias.push({
        timestamp: o.timestamp,
        source: o.source
      });
    });

    const response = {
      id: mongoResponse.id,
      ocurrencias
    };
    sendResponse(res, 200, response);
  } else {
    sendResponse(res, 404, `El recurso ${asset} no existe`);
  }
});

router.post('/:idRecurso/:idActivo', async function (req, res, next) {
  const admin = true;//checkAdmin(req, res);
  if (admin) {
    const databaseManager = Database.getInstance();
    const db = databaseManager.client.db("scrapiffy");

    const collections = await db.collections();
    const resources = collections.map(c => c.s.namespace.collection);
    const resourceExists = resources.includes(req.params.idRecurso);

    if (resourceExists) {
      const data = getContent(req, res, "assetSchema");
      if (data) {
        // 2. Añadir en mongo recurso

        const mongoResponse = await db.collection(req.params.idRecurso).insertOne({
          _id: data.id,
          ocurrencias: data.ocurrencias
        });

        // 3. Devolver respuesta
        const response = JSON.stringify({
          id: mongoResponse.insertedId
        });
        sendResponse(res, 201, response);
      }
    } else {
      sendResponse(res, 404, `El recurso ${req.params.idRecurso} no existe`);
    }
  }
});

router.put('/:idRecurso/:idActivo', async function (req, res, next) {
  const admin = true;//checkAdmin(req, res);
  if (admin) {
    const databaseManager = Database.getInstance();
    const db = databaseManager.client.db("scrapiffy");

    const collections = await db.collections();
    const resources = collections.map(c => c.s.namespace.collection);
    const resourceExists = resources.includes(req.params.idRecurso);

    if (resourceExists) {
      const data = getContent(req, res, "assetPutSchema");
      if (data) {
        // 2. Añadir en mongo recurso
        const updateDoc = {
          $push: { ocurrencias: data }
        }
        const mongoResponse = await db.collection(req.params.idRecurso).updateOne({ _id: req.params.idActivo }, updateDoc);

        // 3. Devolver respuesta
        if (mongoResponse.modifiedCount === 1) {
          sendResponse(res, 200, "Todo correcto");
        } else {
          sendResponse(res, 404, `El activo ${req.params.idActivo} no existe`);
        }
      }
    } else {
      sendResponse(res, 404, `El recurso ${req.params.idRecurso} no existe`);
    }
  }
});

router.delete('/:idRecurso/:idActivo', async function (req, res, next) {
  const admin = true;//checkAdmin(req, res);
  if (admin) {
    const databaseManager = Database.getInstance();
    const db = databaseManager.client.db("scrapiffy");

    const collections = await db.collections();
    const resources = collections.map(c => c.s.namespace.collection);
    const resourceExists = resources.includes(req.params.idRecurso);

    if (resourceExists) {
      const mongoResponse = await db.collection(req.params.idRecurso).deleteOne({ _id: req.params.idActivo });

      // 3. Devolver respuesta
      if (mongoResponse.deletedCount) {
        sendResponse(res, 200, "Todo correcto");
      } else {
        sendResponse(res, 404, `El activo ${req.params.idActivo} no existe`);
      }
    } else {
      sendResponse(res, 404, `El recurso ${req.params.idRecurso} no existe`);
    }

  }
});

module.exports = router;