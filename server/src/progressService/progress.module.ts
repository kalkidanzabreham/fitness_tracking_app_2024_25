import { Module } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { ProgressController } from './progress.controller';
import { PrismaService } from '../../prisma/prisma.service'; // Assuming Prisma is used

@Module({
  controllers: [ProgressController],
  providers: [ProgressService, PrismaService],
})
export class ProgressModule {}
