module.exports = {
  development: {
    username: process.env.DB_USERNAME || "superalimento_mzwz_user",
    password: process.env.DB_PASSWORD || "uE3qs2GoFPG42JTWWo52VLcX80vTNPnP",
    database: process.env.DB_NAME || "superalimento_mzwz",
    host: process.env.DB_HOST || "dpg-d6otvchr0fns73dvph8g-a.oregon-postgres.render.com",
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  },

  test: {
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_TEST_NAME || "superalimento_mzwz_test",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "postgres"
  },

  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};