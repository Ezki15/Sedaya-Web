import multer from 'multer';
import path from 'path';
import fs from 'fs';
import InvariantError from '../../src/Commons/exceptions/InvariantError.js';

const dir = 'uploads/products';

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/products');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // maks 2MB
  // eslint-disable-next-line consistent-return
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|webp/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    if (mimetype && extname) return cb(null, true);
    cb(new InvariantError('File harus berupa gambar (jpg, jpeg, png, webp)'));
  },
});

export default upload;
