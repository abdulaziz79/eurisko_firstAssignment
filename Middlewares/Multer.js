import multer from "multer";
import path from "path";

const storage = multer.diskStorage({

  destination: function (req, file, cb) {
    cb(null, "images/");
  },

  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "image-" + uniqueSuffix + path.extname(file.originalname));
  },
});

export const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/jpeg" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/png" ||
      file.mimetype == "image/webp" ||
      file.mimetype == "image/svg+xml"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("only jpg , jpeg , svg and png allowed"));
    }
  },
});