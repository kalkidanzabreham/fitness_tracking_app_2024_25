import { Injectable } from '@nestjs/common';
import { PrismaService } from "../../prisma/prisma.service"

@Injectable()
export class FitnessActivitiesService {
  constructor(private prisma: PrismaService) {}

  // Method to add fitness activity and calculate BMI
  async addActivity(userId: number, data: any) {
    const { weight, height, type, duration, caloriesBurned,age } = data;

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

    // Save the activity record in the database
    return this.prisma.fitnessActivities.create({
      data: {
        userId,
        type,
        duration,
        caloriesBurned,
        weight,
        age,
        height,
        bmi,
        bmiLabel,
        date: new Date(),
      },
    });
  }

  // Optional method to retrieve all fitness activities of a user
  async getActivities(userId: number) {
    return this.prisma.fitnessActivities.findMany({
      where: { userId },
    });
  }
}
