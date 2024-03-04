import { Injectable, Logger } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class requestValidatorService {
  validateRequest(request: any) {
    const token = request.headers.authorization as string;
    const url = request.url as string;
    const method = request.method as 'POST' | 'GET' | 'PUT' | 'DELETE';
    Logger.log(`url: ${url}, method: ${method}`);
    if (method === 'GET' || url === '/auth' || url === '/article/search') {
      return true;
    }
    if (!token) {
      return false;
    }
    const isValid = jwt.verify(token, process.env.JWT_SECRET);
    if (
      typeof isValid !== 'string' &&
      'userId' in isValid &&
      'exp' in isValid
    ) {
      return true;
    }
    return false;
  }
}
