export interface IAuthService {
  signUp(data: any): Promise<any>;
  signIn (email: string, password: string): Promise<any>;
  forgotPassword(email: string): Promise<any>;
  resetPassword(token: string, newPassword: string): Promise<any>;
  verifyEmail(token: string): Promise<any>;
  refresh(token: string): Promise<any>;
}