import multerS3 from 'multer-s3';
import multer from 'multer';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// AWS S3 설정
const s3 = new S3Client({
  region: 'ap-northeast-2',
});

// multer-s3 설정
const uploadS3 = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'codeit-pandamarket',
    key: function (req, file, cb) {
      try {
        cb(null, Date.now().toString() + '-' + file.originalname);
      } catch (err) {
        cb(err);
      }
    }
  })
});

export default uploadS3;