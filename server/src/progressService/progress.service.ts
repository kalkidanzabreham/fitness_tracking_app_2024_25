import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service'; // Assuming you're using Prisma ORM

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  // Method to calculate and retrieve user progress
  async getProgress(userId: number) {
    const activities = await this.prisma.fitnessActivities.findMany({
      where: { userId },
    });

    // If no activities found, return a default progress object
    if (activities.length === 0) {
      return {
        totalDuration: 0,
        totalCaloriesBurned: 0,
        averageBMI: 0,
        bmiTrend: [],
        labels: [],
        bmiData: [],
      };
    }

    // Calculate total duration, calories burned, and average BMI
    const totalDuration = activities.reduce((sum, a) => sum + a.duration, 0);
    const totalCaloriesBurned = activities.reduce(
      (sum, a) => sum + a.caloriesBurned,
      0,
    );
    const averageBMI =
      activities.reduce((sum, a) => sum + a.bmi, 0) / activities.length;

    // Prepare labels (dates) and BMI data for chart (line chart)
    const labels = activities.map((a) => a.date.toISOString().slice(0, 10)); // Extract date part (e.g., YYYY-MM-DD)
    const bmiData = activities.map((a) => a.bmi);

    const bmiTrend = activities.map((a) => ({
      date: a.date.toISOString(), // Format date to ISO string
      bmi: a.bmi,
      bmiLabel: a.bmiLabel,
    }));

    return {
      totalDuration,
      totalCaloriesBurned,
      averageBMI,
      bmiTrend,
      labels, // Dates for x-axis
      bmiData, // BMI values for y-axis
    };
  }
}

