import asyncHandler from "express-async-handler";
import sql from "mssql";
 

// const config = {
//   user: 'admin1',
//   password: 'admin1',
//   server: "DESKTOP-RREMJUE",
//   database: "taco_traceabilityy",
//   options: {
//     encrypt: false, // Change to true if you're using SSL
//     trustServerCertificate: false, // Change to true if using self-signed certificates
//   },
// };

const config = {
  user: 'admin2',
  password: 'reset@123',
  server: "REP-TRACE",
  database: "replus_treceability",
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


export const fetchData = asyncHandler(async (request, response) => {
  try {
    const result = await pool.request().query("SELECT TOP 10 * FROM [dbo].[testData]");
    
    // Send response only if there are no errors
    response.status(200).json({ status: "success", data: result.recordset });
  } catch (error) {
    // Handle errors and send error response
    console.error("Error while fetching records:", error);
    response.status(500).json({ status: "error", msg: "Error while fetching records" });
  }
});



//for AddData

export const addData = asyncHandler(async (request, response) => {
  const data = request.body;

  console.log('inserted data ',data.sr_no,data.username,data.email,data.password)

  // Validate input data
  if (data.sr_no == null || data.username == "" || data.email == "" || data.password == "") {
    response.status(400).json({ status: "error", msg: "Please fill all details" });
    return; // Exit the function if validation fails
  }

  try {
    // Assuming 'pool' is your MSSQL ConnectionPool
    const pool = await sql.connect(config);
     
    // Execute the INSERT query with parameterized values
    const result = await pool.request()
      .input('sr_no', sql.Int, data.sr_no)
      .input('username', sql.VarChar(200), data.username)
      .input('email', sql.VarChar(200), data.email)
      .input('password', sql.VarChar(200), data.password)
 
      .query(
        "INSERT INTO [taco_traceabilityy].[dbo].[testData] " +
        "(sr_no, username, email, password ) " +  
        "VALUES " +
        "(@sr_no, @username, @email, @password)"
      );

    response.status(200).json({ status: "success", msg: "Record inserted" });
  } catch (error) {
    console.error("Error while inserting record:", error);
    response.status(500).json({ status: "error", msg: "Error while inserting record" });
  }
});




//for Update Data

export const updateData = asyncHandler(async (request, response) => {
  const data = request.body;

  console.log('updated data ', data.sr_no, data.username, data.email, data.password);

  // Validate input data
  if (data.sr_no == null || data.username == "" || data.email == "" || data.password == "") {
    response.status(400).json({ status: "error", msg: "Please fill all details" });
    return; // Exit the function if validation fails
  }

  try {
    // Assuming 'pool' is your MSSQL ConnectionPool
    const pool = await sql.connect(config);
     
    // Execute the UPDATE query with parameterized values
    const result = await pool.request()
      .input('sr_no', sql.Int, data.sr_no)
      .input('username', sql.VarChar(200), data.username)
      .input('email', sql.VarChar(200), data.email)
      .input('password', sql.VarChar(200), data.password)
      .query(
        "UPDATE [taco_traceabilityy].[dbo].[testData] " +
        "SET username = @username, email = @email, password = @password " +
        "WHERE sr_no = @sr_no"
      );

    if (result.rowsAffected[0] > 0) {
      response.status(200).json({ status: "success", msg: "Record updated" });
    } else {
      response.status(404).json({ status: "error", msg: "Record not found" });
    }
  } catch (error) {
    console.error("Error while updating record:", error);
    response.status(500).json({ status: "error", msg: "Error while updating record" });
  }
});




//for deleteData
export const deleteData = asyncHandler(async (request, response) => {
  const data = request.body;

  console.log('deleted data ', data.sr_no);

  // Validate input data
  if (data.sr_no == null) {
    response.status(400).json({ status: "error", msg: "Please provide the record ID" });
    return; // Exit the function if validation fails
  }

  try {
    // Assuming 'pool' is your MSSQL ConnectionPool
    const pool = await sql.connect(config);
     
    // Execute the DELETE query with parameterized values
    const result = await pool.request()
      .input('sr_no', sql.Int, data.sr_no)
      .query(
        "DELETE FROM [taco_traceabilityy].[dbo].[testData] " +
        "WHERE sr_no = @sr_no"
      );

    if (result.rowsAffected[0] > 0) {
      response.status(200).json({ status: "success", msg: "Record deleted" });
    } else {
      response.status(404).json({ status: "error", msg: "Record not found" });
    }
  } catch (error) {
    console.error("Error while deleting record:", error);
    response.status(500).json({ status: "error", msg: "Error while deleting record" });
  }
});



export const CountAll = asyncHandler(async (request, response) => {
  try {
    const result = await pool.request().query(
      `SELECT COUNT(*) AS userCount FROM [dbo].[testData]
      UNION ALL
      SELECT COUNT(*) AS emailCount FROM [dbo].[testData]
      UNION ALL
      SELECT COUNT(*) AS packCount FROM [dbo].[testData]
      UNION ALL
      SELECT COUNT(*) AS moduleCount FROM [dbo].[testData]
      UNION ALL
      SELECT COUNT(*) AS cellCount FROM [dbo].[testData] `
    );

    response.status(200).json({ status: "success", data: result.recordset });
  } catch (error) {
    console.error("Error while counting records:", error);
    response.status(500).json({ status: "error", msg: "Error while counting records" });
  }
});


// cell sorting data insert query
// export const insertCellSortingData = asyncHandler(async (request, response) => {
//    const data = request.body;

//   // console.log('inserted data ', data.sr_no, data.username, data.email, data.password);

//   // Validate input data
// if (
//   !data.sr_no ||
//   !data.battery_id ||
//   !data.battery_pack_name ||
//   !data.cell_qr_code ||
//   !data.battery_status ||
//   !data.module_name ||
//   !data.module_status ||
//   !data.module_id ||
//   !data.module_barcode ||
//   !data.cell_status ||
//   !data.date_time_start ||
//   !data.shift ||
//   !data.line ||
//   !data.username ||
//   !data.final_qr_code_status ||
//   !data.final_qr_code ||
//   !data.CustomerQRCode ||
//   !data.date_time_end ||
//   !data.total_module ||
//   !data.today_date ||
//   !data.rownum ||
//   !data.moduleNumber ||
//   !data.shift_incharge ||
//   !data.shift_supervisor ||
//   !data.range_from ||
//   !data.range_to ||
//   !data.cell_voltage ||
//   !data.cell_ir ||
//   !data.ocv_scanned_time ||
//   !data.ocv_machine_location ||
//   !data.usedBatches
// ) {
//   response.status(400).json({ status: "error", msg: "Please fill all details" });
//   return; // Exit the function if validation fails
// }

//   try {
//     // Assuming 'pool' is your MSSQL ConnectionPool
//     const pool = await sql.connect(config);
     
//     // Execute the INSERT query with parameterized values
//     const result = await pool.request()
//       // .input('sr_no', sql.Int, data.sr_no)
//       // .input('battery_id', sql.VarChar(200), data.battery_id)
//       // .input('battery_pack_name', sql.VarChar(200), data.battery_pack_name)
//       // .input('cell_qr_code', sql.VarChar(200), data.cell_qr_code)
//       .query(
//         `INSERT INTO [taco_traceabilityy].[dbo].[compress] (
//           [sr_no],
//           [battery_id],
//           [battery_pack_name],
//           [cell_qr_code],
//           [battery_status],
//           [module_name],
//           [module_status],
//           [module_id],
//           [module_barcode],
//           [cell_status],
//           [date_time_start],
//           [shift],
//           [line],
//           [username],
//           [final_qr_code_status],
//           [final_qr_code],
//           [CustomerQRCode],
//           [date_time_end],
//           [total_module],
//           [today_date],
//           [rownum],
//           [moduleNumber],
//           [shift_incharge],
//           [shift_supervisor],
//           [range_from],
//           [range_to],
//           [cell_voltage],
//           [cell_ir],
//           [ocv_scanned_time],
//           [ocv_machine_location],
//           [usedBatches]
//       ) VALUES (
//           @sr_no,
//           '19122023DJ19140000000000',
//           'Bajaj 8.9',
//           '03HCB00L0000BJD9N0230374',
//           'pending',
//           'A - 12p4s',
//           'complete',
//           'A - 12p4s-200281',
//           '01TMB06F100026DCK0200281',
//           'complete',
//           '2023-12-19 23:13:15',
//           3,
//           6,
//           @username,
//           'incomplete',
//           'DJ1914-DCK0007167',
//           '005467806001010DT636661223007167',
//           '2023-12-19 23:13:15',
//           4,
//           GETDATE(),  
//           'mid',
//           1,
//           'kalyani',
//           'aparna',
//           '3.230',
//           '3.235',
//           '3.234',
//           '1.912',
//           '2023-12-19 21:08:01',
//           'line5_line6',
//           '123'
//       )`
//       );

//     response.status(200).json({ status: "success", msg: "Record inserted" });
//   } catch (error) {
//     console.error("Error while inserting record:", error);
//     response.status(500).json({ status: "error", msg: "Error while inserting record" });
//   }
// });

