export class UserAuth {
    constructor(
      public email: string,
      public id: string,
      private _token: string,
      private _tokenExpirationDate: Date,
      private catchPhase?: string
    ) {}
    get token() {
      if(this._tokenExpirationDate || new Date() > this._tokenExpirationDate) return null; // exipred token or no token
      return this._token;
    }
    get tokenExpirationDate() {
      return this._tokenExpirationDate
    }
}