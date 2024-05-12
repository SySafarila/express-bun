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

export type RoleStore = {
  name: string;
};

export type RoleUpdate = {
  id: number;
  name: string;
};

export type RoleDelete = {
  id: number;
};

export type UserSynchRoles = {
  user_id: number;
  roles: Array<number>;
};
