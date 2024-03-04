import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';
import { Auth, JWTAuth } from '../services/common/auth.service';
import { InMemoryDB } from '../services/common/database.service';
import { ICredentials, IToken } from '../types/core.types';
import 'dotenv/config';

describe('User test', () => {
  let userController: UserController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
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
  });

  describe('users add', () => {
    it('should return correct users count', async () => {
      await userController.create({
        access: {
          create: true,
          delete: true,
          edit: true,
        },
        password: 'test',
        username: 'helloUser',
        editorUsername: 'admin',
      });
      const allUsers = await userController.getAll();
      expect(allUsers.length).toBe(1);
    });
    it('should return correct username', async () => {
      await userController.create({
        access: {
          create: true,
          delete: true,
          edit: true,
        },
        password: 'test',
        username: 'helloUser',
        editorUsername: 'admin',
      });
      const allUsers = await userController.getAll();
      expect(allUsers[0].username).toBe('helloUser');
    });
    it('should get user by username', async () => {
      await userController.create({
        access: {
          create: true,
          delete: true,
          edit: true,
        },
        password: 'test',
        username: 'helloUser',
        editorUsername: 'admin',
      });
      const desiredUser = await userController.getByName({ name: 'helloUser' });
      expect(desiredUser.username).toBe('helloUser');
    });
    it('should NOT get user by username', async () => {
      await userController.create({
        access: {
          create: true,
          delete: true,
          edit: true,
        },
        password: 'test',
        username: 'helloUser',
        editorUsername: 'admin',
      });
      const desiredUser = await userController.getByName({
        name: 'helloUserWrong',
      });
      expect(desiredUser).toBe(undefined);
    });
  });

  describe('users edit', () => {
    it('should edit username', async () => {
      await userController.create({
        access: {
          create: true,
          delete: true,
          edit: true,
        },
        password: 'test',
        username: 'helloUser',
        editorUsername: 'admin',
      });
      const newUser = await userController.getByName({ name: 'helloUser' });
      await userController.edit({
        ...newUser,
        username: 'EditUser',
        editorUsername: 'admin',
      });
      const editedUser = await userController.getByName({ name: 'EditUser' });
      expect(editedUser).not.toBe(undefined);
    });
    it('should NOT edit username', async () => {
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
      const newUser = await userController.getByName({ name: 'helloUser1' });
      await userController.edit({
        ...newUser,
        username: 'EditUser',
        editorUsername: 'admin',
      });
      const editedUser = await userController.getByName({ name: 'EditUser' });
      expect(editedUser).toBe(undefined);
    });
    it('should edit access', async () => {
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
      const newUser = await userController.getByName({ name: 'helloUser' });
      await userController.edit({
        ...newUser,
        editorUsername: 'admin',
        access: {
          create: false,
          delete: false,
          edit: true,
        },
      });
      const editedUser = await userController.getByName({ name: 'helloUser' });
      expect(JSON.stringify(editedUser.access)).toBe(
        JSON.stringify({
          create: false,
          delete: false,
          edit: true,
        }),
      );
    });
  });

  describe('users delete', () => {
    it('should delete user', async () => {
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
      await userController.delete({
        username: 'helloUser',
        editorUsername: 'admin',
      });
      const allUsers = await userController.getAll();
      expect(allUsers.length).toBe(0);
    });
  });
});
