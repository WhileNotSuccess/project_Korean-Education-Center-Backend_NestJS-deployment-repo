export class CreateUserDto {
    email:string
    password?:string
    name:string
    emailVerifiedAt?:Date
    googleId?:string
}
