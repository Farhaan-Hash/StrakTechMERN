import path from "path";
import multer from "multer";
import express from "express";
const router = express.Router();

// Save the image in uploads folder and return the path of the image using Disk Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Create an absolute path to the uploads folder
    const uploadPath = path.join(__dirname, "../images"); // Adjust the path accordingly
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Create file name format
    cb(
      null,
      `${file.originalname}`
      // ${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// Function to check File Type: Only image types are allowed
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif|JPG|JPEG/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}

// Upload image to uploads folder and return the path of the image
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// Route to upload image
router.post("/", upload.array("images", 3), function (req, res, next) {
  // req.files is an array of uploaded files
  const imagePaths = req.files.map((file) => file.path);

  res.send({
    message: "Files uploaded successfully!",
    images: imagePaths,
  });
});

export default router;
