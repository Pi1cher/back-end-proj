import { IUser } from "./user.interface";

export interface ITokenPair {
  accessToken: string;
  refreshToken: string;
}

export type ITokenPayload = Pick<IUser, "name" | "_id">;
export type ICredentials = Pick<IUser, "email" | "password">;
