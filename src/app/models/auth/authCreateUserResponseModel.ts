export interface AuthCreateUserResponse {
    username: string;
    message: string;
    jwt: string;
    status: boolean;
  }