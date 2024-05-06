export type RegisterRequest = {
  email: string;
  password: string;
  password_confirmation: string;
  full_name: string;
};

export type LoginRequest = {
  email: string;
  password: string;
  remember?: boolean;
};
