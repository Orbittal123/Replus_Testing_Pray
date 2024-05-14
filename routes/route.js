import express from "express";
import { CountAll,fetchData,addData, updateData ,deleteData  } from "../controllers/admincontroller.js";
import {
  checkLogin1,
} from "../controllers/loginController.js";
 
// import protect from "../middlewares/authMiddleware.js";
import multer from 'multer';
import { getModuleBarcode  } from "../controllers/userController.js";
 
const router = express.Router();

// for blog
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    
    const {location} = req.body;

    let path = '';

    path = 'images/blogs';

    cb(null, path);
    
  },

  filename: (req, file, cb) => {
    cb(null, file.originalname);
      
  },
});
  
const upload = multer({ storage });
 
router.get("/CountAll", CountAll);
 
//Admin side paths
//login paths 
router.post("/checkLogin", checkLogin1);
// router.post("/registerUser", registerUser);


router.get("/getData" ,fetchData);
router.post("/addData", addData);  
router.post("/updateData" , updateData);
router.post("/deleteData" , deleteData);
router.post("/countAll" , CountAll);


// All Station Routes

//1. Cell Sorting 

// router.post("/cell_sorting_data_insert", insertCellSortingData);  

//2. pack assembly 

router.post("/getvoltageirdetails",getModuleBarcode); 

 
export default router;
