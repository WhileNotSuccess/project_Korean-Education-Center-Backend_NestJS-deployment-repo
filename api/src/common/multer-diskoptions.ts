import { BadRequestException } from "@nestjs/common";
import { diskStorage } from "multer";
import * as fs from 'fs'
import * as moment from "moment-timezone";
import { extname } from "path";

const filetype=/\/(jpg|jpeg|png|gif|bmp|tiff|tif|docx|pdf|octet-stream)$/ // 받을 mimeType들 확인하기 

export const multerDiskOptions={
        
        fileFilter:(req,file,cb)=>{
          
          if(file.mimetype.match(filetype)){ //파일 타입이 맞지 않으면 badRequest
            cb(null,true)
          }else{
            cb(new BadRequestException({message:`파일형식에러:${file.mimetype}`,error:'지원하지 않는 파일 형식입니다.'}),false)
          }
        },
        storage:diskStorage({ // 로컬 저장하겠다, 옵션 설정 
          destination: function(req,file,cb){ // 저장할 폴더를 지정
            let returnPath:string
            switch (req.path){// 루트폴더(/app)에서 uploads파일안에 저장하는데 
              case '/attachments'://스마트에디터image라면 image폴더에 
                returnPath=`/app/uploads/image`; 
                break;
              default:// 그 이외라면 엔드포인트에 맞춘 이름의 폴더에 저장 (banner,posts 등)
                returnPath=`/app/uploads/${req.path}`
            }
            
            if (!fs.existsSync(returnPath)) { //폴더가 없다면
              fs.mkdirSync(returnPath, { recursive: true }); // 폴더 생성 
            }
            cb(null,returnPath) //생성한 폴더명 return
          },
          filename:(req,file,cb)=>{ //파일 이름 설정
            const time=moment().tz('Asia/Seoul').format('YYYYMMDD-HHmmss') //업로드한 날짜 받아오기 
            const filename=`${time}_${file.originalname}` //날짜와 원본파일명을 합쳐서 저장될 파일명 작성
            cb(null,filename) 
          }  
        }),
        limits:{fileSize:50*1024*1024} //50MB
}