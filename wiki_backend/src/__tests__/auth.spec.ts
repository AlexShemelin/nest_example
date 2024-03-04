import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';
import { Auth, JWTAuth } from '../services/common/auth.service';
import { InMemoryDB } from '../services/common/database.service';
import { ICredentials, IToken } from '../types/core.types';
import { AuthController } from '../controllers/auth.controller';
import 'dotenv/config';

describe('Auth test', () => {
  let userController: UserController;
  let authController: AuthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserController, AuthController],
      providers: [
        UserService,
        {
          provide: 'DatabaseAbstract',
          useClass: InMemoryDB,
        },
        {
          provide: Auth<ICredentials, IToken>,
          useClass: JWTAuth,
        },
      ],
    }).compile();

    userController = app.get<UserController>(UserController);
    authController = app.get<AuthController>(AuthController);
  });

  describe('auth', () => {
    it('should login user', async () => {
      await userController.create({
        editorUsername: 'admin',
        access: {
          create: true,
          delete: true,
          edit: true,
        },
        password: 'test',
        username: 'helloUser',
      });

      await authController.login({
        password: 'test',
        username: 'helloUser',
      });
      const allUsers = await userController.getAll();
      expect(allUsers[0].token).not.toBe('');
    });
    it('should check username and return true', async () => {
      await userController.create({
        editorUsername: 'admin',
        access: {
          create: true,
          delete: true,
          edit: true,
        },
        password: 'test',
        username: 'helloUser',
      });

      const result = await authController.check({
        username: 'helloUser',
      });
      expect(result).toBe(true);
    });
    it('should check username and return false', async () => {
      await userController.create({
        editorUsername: 'admin',
        access: {
          create: true,
          delete: true,
          edit: true,
        },
        password: 'test',
        username: 'helloUser',
      });

      const result = await authController.check({
        username: 'helloUserFree',
      });
      expect(result).toBe(false);
    });
  });
});
