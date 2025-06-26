export interface UserProfileUpdateDTO {
  sub: any;
  headers: any;
  id: number;
  email: string;
  username: string;
  currentPassword?:string;
  newPassword?: string;
  repeatNewPassword?: string;
  roles: string[];
  enabled: boolean;
  accountNotExpired: boolean;
  accountNotLocked: boolean;
  credentialNotExpired: boolean;
  createdAt: string;
  token?: string;
}