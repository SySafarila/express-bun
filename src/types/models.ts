export type User = {
  email: string;
  full_name: string;
  password: string;
  verified_at?: Date | null;
};

export type UserPublic = {
  email: string;
  full_name: string;
  verified_at?: Date | null;
};
