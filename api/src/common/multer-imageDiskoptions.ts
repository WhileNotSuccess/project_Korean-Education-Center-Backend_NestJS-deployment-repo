import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import * as moment from 'moment-timezone';
import * as uuid from 'uuid';
import * as mime from 'mime-types'

const allowFiletype = /\/(jpg|jpeg|png|gif|bmp|webp)$/;

export const ImageDiskOptions = {
  fileFilter: (req, file, cb) => {

    if (file.mimetype.match(allowFiletype)) {
      //파일 타입이 맞지 않으면 badRequest
      cb(null, true);
    } else {
      cb(
        new BadRequestException({
          message: '파일형식에러',
          error: '지원하지 않는 파일 형식입니다.',
        }),
        false,
      );
    }
  },
  storage: diskStorage({
    // 로컬 저장하겠다, 옵션 설정
    destination: function (req, file, cb) {
      // 저장할 폴더를 지정
      const path = '/files';

      if (!fs.existsSync(path)) {
        //폴더가 없다면
        fs.mkdirSync(path, { recursive: true }); // 폴더 생성
      }
      cb(null, path); //생성한 폴더명 return
    },
    filename: (req, file, cb) => {
      const time = moment().tz('Asia/Seoul').format('YYYYMMDD-HHmmss'); //업로드한 날짜 받아오기
      const returner = `${time}_${uuid.v1()}.${mime.extension(file.mimetype)}`; //날짜와 원본파일명을 합쳐서 저장될 파일명 작성
      cb(null, returner); 
    },
  }),
  limits: { fileSize: 50 * 1024 * 1024 }, //50MB
};
