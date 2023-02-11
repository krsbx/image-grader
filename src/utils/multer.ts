import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const allowedExt = ['.png', '.jpg', '.jpeg'];
const uploadPath = 'tmp/';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${uuidv4()}`;
    const extension = path.extname(file.originalname);
    const storedFileName = `${uniqueSuffix}${extension}`;
    const originalFileName = file.originalname;
    const mimeType = file.mimetype;

    const fileData = {
      storedFileName,
      originalFileName,
      mimeType,
      path: `${uploadPath}/${storedFileName}`,
    };

    req.filesData = {
      ...(req?.fileData ?? {}),
      [uniqueSuffix]: fileData,
    };

    cb(null, storedFileName);
  },
});

export const uploadImage = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (!allowedExt.includes(ext)) return cb(new Error('Only images are allowed'));

    cb(null, true);
  },
});

export const uploadManyImage = uploadImage.array('images', Infinity);
