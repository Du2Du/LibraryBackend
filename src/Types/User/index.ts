import { Permission } from "../Permission";

export interface UserProps {
  id: number;
  name: string;
  email: string;
  cpf: string;
  password: string;
  permissions: Array<Permission>;
}

export interface CreateUserProps extends Omit<UserProps, "id"> {}
export interface UserDTO extends Omit<UserProps, "password"> {
  password?: string;
}

export interface UserUpdate {
  email: string;
  name: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export type UserToken = string | object | Buffer;
