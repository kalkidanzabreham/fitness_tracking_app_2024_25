import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: number) {
    return this.prisma.users.findMany({
      where: { id: userId },
    });
  }

  async findOne(id: number, userId: number) {
  return this.prisma.users.findUnique({
    where: { id: id }, // Ensure that 'id' is a number in the 'where' clause
  });
  }
}
