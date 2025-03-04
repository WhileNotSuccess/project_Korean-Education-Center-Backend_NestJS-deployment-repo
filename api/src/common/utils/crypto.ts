import { promisify } from "util";
import * as crypto from 'crypto'

async function getKey(){
    const key=(await promisify(crypto.scrypt)(process.env.AES_ENCRYPTION_PASSWORD, 'yjuintl', 32)) as Buffer;
    const iv= crypto.randomBytes(16)
    return {key,iv}
}

export async function encrypto(text:string){
    const {key,iv}=await getKey() // 설정 값 가져오기 
    const buffered=Buffer.from(text,'utf-8')
    const cipher= crypto.createCipheriv(process.env.AES_ENCRYPTION_ALGORITHM,key,iv)
    const encryptedText=Buffer.concat([
        cipher.update(buffered),
        cipher.final()
    ])
    const encryptedName=encryptedText.toString('base64')
    return {encryptedName,iv:iv.toString('hex')}
}

export async function decrypto(text,iv){
    const {key}=await getKey()
    const bufferedIV=Buffer.from(iv,'hex')
    const decrypter=Buffer.from(text,'base64')
    const decipher=crypto.createDecipheriv(process.env.AES_ENCRYPTION_ALGORITHM,key,bufferedIV)

    try {
        const decyptedText = Buffer.concat([
        decipher.update(decrypter),
        decipher.final(),
      ]);
      const decrypted=decyptedText.toString('utf-8');
      return decrypted
      } catch (e) {
        console.log(e)
      }
}