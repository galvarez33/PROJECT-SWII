const axios = require('axios');
const { wrapper } = require( 'axios-cookiejar-support');
const { CookieJar } = require( 'tough-cookie');

const jar = new CookieJar();
const client = wrapper(axios.create({ jar }));

// Hacer post a login con ADMIN_TOKEN

// Hacer resto de operaciones
