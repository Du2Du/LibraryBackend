export interface UserProps {
  id: number;
  name: String;
  email: String;
  cpf: String;
  password: String;
}

export interface CreateUserProps extends Omit<UserProps, "id"> {}
export interface UserDTO extends Omit<UserProps, "password"> {
  password?: string;
}
