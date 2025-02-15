import * as fs from 'fs'
import * as path from 'path'
import * as mime from 'mime-types'
import { NotFoundException } from '@nestjs/common'
/**
 * 
 * @param files //파일 이름을 배열형태로 
 * @returns 찾은 파일의 fileSize, filename, filetype을 객체의 배열로 반환 
 */
export function findFiles(files:string[]){ // 파일 이름을 string 배열로 받기 
    let FilesMetaData=[]
    files.forEach(file=>{
        try {
            const fileData=fs.statSync(`/files/${file}`)
            FilesMetaData.push(
                {
                    size:fileData.size,
                    filename:file,
                    mimetype:mime.lookup(path.extname(file))
                }
        )
        } catch (e) {
            throw new NotFoundException({message:`'${file}' 파일이 서버에 저장되어있지 않습니다.`})
        }
        
    })
    
    return FilesMetaData
}