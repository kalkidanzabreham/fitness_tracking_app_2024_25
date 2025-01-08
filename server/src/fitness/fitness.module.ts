import { Module } from '@nestjs/common';
import { FitnessActivitiesService } from './fitness.service';
import { FitnessActivitiesController } from './fitness.controller';
import { PrismaService } from '../../prisma/prisma.service'; 

@Module({
  controllers: [FitnessActivitiesController],
  providers: [FitnessActivitiesService, PrismaService],
})
export class FitnessActivitiesModule {}
