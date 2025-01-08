import { Controller, Get, Param } from '@nestjs/common';
import { ProgressService } from './progress.service';

@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  // Endpoint to get the progress summary of a user
  @Get(':userId')
  async getProgress(@Param('userId') userId: string) {
    const userIdInt = parseInt(userId, 10);
    return this.progressService.getProgress(userIdInt);
  }
}
