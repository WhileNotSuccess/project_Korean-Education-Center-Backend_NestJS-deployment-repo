import { BadRequestException } from "@nestjs/common";
import { diskStorage } from "multer";
import * as fs from 'fs'
import * as moment from "moment-timezone";
import { extname } from "path";

const filetype=/\/(jpg|jpeg|png|gif|bmp|tiff|tif|docx|pdf)$/

export const multerDiskOptions={
        fileFilter:(req,file,cb)=>{
          if(file.mimetype.match(filetype)){ //파일 타입이 맞지 않으면 badRequest
            cb(null,true)
          }else{
            cb(new BadRequestException({message:'파일형식에러',error:'지원하지 않는 파일 형식입니다.'}),false)
          }
        },
        storage:diskStorage({ // 로컬 저장하겠다, 옵션 설정 
          destination: function(req,file,cb){ // 저장할 폴더를 지정
            const path=`${__dirname}/../../uploads`
            if (!fs.existsSync(path)) { //폴더가 없다면
              fs.mkdirSync(path, { recursive: true }); // 폴더 생성 
            }
            cb(null,path) //생성한 폴더명 return
          },
          filename:(req,file,cb)=>{ 
            const time=moment().tz('Asia/Seoul').format('YYYYMMDD-HHmmss') //업로드한 날짜 받아오기 
            return cb(null,`${time}_${extname(file.originalname)}`) //날짜와 원본파일명을 합쳐서 return => 저장될 파일명
          }  
        }),
        limits:{fileSize:10*1024*1024} //10MB
     
}