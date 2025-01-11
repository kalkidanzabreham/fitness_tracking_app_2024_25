import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FitnessActivitiesService {
  constructor(private prisma: PrismaService) {}

  // Method to add fitness activity and calculate BMI
  async addActivity(userId: number, data: any) {
    const { weight, height, type, duration, caloriesBurned, age } = data;

    // Calculate BMI
    const bmi = weight / (height * height);

    // Determine BMI Label
    let bmiLabel = 'Normal';
    if (bmi < 18.5) {
      bmiLabel = 'Underweight';
    } else if (bmi >= 25 && bmi < 30) {
      bmiLabel = 'Overweight';
    } else if (bmi >= 30) {
      bmiLabel = 'Obese';
    }
    const currentDate = new Date().toISOString();
    // Save the activity record in the database
    return this.prisma.fitnessActivities.create({
      data: {
        ...data,
        userId,
        date: currentDate,
      },
    });
  }

  // Method to get all fitness activities of a user
  async getActivities(userId: number) {
    return this.prisma.fitnessActivities.findMany({
      where: { userId },
    });
  }

  // Method to update an existing activity
  async updateActivity(activityId: number, data: any) {
    const { weight, height, type, duration, caloriesBurned, age } = data;

    // Recalculate BMI
    const bmi = weight / (height * height);

    // Determine BMI Label
    let bmiLabel = 'Normal';
    if (bmi < 18.5) {
      bmiLabel = 'Underweight';
    } else if (bmi >= 25 && bmi < 30) {
      bmiLabel = 'Overweight';
    } else if (bmi >= 30) {
      bmiLabel = 'Obese';
    }

    const currentDate = new Date().toISOString();
    // Update the activity record in the database
    return this.prisma.fitnessActivities.update({
      where: { id: activityId },
      data: {
        type,
        duration,
        caloriesBurned,
        weight,
        age,
        height,
        bmi,
        bmiLabel,
        date: currentDate,
      },
    });
  }

  // Method to delete an activity by its ID
  async deleteActivity(activityId: number) {
    return this.prisma.fitnessActivities.delete({
      where: { id: activityId },
    });
  }
}
