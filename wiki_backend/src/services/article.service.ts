import { Inject, Injectable } from '@nestjs/common';
import type { IArticle, IError } from '../types/core.types';
import { DatabaseAbstract } from './common/database.service';
import {
  CreateArticleDto,
  EditArticleDto,
  DeleteArticleDto,
} from 'src/types/common.dto';

@Injectable()
export abstract class ArticleServiceAbstract {
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
export class ArticleService extends ArticleServiceAbstract {
  constructor(@Inject('DatabaseAbstract') private database: DatabaseAbstract) {
    super();
  }
  async createArticle(article: CreateArticleDto) {
    return await this.database.createArticle(article);
  }
  async editArticle(article: EditArticleDto) {
    return await this.database.editArticle(article);
  }
  async deleteArticle(deleteData: DeleteArticleDto) {
    return await this.database.deleteArticle(deleteData);
  }
  async getOneArticleById(id: number) {
    return await this.database.getOneArticleById(id);
  }
  async getAllArticles() {
    return await this.database.getAllArticles();
  }
  async searchAndGetArticles({ keywords }: { keywords: string[] }) {
    return await this.database.searchAndGetArticles({ keywords });
  }
}
