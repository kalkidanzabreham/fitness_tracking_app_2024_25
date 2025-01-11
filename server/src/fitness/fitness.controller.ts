import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { FitnessActivitiesService } from './fitness.service';

@Controller('activities')
export class FitnessActivitiesController {
  constructor(
    private readonly fitnessActivitiesService: FitnessActivitiesService,
  ) {}

  // Get activities by userId
  @Get(':userId')
  async getActivities(@Param('userId') userId: string) {
    const userIdInt = parseInt(userId, 10); // Convert userId to an integer
    return this.fitnessActivitiesService.getActivities(userIdInt);
  }

  // Add new activity
  @Post(':userId')
  async addActivity(@Param('userId') userId: string, @Body() data: any) {
    const userIdInt = parseInt(userId, 10); // Convert userId to an integer
    return this.fitnessActivitiesService.addActivity(userIdInt, data);
  }

  // Update an existing activity by its ID
  @Put(':activityId')
  async updateActivity(
    @Param('activityId') activityId: string,
    @Body() data: any,
  ) {
    const activityIdInt = parseInt(activityId, 10); // Convert activityId to an integer
    return this.fitnessActivitiesService.updateActivity(activityIdInt, data);
  }

  // Delete an activity by its ID
  @Delete(':activityId')
  async deleteActivity(@Param('activityId') activityId: string) {
    const activityIdInt = parseInt(activityId, 10); // Convert activityId to an integer
    return this.fitnessActivitiesService.deleteActivity(activityIdInt);
  }
}
