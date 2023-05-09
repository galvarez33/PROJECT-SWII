require('dotenv').config();

const { MongoClient } = require('mongodb');

/**
 * Class to manage database access.
 */
const Database = class {
  constructor(uri) {
    this.conn = new MongoClient(uri);
  }

  async initializeDatabase() {
    this.conn = await this.conn.connect(process.env.MONGO_URI);
  }

  getDatabase() {
    return this.conn;
  }
};


module.exports = {
  Database
}
