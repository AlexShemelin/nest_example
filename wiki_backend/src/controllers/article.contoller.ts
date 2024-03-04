import { Controller, Get, Put, Post, Body, Param } from '@nestjs/common';
import { ArticleService } from '../services/article.service';
import {
  CreateArticleDto,
  EditArticleDto,
  DeleteArticleDto,
  SearchArticleDto,
} from '../types/common.dto';

@Controller('article')
export class ArticelController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  async create(@Body() createArticleDto: CreateArticleDto) {
    return await this.articleService.createArticle(createArticleDto);
  }

  @Put()
  async edit(@Body() editArticleDto: EditArticleDto) {
    return await this.articleService.editArticle(editArticleDto);
  }

  @Post('delete')
  async delete(@Body() deleteArticleDto: DeleteArticleDto) {
    return await this.articleService.deleteArticle(deleteArticleDto);
  }

  @Post('search')
  async search(@Body() searchArticleDto: SearchArticleDto) {
    return await this.articleService.searchAndGetArticles(searchArticleDto);
  }

  @Get(':id')
  async getById(@Param() params: { id: number }) {
    return await this.articleService.getOneArticleById(params.id);
  }

  @Get()
  async getAll() {
    return await this.articleService.getAllArticles();
  }
}
