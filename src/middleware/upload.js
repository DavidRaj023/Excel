const multer = require("multer");
const path = require('path');

const excelFilter = (req, file, cb) => {
  if (
    file.mimetype.includes("excel") ||
    file.mimetype.includes("spreadsheetml")
  ) {
    cb(null, true);
  } else {
    cb("Please upload only excel file.", false);
  }
};

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const filePath = path.join(__dirname, '../../resources/static/assets/uploads/')
    cb(null, filePath);
  },
  filename: (req, file, cb) => {
    cb(null, `fileExport-${file.originalname}`);
  },
});

var uploadFile = multer({ storage: storage, fileFilter: excelFilter });
module.exports = uploadFile;
