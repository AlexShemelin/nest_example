import type {
  IError,
  IAdministrator,
  IUser,
  IArticle,
} from '../../types/core.types';
import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { prismaToUser } from '../../utils/converUser';
import { prismaToArticle } from '../../utils/convertArticle';
import {
  CreateArticleDto,
  EditArticleDto,
  CreateUserDto,
  EditUserDto,
  DeleteArticleDto,
  DeleteUserDto,
} from '../../types/common.dto';
import {
  RegExpMatcher,
  TextCensor,
  englishDataset,
  englishRecommendedTransformers,
} from 'obscenity';

@Injectable()
export abstract class DatabaseAbstract {
  // users
  public abstract login(credentials: {
    username: string;
    token: string;
  }): Promise<IError>;
  public abstract createUser(user: CreateUserDto): Promise<IError>;
  public abstract deleteUser(dto: DeleteUserDto): Promise<IError>;
  public abstract editUser(user: EditUserDto): Promise<IError>;
  public abstract getUserById(
    id: number,
  ): Promise<IUser | IAdministrator | undefined>;
  public abstract getUserByName(
    name: string,
  ): Promise<IUser | IAdministrator | undefined>;
  public abstract getAllUsers(): Promise<(IUser | IAdministrator)[]>;
  public abstract isUserExists(username: string): Promise<IError | boolean>;
  public abstract validateUserToken(token: string): Promise<IError | boolean>;
  // articles
  public abstract createArticle(article: CreateArticleDto): Promise<IError>;
  public abstract editArticle(article: EditArticleDto): Promise<IError>;
  public abstract deleteArticle(dto: DeleteArticleDto): Promise<IError>;
  public abstract getOneArticleById(id: number): Promise<IArticle | undefined>;
  public abstract getAllArticles(): Promise<IArticle[]>;
  public abstract searchAndGetArticles({
    keywords,
  }: {
    keywords: string[];
  }): Promise<IArticle[]>;
}

@Injectable()
export class InMemoryDB extends DatabaseAbstract {
  private users: (IAdministrator | IUser)[] = [];
  private articles: IArticle[] = [];

  // users
  public async login({
    username,
    token,
  }: {
    username: string;
    token: string;
  }): Promise<IError> {
    const index = this.users.findIndex((user) => user.username === username);
    if (index !== -1) {
      this.users[index].token = token;
      return {
        status: 200,
        message: token,
      };
    }
    return {
      status: 500,
      message: 'user not found',
    };
  }
  public async createUser(user: CreateUserDto) {
    this.users.push({
      ...user,
      id: this.users.length + 1,
      token: '',
      administrator: false,
    });
    return {
      status: 200,
      message: 'createUser success',
    };
  }
  public async deleteUser(dto: DeleteUserDto) {
    this.users = this.users.filter((user) => user.username !== dto.username);
    return {
      status: 200,
      message: 'deleteUser success',
    };
  }
  public async editUser(editedUser: EditUserDto) {
    const index = this.users.findIndex((user) => user.id === editedUser.id);
    if (index !== -1) {
      this.users[index] = {
        ...editedUser,
        password: this.users[index].password,
        token: this.users[index].token,
        administrator: false,
      };
      return {
        status: 200,
        message: 'editUser success',
      };
    }
    return {
      status: 500,
      message: 'user not found',
    };
  }
  public async getUserById(
    id: number,
  ): Promise<IUser | IAdministrator | undefined> {
    return this.users.find((user) => user.id === id);
  }
  public async getUserByName(
    username: string,
  ): Promise<IUser | IAdministrator | undefined> {
    return this.users.find((user) => user.username === username);
  }

  public async getAllUsers() {
    return this.users;
  }

  public async isUserExists(username: string) {
    return Boolean(this.users.find((user) => user.username === username));
  }

  public async validateUserToken(token: string) {
    return Boolean(this.users.find((user) => user.token === token));
  }

  // articles
  public async createArticle(article: Omit<IArticle, 'id'>) {
    this.articles.push({
      ...article,
      id: this.articles.length + 1,
    });
    return {
      status: 200,
      message: 'createArticle success',
    };
  }
  public async editArticle(editedArticle: IArticle) {
    const index = this.articles.findIndex(
      (article) => article.id === editedArticle.id,
    );
    if (index !== -1) {
      this.articles[index] = editedArticle;
      return {
        status: 200,
        message: 'editArticle success',
      };
    }
    return {
      status: 500,
      message: 'article not found',
    };
  }
  public async deleteArticle(dto: DeleteArticleDto) {
    this.articles = this.articles.filter((article) => article.id !== dto.id);
    return {
      status: 200,
      message: 'deleteArticle success',
    };
  }
  public async getOneArticleById(id: number) {
    return this.articles.find((article) => article.id === id);
  }
  public async getAllArticles() {
    return this.articles;
  }
  public async searchAndGetArticles({
    tags,
    keywords,
  }: {
    tags: string[];
    keywords: string[];
  }) {
    // Filter articles based on tags
    const articlesWithTags = this.articles.filter((article) =>
      article.tags.some((tag) => tags.includes(tag)),
    );
    // Filter articles based on keywords
    const articlesWithKeywords = articlesWithTags.filter((article) =>
      keywords.some((keyword) => article.body.includes(keyword)),
    );
    return articlesWithKeywords;
  }
}

@Injectable()
export class PrismaDB extends DatabaseAbstract {
  private censor = new TextCensor();
  private matcher = new RegExpMatcher({
    ...englishDataset.build(),
    ...englishRecommendedTransformers,
  });

  constructor(@Inject('PrismaService') private prisma: PrismaService) {
    super();
  }

  /*
   * Users
   */
  public async login({
    username,
    token,
  }: {
    username: string;
    token: string;
  }): Promise<IError> {
    const userToLogin = await this.prisma.user.findUnique({
      where: { username },
    });
    if (userToLogin) {
      await this.prisma.user.update({
        data: { token },
        where: { username },
      });
      return {
        status: 200,
        message: token,
      };
    }
    return {
      status: 500,
      message: 'user not found',
    };
  }
  public async createUser(user: CreateUserDto) {
    if (user.editorUsername !== 'admin') {
      return {
        status: 500,
        message: 'You have no access to create user',
      };
    }
    await this.prisma.user.create({
      data: {
        accessCreate: user.access.create,
        accessDelete: user.access.delete,
        accessEdit: user.access.edit,
        administrator: false,
        password: user.password,
        token: '',
        username: user.username,
      },
    });
    return {
      status: 200,
      message: 'createUser success',
    };
  }
  public async deleteUser(dto: DeleteUserDto) {
    if (dto.editorUsername !== 'admin') {
      return {
        status: 500,
        message: 'You have no access to delete user',
      };
    }
    await this.prisma.user.delete({
      where: {
        username: dto.username,
      },
    });
    return {
      status: 200,
      message: 'deleteUser success',
    };
  }
  public async editUser(user: EditUserDto) {
    if (user.editorUsername !== 'admin') {
      return {
        status: 500,
        message: 'You have no access to delete user',
      };
    }
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        accessCreate: user.access.create,
        accessDelete: user.access.delete,
        accessEdit: user.access.edit,
        username: user.username,
      },
    });
    return {
      status: 200,
      message: 'editUser success',
    };
  }
  public async getUserById(id: number) {
    const prismaUser = await this.prisma.user.findUnique({ where: { id } });
    return prismaToUser(prismaUser);
  }
  public async getUserByName(username: string) {
    const prismaUser = await this.prisma.user.findUnique({
      where: { username },
    });
    return prismaToUser(prismaUser);
  }

  public async getAllUsers() {
    const prismaUsers = await this.prisma.user.findMany();
    return prismaUsers.map((prismaUser) => prismaToUser(prismaUser));
  }

  public async isUserExists(username: string) {
    const prismaUser = await this.prisma.user.findUnique({
      where: { username },
    });
    return Boolean(prismaUser);
  }

  public async validateUserToken(token: string) {
    const prismaUser = await this.prisma.user.findFirst({ where: { token } });
    if (prismaUser) {
      return true;
    } else {
      return false;
    }
  }

  /*
   * Articles
   */
  public async createArticle(article: CreateArticleDto) {
    const editorProfile = await this.prisma.user.findUnique({
      where: {
        username: article.editorUsername,
      },
    });
    if (!editorProfile.accessCreate && !editorProfile.administrator) {
      return {
        status: 500,
        message: 'You have no access to create article',
      };
    }
    const matches = this.matcher.getAllMatches(article.body);
    const textWithProfanityCheck = this.censor.applyTo(article.body, matches);
    await this.prisma.article.create({
      data: {
        body: textWithProfanityCheck,
        created: String(article.created),
        edited: String(article.edited),
        title: article.title,
        tags: article.tags,
        authorId: article.authorId,
        published: article.published,
        imageUrl: article.imageUrl,
      },
    });
    return {
      status: 200,
      message: 'createArticle success',
    };
  }
  public async editArticle(editedArticle: EditArticleDto) {
    const editorProfile = await this.prisma.user.findUnique({
      where: {
        username: editedArticle.editorUsername,
      },
    });
    if (!editorProfile.accessEdit && !editorProfile.administrator) {
      return {
        status: 500,
        message: 'You have no access to edit article',
      };
    }
    const matches = this.matcher.getAllMatches(editedArticle.body);
    const textWithProfanityCheck = this.censor.applyTo(
      editedArticle.body,
      matches,
    );
    await this.prisma.article.update({
      where: { id: editedArticle.id },
      data: {
        body: textWithProfanityCheck,
        created: String(editedArticle.created),
        edited: String(editedArticle.edited),
        title: editedArticle.title,
        tags: editedArticle.tags,
        authorId: editedArticle.authorId,
        published: editedArticle.published,
        imageUrl: editedArticle.imageUrl,
      },
    });
    return {
      status: 200,
      message: 'editArticle success',
    };
  }
  public async deleteArticle(deleteArticle: DeleteArticleDto) {
    const editorProfile = await this.prisma.user.findUnique({
      where: {
        username: deleteArticle.editorUsername,
      },
    });
    if (!editorProfile.accessDelete && !editorProfile.administrator) {
      return {
        status: 500,
        message: 'You have no access to delete article',
      };
    }
    await this.prisma.article.delete({
      where: {
        id: deleteArticle.id,
      },
    });
    return {
      status: 200,
      message: 'deleteArticle success',
    };
  }
  public async getOneArticleById(id: number) {
    return prismaToArticle(
      await this.prisma.article.findUnique({ where: { id } }),
    );
  }
  public async getAllArticles() {
    return (await this.prisma.article.findMany()).map((prismaArticle) =>
      prismaToArticle(prismaArticle),
    );
  }
  public async searchAndGetArticles({ keywords }: { keywords: string[] }) {
    // not working yet
    const validKeywords = keywords.filter((word) => Boolean(word));
    /*
    const result = await this.prisma.article.findMany({
      where: {
        OR: [
          {
            title: {
              search: validKeywords.join(' | '),
            },
          },
          {
            tags: {
              hasSome: validKeywords,
            },
          },
        ],
      },
    }); */
    // delete when proper way of searching is complete
    const result = await this.prisma.article.findMany();
    const searchedResult = result.filter((article) => {
      const foundInTitle = validKeywords.some((keyword) =>
        article.title.toLowerCase().includes(keyword.toLowerCase()),
      );
      const foundInTags = validKeywords.some((keyword) =>
        article.tags.some((tag) =>
          tag.toLowerCase().includes(keyword.toLowerCase()),
        ),
      );
      return foundInTitle || foundInTags;
    });
    return searchedResult.map((entry) => prismaToArticle(entry));
  }
}
