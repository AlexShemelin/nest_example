import { Inject, Injectable } from '@nestjs/common';
import { DatabaseAbstract } from './common/database.service';
import { Auth } from './common/auth.service';
import type { ICredentials, IError, IToken } from '../types/core.types';
import {
  CreateUserDto,
  EditUserDto,
  DeleteUserDto,
} from 'src/types/common.dto';

@Injectable()
export abstract class UserServiceAbstract {
  public abstract login(username: string, password: string): Promise<IError>;
  public abstract create(credentials: ICredentials): Promise<IError>;
  public abstract delete(dto: DeleteUserDto): Promise<IError>;
  public abstract edit(dto: EditUserDto): Promise<IError>;
}

@Injectable()
export class UserService extends UserServiceAbstract {
  constructor(
    private readonly auth: Auth<ICredentials, IToken>,
    @Inject('DatabaseAbstract') private database: DatabaseAbstract,
  ) {
    super();
  }

  async login(username: string, password: string) {
    const authResult = await this.auth.login({
      username,
      password,
    });
    return authResult;
  }

  async create(dto: CreateUserDto) {
    return await this.auth.create(dto);
  }

  async delete(dto: DeleteUserDto) {
    return await this.database.deleteUser(dto);
  }

  async edit(dto: EditUserDto) {
    return await this.database.editUser(dto);
  }

  async getAll() {
    return await this.database.getAllUsers();
  }

  async getOneById(id: number) {
    return await this.database.getUserById(id);
  }

  async getOneByName(username: string) {
    return await this.database.getUserByName(username);
  }

  async checkUsernameAvailability(username: string) {
    return await this.database.isUserExists(username);
  }
}
