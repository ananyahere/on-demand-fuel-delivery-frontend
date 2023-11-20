export class UserMongoAuth {
    constructor(
        private username: string,
        private userId: string,
        private userRole: string,
        private userJwtToken: string
    ){}
    get jwtToken() {
        return this.userJwtToken;
    }
}