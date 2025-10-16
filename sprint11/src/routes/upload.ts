import express from "express";
import multer from "multer";
import fs from 'fs';
import uploadS3 from "../middlewares/multerS3";

const uploadRouter = express.Router();
const ENV = process.env.ENVIRONMENT;

let upload
if (ENV === 'DEVELOPMENT') {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = '/docker-compose-app/uploads';
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    }
  });

  upload = multer({
    storage: storage
  })
}
else {
  upload = uploadS3;
}

uploadRouter.post('/', upload.single('file'), (req, res) => {
  console.log('파일 정보: ', req.file);
  res.json({
    success: true,
    message: '파일 업로드 완료',
    fileUrl: ENV === 'PRODUCTION' ?(req as any).file.location : `/uploads/${req.file?.filename}`,
  });
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
      fileUrl: ENV === 'PRODUCTION' ?(req as any).file.location : `/uploads/${req.file?.filename}`,
      originName: req.file.originalname
    })
  }
)

export default uploadRouter;