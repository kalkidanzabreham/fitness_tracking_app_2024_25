import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { FitnessActivitiesService } from './fitness.service';

@Controller('activities')
export class FitnessActivitiesController {
  constructor(
    private readonly fitnessActivitiesService: FitnessActivitiesService,
  ) {}

  @Get(':userId')
  async getActivities(@Param('userId') userId: string) {
    // Convert userId to an integer
    const userIdInt = parseInt(userId, 10);
    return this.fitnessActivitiesService.getActivities(userIdInt);
  }

  @Post(':userId')
  async addActivity(@Param('userId') userId: string, @Body() data: any) {
    // Convert userId to an integer
    const userIdInt = parseInt(userId, 10);
    return this.fitnessActivitiesService.addActivity(userIdInt, data);
  }
}
