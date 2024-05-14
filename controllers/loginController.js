import asyncHandler from "express-async-handler";
import mysqlConnection from "../database/mssqldb.js";
import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import sql from "mssql";
const salt = 10;

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


// export const registerUser = asyncHandler(async (request, response) => {
//   const data = request.body;

//   const sql = "select * from user where email = ?";
//   mysqlConnection.query(sql, [data.email], (err, result) => {
//     if (err) return response.json({ Error: "Login error in server" });
//     if (result.length > 0) {
//       return response.json({ error: "User Already Exist" });
//     } else {
//       const sql1 = "insert into user (`name`,`email`,`password`) values(?)";
//       bcrypt.hash(data.password.toString(), salt, (err, hash) => {
//         if (err) return response.json({ Error: "Error for hasshing passowrd" });
//         const values = [data.name, data.email, hash];
//         mysqlConnection.query(sql1, [values], (error, result) => {
//           if (error) {
//             response.status(500).json({
//               status: "error",
//               msg: "Error while inserting records",
//             });
//           }
//           response
//             .status(200)
//             .json({ status: "success", msg: "Record inserted" });
//         });
//       });
//     }
//   });
// });

// export const checkLogin = asyncHandler(async (request, response) => {
//   const data = request.body;

//   const sql = "select * from account where email = ?";
//   mysqlConnection.query(sql, [data.email], (err, result) => {
//     if (err)
//       return response
//         .status(404)
//         .json({ message: "Logged In error in server" });
//     if (result.length > 0) {
//       bcrypt.compare(
//         data.password.toString(),
//         result[0].password,
//         (err, res) => {
//           if (err)
//             return response
//               .status(404)
//               .json({ message: "Logged In error in server.." });
//           if (res) {
//             const name = result[0].name;
//             const token = Jwt.sign({ name }, "jbnbvgopoiuyghfgbgfrggfgfgf", {
//               expiresIn: "1d",
//             });
//             return response.status(200).json({ message: "Logged In" ,token:token});
//           } else {
//             return response
//               .status(404)
//               .json({ message: "Invalid Credentials" });
//           }
//         }
//       );
//     } else {
//       return response.status(404).json({ message: "Invalid Credentials" });
//     }
//   });
// });
 


export const checkLogin1 = asyncHandler(async (request, response) => {
  try {
    const data = request.body;

    console.log(data); // Log the request body to inspect its structure

    if (!data || !data.email || !data.password) {
      return response.status(400).json({ message: 'Email and password are required' });
    }

    const result = await pool
      .request()
      .input('email', sql.VarChar, data.email)
      .query('SELECT * FROM account WHERE email = @email');

      console.log('querry::::',result.query);
      console.log(result.recordset);
     

    if (result.recordset.length === 0) {
      return response.status(404).json({ message: 'Invalid Credentials' });
    }

    const user = result.recordset[0];

    console.log('user',user.password);

    bcrypt.compare(data.password.toString(), user.password, (err, passwordMatch) => {
      if (err) {
        console.error('Error comparing passwords:', err);
        return response.status(500).json({ message: 'Error comparing passwords' });
      }

      if (passwordMatch) {
        const token = Jwt.sign({ username: user.username }, 'your_secret_key', { expiresIn: '1d' });
        return response.status(200).json({ message: 'Logged In indrajit ', token: token });
      } else {
        return response.status(404).json({ message: 'Invalid Credentials' });
      }
    });
  } catch (err) {
    console.error('Error fetching data:', err);
    return response.status(500).json({ message: 'Error fetching data' });
  }
});