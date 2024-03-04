import { Module } from '@nestjs/common';
import { requestValidatorService } from '../services/common/requestValidator.service';

@Module({
  providers: [requestValidatorService],
  exports: [requestValidatorService],
})
export class ValidatorModule {}
