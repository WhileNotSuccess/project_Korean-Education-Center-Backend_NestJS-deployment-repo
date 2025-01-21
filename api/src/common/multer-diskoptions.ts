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
            let path:string
            
            // 실행되는 파일이 api/dist/common 이므로 api폴더까지 올라가서 uploads파일내에 posts, banner, application-form의 폴더를 구분해서 파일을 저장 
            if(file.mimetype.includes('image')){
              path=`${__dirname}/../../uploads/image`
            }else{
              path=`${__dirname}/../../uploads${req.originalUrl}`
            }
            if (!fs.existsSync(path)) { //폴더가 없다면
              fs.mkdirSync(path, { recursive: true }); // 폴더 생성 
            }
            cb(null,path) //생성한 폴더명 return
          },
          filename:(req,file,cb)=>{ // file을 uploads파일에서 찾아서 그 정보를 가져오는 식으로 변경

            const time=moment().tz('Asia/Seoul').format('YYYYMMDD-HHmmss') //업로드한 날짜 받아오기 
            const returner=`${time}_${file.originalname}` //날짜와 원본파일명을 합쳐서 저장될 파일명 작성
            cb(null,returner) // isFile이 있다면 덮어씌우는 건가? 아니면 원래 파일을 반환하는 가?
          }  
        }),
        limits:{fileSize:50*1024*1024} //50MB
}