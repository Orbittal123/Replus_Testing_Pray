// import { createConnection } from "mysql";

// const mysqlConnection = createConnection({
//   host: "localhost",
//   user: "root",
//   password: "1234",
//   database: "swastidb",
// });

// mysqlConnection.connect((err) => {
//   if (err) throw err;
//   console.log("Connected to MySQL database!");
// });

// export default mysqlConnection;


import sql from "mssql";

const config = {
  user: 'admin1',
  password: 'admin1',
  server: "DESKTOP-RREMJUE",
  database: "taco_traceabilityy",
  options: {
    encrypt: false, // Change to true if you're using SSL
    trustServerCertificate: false, // Change to true if using self-signed certificates
  },
};

const pool = new sql.ConnectionPool(config);

pool.connect().then(() => {
  console.log("Connected to MSSQL database!");
}).catch(err => {
  console.error("Error connecting to MSSQL database:", err);
});

export default pool;
