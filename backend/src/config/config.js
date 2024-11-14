module.exports = {
  development: {
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "yvCcACLLfrIgHvXPxHcakJzeGeKMosLO", // Contraseña de tu base de datos
    database: process.env.DB_NAME || "railway", // Nombre de la base de datos
    host: process.env.DB_HOST || "junction.proxy.rlwy.net", // Host de la base de datos
    port: process.env.DB_PORT || 38840, // Puerto de la base de datos
    dialect: "mysql"
  },
  test: {
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_TEST_NAME || "database_test",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "mysql"
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: "mysql"
  }
};
