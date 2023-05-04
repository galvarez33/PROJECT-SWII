const { MongoClient } = require('mongodb');

/**
 * Class to manage database access.
 */
const Database = class {
  constructor() {
    this.conn = null;
  }

  async initializeDatabase() {
    conn = await MongoClient.connect(process.env.MONGO_URI);
  }

  getDatabase() {
    return this.conn;
  }
};

module.exports = {
  initializeConnection
}
