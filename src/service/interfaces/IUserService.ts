export interface IUserService {
  createUser(data: any): Promise<any>;
  findByEmail(email: string): Promise<any>;
  updateUser(id: string, data: any): Promise<any>;
  deleteUser(id: string): Promise<any>;
  findOneUser(id: string): Promise<any>;
}
