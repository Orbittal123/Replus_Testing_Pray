import asyncHandler from "express-async-handler";
import Jwt from "jsonwebtoken";

const protect = asyncHandler(async (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(404).json({ message: "Invalid Token" });
  } else {  
    Jwt.verify(token.split(' ')[1], "jbnbvgopoiuyghfgbgfrggfgfgf", (err, decoded) => {
      if (err) {
        return res.status(404).json({ message: "Invalid Token" });
      } else {
        next();
      }
    });
  }
});
export default protect;
