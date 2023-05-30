const axios = require('axios');
const { wrapper } = require( 'axios-cookiejar-support');
const { CookieJar } = require( 'tough-cookie');

// Hacer post a login con ADMIN_TOKEN

// Hacer resto de operaciones

/**
 * Function to add found matches to database.
 * 
 * @param {Object} matches object containing matches to add to service.
 * @returns {Promise}
 */
async function updateService(matches) {
  // Setup cookies to store session
  const jar = new CookieJar();
  const client = wrapper(axios.create({ jar }));

  try {
    // Login as admin
    await login(client);

    // Insert or update matches
    Object.keys(matches).forEach(async (resource) => {
      await updateResource(client, resource, matches[resource]);
    });
    } catch {
    console.error('Could not update service');
  }
}

/**
 * Function to login in Scrapiffy as admin.
 * 
 * @param {axios.AxiosInstance} client Client to use for queries.
 */
async function login(client) {
  const data = { token: process.env.ADMIN_TOKEN };
  const headers = { "Content-Type": "application/json" };

  await client.post(`${process.env.SCRAPIFFY_URI}/login`, data, headers);
}

/**
 * Function to update a Specific resource with.
 * 
 * @param {axios.AxiosInstance} client Client to use for queries.
 * @param {String} resource Resource where the asset belongs.
 * @param {Array<Object>} assets List of assets to add/update.
 */
async function updateResource(client, resource, assets) {
  assets.forEach(async (asset) => {
    try {
      await addAsset(client, resource, asset);
    } catch {
      await updateAsset(client, resource, asset);
    }
  });
}

/**
 * Function to add a new asset to scrapiffy.
 * 
 * @param {axios.AxiosInstance} client Client to use for requests.
 * @param {String} resource Resource where the asset belongs.
 * @param {Object} asset Asset to add to scrapiffy.
 */
async function addAsset(client, resource, asset) {
  const headers = { "Content-Type": "application/json" };

  await client.post(`${process.env.SCRAPIFFY_URI}/recursos/${resource}`, asset, headers);
}

/**
 * Function to update an existing asset.
 * 
 * @param {axios.AxiosInstance} client Client to use for requests.
 * @param {String} resource Resource where the asset belongs.
 * @param {Object} asset Asset to add to scrapiffy.
 */
async function updateAsset(client, resource, asset) {
  const headers = { "Content-Type": "application/json" };

  asset.ocurrencias.forEach(async (ocurrencia) => {
    await client.put(`${process.env.SCRAPIFFY_URI}/recursos/${resource}/${asset.id}`, ocurrencia, headers);
  });
}

module.exports = updateService;