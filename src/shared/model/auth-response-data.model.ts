export interface SignUpResponseData{
    username: string,
    userEmail: string,
    userPassword: string,
    userId: string,
    role: Role[],
    catchPhase: string
}

export interface Role{
    roleName: string,
    roleDescription: string
}

export interface SignInResponseData{
    userAuth: SignUpResponseData,
    jwtToken: string
}