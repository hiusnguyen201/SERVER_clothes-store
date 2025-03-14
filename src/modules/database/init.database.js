import moment from 'moment-timezone';
import { connectToMongoDb } from '#src/modules/database/mongodb.database';

const databaseStrategies = {
  mongodb: connectToMongoDb,
};

class Database {
  static instance = null;
  static options = {
    type: null, // mongodb, postgres, mysql
    logging: false,
    timezone: null,
  };

  constructor(options) {
    if (!options?.timezone) {
      moment.utc().format();
    } else {
      moment.tz(options.timezone).format();
    }

    this.connect(options);
  }

  connect(options) {
    const connectStrategy = databaseStrategies[options?.type];
    if (connectStrategy) {
      this.connection = connectStrategy(options);
    } else {
      throw new Error(`The database "${options?.type}" not found`);
    }
  }

  static getInstance(options) {
    if (!Database.instance) {
      Database.instance = new Database(options);
    }
    return Database.instance;
  }

  static async close() {
    if (Database.instance) {
      Database.instance.connection.close();
    }
  }
}

export default Database;
