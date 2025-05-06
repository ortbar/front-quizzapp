export interface User {
    id: number;
    email: string;
    username: string;
    password?: string; // opcional, normalmente no se devuelve ni se muestra
    roles: string[];
    enabled: boolean;
    accountNotExpired: boolean;
    accountNotLocked: boolean;
    credentialNotExpired: boolean;
    createdAt: Date;
  }