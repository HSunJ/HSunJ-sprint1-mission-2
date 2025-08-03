import express from "express";
import multer from "multer";
import path from "path";
import fs from 'fs';
import { fileURLToPath } from "url";

const filename = __filename;
const dirname = path.dirname(filename);

const uploadRouter = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({
  storage: storage
})


uploadRouter.post('/', upload.single('attachment'), (req, res) => {
  console.log(req.file);
  res.json({ message: "파일 업로드 완료" });
})

uploadRouter.post('/single-image',
  upload.single('image'),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "파일이 없거나 잘못된 형식" });
    }
    console.log(req.file);

    res.status(201).json({
      message: "파일 업로드 완료",
      fileName: req.file.filename,
      filePath: `/uploads/${req.file.filename}`,
      originName: req.file.originalname
    })
  }
)

export default uploadRouter;