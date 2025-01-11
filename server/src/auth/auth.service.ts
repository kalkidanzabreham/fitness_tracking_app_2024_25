import { AuthDtoLogin, AuthDtoRegister } from './dto/auth.dto';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';
import * as argon from 'argon2';
import {
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: AuthDtoLogin) {
    try {
      const user = await this.prisma.users.findUnique({
        where: { email: dto.email },
      });

      if (user && (await argon.verify(user.password, dto.password))) {
        const token = this.jwtService.sign(
          { userId: user.id },
          { expiresIn: '1h' }, // Token expiry set to 1 hour
        );
        return { token, user };
      }

      // Send exact error message for invalid credentials
      throw new UnauthorizedException('Invalid credentials. Please try again.');
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof UnauthorizedException) {
        // Re-throw specific UnauthorizedException to retain the message
        throw error;
      }
      throw new InternalServerErrorException(
        'An internal error occurred. Please try again later.',
      );
    }
  }

  async register(dto: AuthDtoRegister) {
    try {
      const existingUseremail = await this.prisma.users.findUnique({
        where: { email: dto.email },
      });
      if (existingUseremail) {
        // Send exact error message for email conflict
        throw new ConflictException('Email address is already taken.');
      }

      const existingUsername = await this.prisma.users.findUnique({
        where: { username: dto.username },
      });
      if (existingUsername) {
        // Send exact error message for username conflict
        throw new ConflictException('Username is already taken.');
      }

      const hashedPassword = await argon.hash(dto.password);
      const newUser = await this.prisma.users.create({
        data: {
          ...dto,
          password: hashedPassword,
        },
      });

      return newUser;
    } catch (error) {
      console.error('Registration error:', error);
      if (error instanceof ConflictException) {
        // Re-throw specific ConflictException to retain the message
        throw error;
      }
      throw new InternalServerErrorException(
        'An internal error occurred while registering. Please try again later.',
      );
    }
  }
}
