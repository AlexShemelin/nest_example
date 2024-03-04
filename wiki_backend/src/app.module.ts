import { Module } from '@nestjs/common';
import { UserModule } from './modules/user.module';
import { ArticleModule } from './modules/article.module';
import { ArticelController } from './controllers/article.contoller';
import { AuthController } from './controllers/auth.controller';
import { UserController } from './controllers/user.controller';
import { ArticleService } from './services/article.service';
import { UserService } from './services/user.service';
import { PrismaService } from './services/common/prisma.service';
import { DatabaseModule } from './modules/database.module';
import { ValidatorModule } from './modules/validator.module';

@Module({
  imports: [ArticleModule, UserModule, DatabaseModule, ValidatorModule],
  controllers: [ArticelController, AuthController, UserController],
  providers: [ArticleService, UserService, PrismaService],
})
export class AppModule {}
