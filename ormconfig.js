const SnakeNamingStrategy = require('typeorm-naming-strategies').SnakeNamingStrategy;

module.exports = {
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  database: process.env.DATABASE_NAME,
  entities: [process.env.TYPEORM_ENTITIES],
  migrations: [process.env.TYPEORM_MIGRATION],
  namingStrategy: new SnakeNamingStrategy(),
  cli: {
    migrationsDir: process.env.TYPEORM_MIGRATION_DIR,
  },
  seeds: [process.env.TYPEORM_SEED],
  factories: [process.env.TYPEORM_FACTORY],
};
