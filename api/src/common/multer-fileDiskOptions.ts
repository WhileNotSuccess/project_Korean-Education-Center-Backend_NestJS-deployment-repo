import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import * as moment from 'moment-timezone';
import path, { extname, join } from 'path';
import * as uuid from 'uuid';
import * as mime from 'mime-types';

const refuseFiletype =
  /^(application\/(x-sh|x-msdownload|javascript|php|octet-stream)|text\/(html|plain|javascript|x-script)|image\/(svg\+xml|vnd\.microsoft\.icon))$/i;

export const FileDiskOptions = {
  fileFilter: (req, file, cb) => {
    if (file.mimetype.match(refuseFiletype)||!file.mimetype) {
      //파일 타입이 일치하거나 mimetype이 false(한글 파일 같이 해외에서 사용되지 않는 파일)이면 badRequest
      cb(
        new BadRequestException({
          message: '파일형식에러',
          error: '지원하지 않는 파일 형식입니다.',
        }),
        false,
      );
    } else {
      cb(null, true);
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
      // file을 uploads파일에서 찾아서 그 정보를 가져오는 식으로 변경

      const time = moment().tz('Asia/Seoul').format('YYYYMMDD-HHmmss'); //업로드한 날짜 받아오기
      file.originalname = Buffer.from(file.originalname, 'ascii').toString(
        'utf8',
      );
      const returner = `${time}_${file.originalname}`; //날짜와 원본파일명을 합쳐서 저장될 파일명 작성
      // 파일 이름을 저장할때의 로직=> 영어로 받을지 확인하고 수정할 것
      cb(null, returner);
    },
  }),
  limits: { fileSize: 50 * 1024 * 1024 }, //50MB
};
