import { Module } from '@nestjs/common';
import { PrismaDB } from '../services/common/database.service';
import { PrismaService } from '../services/common/prisma.service';

@Module({
  providers: [
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'DatabaseAbstract',
      useClass: PrismaDB,
    },
  ],
  exports: ['DatabaseAbstract', 'PrismaService'],
})
export class DatabaseModule {}
