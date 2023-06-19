const fs = require("fs");

const regAccess = (req, res, next) => {
  const accessLog = `Hora: ${new Date().toISOString()}, Headers: ${req.rawHeaders.join(", ")}`;
  fs.appendFileSync("access.log", accessLog + "\n");
  next();
};
module.exports=regAccess
