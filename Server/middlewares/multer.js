const multer = require("multer");
const path = require("path");

module.exports = multer({
  storage: multer.diskStorage({}),
  // cap max file upload for each image to 1GB
  limits: { fileSize: 1024 * 1024 },
  fileFilter: (fileFilter = (req, file, cb) => {
    if (
      file.mimetype === "image/jpeg" ||
      "image/jpg" ||
      "image/png" ||
      "image/gif" ||
      "image/svg+xml" ||
      "image/webp"
    ) {
      cb(null, true);
    } else {
      // reject file
      cb({ message: "Unsupported file format" }, false);
    }
  }),
});
