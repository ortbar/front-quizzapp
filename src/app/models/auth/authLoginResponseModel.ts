export class AuthLoginResponse {
    constructor(
      public username: string,
      public message: string,
      public jwt: string,
      public success: boolean
    ) {}
  }