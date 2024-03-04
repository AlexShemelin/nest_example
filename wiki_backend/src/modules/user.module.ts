import { Module } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { Auth, JWTAuth } from '../services/common/auth.service';
import { UserController } from '../controllers/user.controller';
import { AuthController } from '../controllers/auth.controller';
import { ICredentials, IToken } from '../types/core.types';
import { DatabaseModule } from './database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController, AuthController],
  providers: [
    UserService,
    {
      provide: Auth<ICredentials, IToken>,
      useClass: JWTAuth,
    },
  ],
  exports: [
    UserService,
    {
      provide: Auth<ICredentials, IToken>,
      useClass: JWTAuth,
    },
  ],
})
export class UserModule {}
