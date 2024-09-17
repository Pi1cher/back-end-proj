export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  accountType?: string;
  role: string;
}
