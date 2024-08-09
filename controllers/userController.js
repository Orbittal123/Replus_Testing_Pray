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
    response.status(500).json({ status: "error", msg: "Error while fetching record" });
  }
});



//for AddData

export const addData = asyncHandler(async (request, response) => {
  const data = request.body;

  console.log('inserted data ',data.sr_no,data.username,data.email,data.password)

  // Validate input data
  if (data.sr_no == null || data.username == " || data.email == " || data.password == "") {
    response.status(400).json({ status: "error", msg: "Please fill all detail" });
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
        "INSERT INTO [taco_traceabilityy].[dbo].[testData]" +
        "(sr_no, username, email, password )" +  
        "VALUES" +
        "(@sr_no, @username, @email, @password)"
      );

    response.status(200).json({ status: "success", msg: "Record inserte" });
  } catch (error) {
    console.error("Error while inserting record:", error);
    response.status(500).json({ status: "error", msg: "Error while inserting recor" });
  }
});




//for Update Data

export const updateData = asyncHandler(async (request, response) => {
  const data = request.body;

  console.log('updated data ', data.sr_no, data.username, data.email, data.password);

  // Validate input data
  if (data.sr_no == null || data.username == " || data.email == " || data.password == "") {
    response.status(400).json({ status: "error", msg: "Please fill all detail" });
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



//user Api

//Cell_ sorting 
// export const insertCellSortingData = asyncHandler(async (request, response) => {
//   const data = request.body;

//   console.log('inserted cellsortingData data ', data);

//   // Validate input data
//   if (
//     !data.sr_no ||
//     !data.battery_id ||
//     !data.battery_pack_name ||
//     !data.cell_qr_code ||
//     !data.battery_status ||
//     !data.module_name ||
//     !data.module_status ||
//     !data.module_id ||
//     !data.module_barcode ||
//     !data.cell_status ||
//     !data.date_time_start ||
//     !data.shift ||
//     !data.line ||
//     !data.username ||
//     !data.final_qr_code_status ||
//     !data.final_qr_code ||
//     !data.CustomerQRCode ||
//     !data.date_time_end ||
//     !data.total_module ||
//     !data.today_date ||
//     !data.rownum ||
//     !data.moduleNumber ||
//     !data.shift_incharge ||
//     !data.shift_supervisor ||
//     !data.range_from ||
//     !data.range_to ||
//     !data.cell_voltage ||
//     !data.cell_ir ||
//     !data.ocv_scanned_time ||
//     !data.ocv_machine_location ||
//     !data.usedBatches
//   ) {
//     response.status(400).json({ status: "error", msg: "Please fill all details" });
//     return; // Exit the function if validation fails
//   }

//   try {
//     // Assuming 'pool' is your MSSQL ConnectionPool
//     const pool = await sql.connect(config);

//      // Get the current date and time in ISO format
//      const currentDate = new Date().toISOString();

//     // Execute the INSERT query with parameterized values
//     const result = await pool.request()
//     .input('sr_no', sql.Int, data.sr_no)
//     .input('battery_id', sql.VarChar(200), data.battery_id)
//     .input('battery_pack_name', sql.VarChar(200), data.battery_pack_name)
//     .input('cell_qr_code', sql.VarChar(200), data.cell_qr_code)
//     .input('battery_status', sql.VarChar(200), data.battery_status)


//     .input('module_name', sql.VarChar(200), data.module_name)
//     .input('module_status', sql.VarChar(200), data.module_status)
//     .input('module_id', sql.VarChar(200), data.module_id)
//     .input('module_barcode', sql.VarChar(200), data.module_barcode)
//     .input('cell_status', sql.VarChar(200), data.cell_status)


//     .input('date_time_start', sql.VarChar(200), data.date_time_start)
//     .input('shift', sql.Int, data.shift)
//     .input('line', sql.Int, data.line)
//     .input('username', sql.VarChar(200), data.username)
//     .input('final_qr_code_status', sql.VarChar(200), data.final_qr_code_status)


//     .input('final_qr_code', sql.VarChar(200), data.final_qr_code)
//     .input('CustomerQRCode', sql.VarChar(200), data.CustomerQRCode)
//     .input('date_time_end', sql.VarChar(200), data.date_time_end)
//     .input('total_module', sql.Int, data.total_module)
//     .input('today_date', sql.VarChar(200), currentDate)


//     .input('rownum', sql.VarChar(200), data.rownum)
//     .input('moduleNumber', sql.Int, data.moduleNumber)
//     .input('shift_incharge', sql.VarChar(200), data.shift_incharge)
//     .input('shift_supervisor', sql.VarChar(200), data.shift_supervisor)
//     .input('range_from', sql.VarChar(200), data.range_from)


//     .input('range_to', sql.VarChar(200), data.range_to)
//     .input('cell_voltage', sql.VarChar(200), data.cell_voltage)
//     .input('cell_ir', sql.VarChar(200), data.cell_ir)
//     .input('ocv_scanned_time', sql.VarChar(200), data.ocv_scanned_time)
//     .input('ocv_machine_location', sql.VarChar(200), data.ocv_machine_location)
//     .input('usedBatches', sql.VarChar(200), data.usedBatches)
//     .query(
//       "INSERT INTO [taco_traceabilityy].[dbo].[compress] " +
//       "(sr_no, battery_id, battery_pack_name, cell_qr_code, battery_status, module_name, " +
//       "module_status, module_id, module_barcode, cell_status, date_time_start, shift, " +
//       "line, username, final_qr_code_status, final_qr_code, CustomerQRCode, date_time_end, " +
//       "total_module, today_date, rownum, moduleNumber, shift_incharge, shift_supervisor, " +
//       "range_from, range_to, cell_voltage, cell_ir, ocv_scanned_time, ocv_machine_location, usedBatches) " +
//       "VALUES " +
//       "(@sr_no, @battery_id, @battery_pack_name, @cell_qr_code, @battery_status, @module_name, " +
//       "@module_status, @module_id, @module_barcode, @cell_status, @date_time_start, @shift, " +
//       "@line, @username, @final_qr_code_status, @final_qr_code, @CustomerQRCode, @date_time_end, " +
//       "@total_module, @today_date, @rownum, @moduleNumber, @shift_incharge, @shift_supervisor, " +
//       "@range_from, @range_to, @cell_voltage, @cell_ir, @ocv_scanned_time, @ocv_machine_location, @usedBatches)"
//     );

//       // console.log(result);

//     response.status(200).json({ status: "success", msg: "Record inserted" });
//   } catch (error) {
//     console.error("Error while inserting record:", error);
//     response.status(500).json({ status: "error", msg: "Error while inserting record" });
//   }
// });

 //Pack Assembly



// export const getModuleBarcode = asyncHandler(async (request, response) => {
//   const {data} = request.body;

//   console.log(data);

//   try {
//     const pool = await sql.connect(config);

//     const result = await pool
//       .request()
//       .query(`SELECT TOP (1000) [sr_no], [temp_pack_no], [voltage], [ir], [module_barcode]
//               FROM [taco_traceabilityy].[dbo].[voltage_ir_details]
//               WHERE module_barcode = '${data.moduleBarcode}'`);

//               console.log('querry::::',result.query);
//               console.log(result.recordset);

//     response.status(200).json({ status: "success", msg: "Record Fetch Successfully", data: result.recordset });
//   } catch (error) {
//     console.error("Error while fetching record:", error);
//     response.status(500).json({ status: "error", msg: "Error while fetching record" });
//   }
// });

// export const getModuleBarcode = asyncHandler(async (request, response) => {
//   try {
//     const { moduleBarcode } = request.body; // Extract moduleBarcode from request body

//     console.log('Received moduleBarcode:', moduleBarcode);

//     // Check if moduleBarcode is present in the request
//     if (!moduleBarcode) {
//       return response.status(400).json({ status: 'error', msg: 'Module barcode is missing in the request body' });
//     }

//     const pool = await sql.connect(config);

//     const result = await pool
//       .request()
//       .query(`SELECT TOP (1000) [sr_no], [voltage_diff], [ir_diff], [module_barcode], [status]
//                      FROM [replus_treceability].[dbo].[voltage_ir_status_details]
//                    WHERE module_barcode = '${moduleBarcode}'`);

//     console.log('SQL Query:', result.query);
//     console.log('Query Result:', result.recordset);

//     response.status(200).json({ status: 'success', msg: 'Records fetched successfully', data: result.recordset });
//   } catch (error) {
//     console.error('Error while fetching records:', error);
//     response.status(500).json({ status: 'error', msg: 'Error while fetching records' });
//   }
// });


// Handler function using asyncHandler for error handling
// export const getModuleBarcode = asyncHandler(async (request, response) => {
//   try {
//     const { moduleBarcode } = request.body; // Extract moduleBarcode from request body

//     console.log('Received moduleBarcode:', moduleBarcode);

//     // Check if moduleBarcode is present in the request
//     if (!moduleBarcode) {
//       return response.status(400).json({ status: 'error', msg: 'Module barcode is missing in the request body' });
//     }

//     // Connect to the database
//     const pool = await sql.connect(config);

//     // Execute SQL query to fetch data
//     const result = await pool.request()
//       .query(`SELECT TOP (1000) [sr_no], [voltage_diff], [ir_diff], [module_barcode], [status]
//               FROM [replus_treceability].[dbo].[voltage_ir_status_details]
//               WHERE module_barcode = '${moduleBarcode}'`);

//     // Parse numeric fields (voltage_diff and ir_diff) to ensure they are numbers
//     const records = result.recordset.map(record => ({
//       sr_no: record.sr_no,
//       voltage_diff: parseFloat(record.voltage_diff),
//       ir_diff: parseFloat(record.ir_diff),
//       module_barcode: record.module_barcode,
//       status: record.status
//     }));

//     console.log('SQL Query:', result.query);
//     console.log('Query Result:', records);

//     // Send response with JSON data
//     response.status(200).json({ status: 'success', msg: 'Records fetched successfully', data: records });
//   } catch (error) {
//     console.error('Error while fetching records:', error);
//     response.status(500).json({ status: 'error', msg: ' while fetching records' });
//   }
// });

export const getModuleBarcode = asyncHandler(async (request, response) => {
  try {
    const { moduleBarcode } = request.body; // Extract moduleBarcode from request body

    console.log('Received moduleBarcode:', moduleBarcode);

    // Check if moduleBarcode is present in the request
    if (!moduleBarcode) {
      return response.status(400).json({ status: 'error', msg: 'Module barcode is missing in the request body' });
    }

    // Connect to the database
    const pool = await sql.connect(config);

    // Execute SQL query to fetch data
    const result = await pool.request()
      .query(`SELECT TOP (1000) [sr_no], [voltage_diff], [ir_diff], [module_barcode], [status]
              FROM [replus_treceability].[dbo].[voltage_ir_status_details]
              WHERE module_barcode = '${moduleBarcode}'`);

    // Parse numeric fields (voltage_diff and ir_diff) to ensure they are numbers
    const records = result.recordset.map(record => ({
      sr_no: record.sr_no,
      voltage_diff: parseFloat(record.voltage_diff),
      ir_diff: parseFloat(record.ir_diff),
      module_barcode: record.module_barcode,
      status: record.status
    }));

    // console.log('SQL Query:', result.query);
    console.log('Query Result:', records);

    // Check if records are found
    if (records.length === 0) {
      return response.status(404).json({ status: 'error', msg: 'No data found for the provided module barcode' });
    }

    // Send response with JSON data
    response.status(200).json({ status: 'success', msg: 'Records fetched successfully', data: records });
  } catch (error) {
    console.error('Error while fetching records:', error);
    response.status(500).json({ status: 'error', msg: 'Error while fetching records' });
  }
});



