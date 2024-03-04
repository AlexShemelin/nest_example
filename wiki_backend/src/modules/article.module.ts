import { Module } from '@nestjs/common';
import { ArticleService } from '../services/article.service';
import { ArticelController } from '../controllers/article.contoller';
import { DatabaseModule } from './database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ArticelController],
  providers: [ArticleService],
  exports: [ArticleService],
})
export class ArticleModule {}
