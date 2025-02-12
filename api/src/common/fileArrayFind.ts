import * as fs from 'fs'
import * as path from 'path'
import * as mime from 'mime-types'
/**
 * 
 * @param files //파일 이름을 배열형태로 
 * @returns 찾은 파일의 fileSize, filename, filetype을 객체의 배열로 반환 
 */
export function findFiles(files:string[]){ // 파일 이름을 string 배열로 받기 
    let FilesMetaData=[]
    files.forEach(file=>{
        FilesMetaData.push(
            {
                size:fs.statSync(`/files/${file}`).size,
                filename:file,
                mimetype:mime.lookup(path.extname(`/files/${file}`))
            }
        )
    })
    
    return FilesMetaData
}