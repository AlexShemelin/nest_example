import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import type { IError } from '../../types/core.types';
import type { ICredentials, IToken } from '../../types/core.types';
import { DatabaseAbstract } from './database.service';
import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export abstract class Auth<T, R> {
  public abstract create(credentials: T): Promise<IError>;
  public abstract login(credentials: T): Promise<IError>;
  public abstract validateToken(token: R): Promise<boolean | IError>;
}

@Injectable()
export class JWTAuth extends Auth<ICredentials, IToken> {
  constructor(@Inject('DatabaseAbstract') private database: DatabaseAbstract) {
    super();
  }

  public async create(credentials: ICredentials) {
    try {
      const { username, password } = credentials;

      if (!username || !password) {
        return {
          status: 500,
          message: 'Credentials are null',
        };
      }

      const isExists = await this.database.isUserExists(username);

      if (isExists && typeof isExists === 'boolean') {
        return {
          status: 500,
          message: 'User already exists',
        };
      } else if (typeof isExists !== 'boolean') {
        return isExists;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await this.database.createUser({
        access: {
          create: true,
          delete: true,
          edit: true,
        },
        editorUsername: 'admin',
        username,
        password: hashedPassword,
      });

      return result;
    } catch (e) {
      return {
        status: 500,
        message: String(e),
      };
    }
  }

  public async login(credentials: ICredentials) {
    try {
      const { username, password } = credentials;
      const userData = await this.database.getUserByName(username);

      if (!userData) {
        return {
          status: 500,
          message: 'User is not found',
        };
      }
      const passwordMatch = await bcrypt.compare(password, userData.password);
      if (!passwordMatch) {
        return {
          status: 500,
          message: 'Your credentials are incorrect',
        };
      }

      const token = jwt.sign({ userId: username }, process.env.JWT_SECRET, {
        expiresIn: '1000d', // cannot be expired for simplicity
      });

      const result = await this.database.login({
        username,
        token,
      });

      return result;
    } catch (e) {
      return {
        status: 500,
        message: String(e),
      };
    }
  }

  public async validateToken(tokenCredentials: IToken) {
    try {
      const isValid = await this.database.validateUserToken(
        tokenCredentials.token,
      );
      return isValid;
    } catch (e) {
      return {
        status: 500,
        message: String(e),
      };
    }
  }
}
