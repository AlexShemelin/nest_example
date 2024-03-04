export class CreateUserDto {
  username: string;
  password: string;
  access: {
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
  editorUsername: string;
}

export class EditUserDto {
  username: string;
  access: {
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
  id: number;
  editorUsername: string;
}

export class DeleteUserDto {
  username: string;
  editorUsername: string;
}

export class LoginUserDto {
  username: string;
  password: string;
}

export class CreateArticleDto {
  title: string;
  tags: string[];
  body: string;
  edited: Date;
  created: Date;
  authorId: number;
  published: boolean;
  imageUrl: string;
  editorUsername: string;
}

export class EditArticleDto {
  id: number;
  title: string;
  tags: string[];
  body: string;
  edited: Date;
  created: Date;
  authorId: number;
  published: boolean;
  imageUrl: string;
  editorUsername: string;
}

export class DeleteArticleDto {
  id: number;
  editorUsername: string;
}

export class SearchArticleDto {
  keywords: string[];
}
