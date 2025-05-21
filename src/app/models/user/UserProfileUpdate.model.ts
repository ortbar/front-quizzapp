export interface UserProfileUpdateDTO {
  id: number;
  email: string;
  username: string;
  roles: string[];
  enabled: boolean;
  accountNotExpired: boolean;
  accountNotLocked: boolean;
  credentialNotExpired: boolean;
  createdAt: string;
}