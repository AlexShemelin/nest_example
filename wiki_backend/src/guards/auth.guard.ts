import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { requestValidatorService } from '../services/common/requestValidator.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly requestValidator: requestValidatorService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.requestValidator.validateRequest(request);
  }
}
