import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from 'prisma/prisma.service';
import { ProgressModule } from './progressService/progress.module';
import { FitnessActivitiesModule } from './fitness/fitness.module';


@Module({
  imports: [AuthModule,ProgressModule,FitnessActivitiesModule],
  providers: [PrismaService],
})
export class AppModule {}
