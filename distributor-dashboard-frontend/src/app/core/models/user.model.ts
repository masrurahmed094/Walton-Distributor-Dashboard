export interface JwtResponse {
  token: string;
  type: string;
}

export interface UserProfile {
  id: number;
  username: string;
  name: string;
  email: string;
  department: string;
  phone: string;
  roles: string[];
  active: boolean;
}

export interface RegisterPayload {
  name?: string;
  email?: string;
  username?: string;
  password?: string;
  department?: string;
  phone?: string;
  securityQuestion?: string;
  securityAnswer?: string;
}

export interface LoginPayload {
  username?: string;
  password?: string;
}

export interface ResetPasswordPayload {
  username?: string;
  securityAnswer?: string;
  newPassword?: string;
}

export interface SecurityQuestionResponse {
    securityQuestion: string;
}