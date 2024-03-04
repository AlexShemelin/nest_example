import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthGuard } from './guards/auth.guard';
import { requestValidatorService } from './services/common/requestValidator.service';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });
  app.enableCors();
  app.useGlobalGuards(new AuthGuard(new requestValidatorService()));
  await app.listen(process.env.PORT);
}
bootstrap();
