interface googleUser{
    name: string
    email: string
    emailVerifiedAt: Date
    googleId: string
    signUpVerifyToken: string
    password: string|null,
    id: number,
    newUser?: boolean,
    emailExistsButGoogleIdIsNotExists?:string
}