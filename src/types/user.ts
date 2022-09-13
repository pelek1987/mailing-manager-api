export interface User {
  firstname: string;
  lastname: string;
  username: string;
  password: string;
}

export interface RegisterUserResponse {
  id: string;
  username: string;
}
