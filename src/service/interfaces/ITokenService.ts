export interface ITokenService {
  signAccess(payload: { id: string }, exp?: string): string;
  signRefresh(payload: { id: string }, exp?: string): string;
  verifyRefresh<T = { id: string }>(token: string): T;
}
