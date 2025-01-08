import { Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { UsersController } from './user.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  providers: [UsersService, PrismaService],
  controllers: [UsersController],
})
export class UserModule {}
