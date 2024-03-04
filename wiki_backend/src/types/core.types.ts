export type IError = {
  status: number;
  message: string;
};

export type BaseUser = {
  id: number;
  username: string;
  password: string;
  token: string;
};

export type UserAccess = {
  create: boolean;
  edit: boolean;
  delete: boolean;
};

export type IUser = BaseUser & {
  access: UserAccess;
  administrator: boolean; // false
};

export type IAdministrator = BaseUser & {
  access: UserAccess;
  administrator: boolean; // true
};

export type ICredentials = {
  username: string;
  password: string;
};

export type IToken = {
  token: string;
};

export type IArticle = {
  id: number;
  title: string;
  tags: string[];
  body: string;
  edited: Date;
  created: Date;
  authorId: number;
  published: boolean;
  imageUrl: string;
};
