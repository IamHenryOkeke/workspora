export interface ApiResponse<T = unknown> {
  message: string;
  data?: T;
  user?: User;
  token?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}
