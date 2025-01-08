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

      if (user && (await argon.verify(user.password,dto.password))) {
        const token = this.jwtService.sign(
          { userId: user.id },
          { expiresIn: '1h' },
        ); // Token expiry set to 1 hour
        return { token };
      }
      throw new UnauthorizedException('Credential Incorrect');
    } catch (error) {
      console.error('error:', error);
      throw new InternalServerErrorException(
        'cant login due to internal error',
      );
    }
  }

  async register(dto: AuthDtoRegister) {
    try {
      const existingUseremail = await this.prisma.users.findUnique({
        where: { email: dto.email },
      });
      if (existingUseremail) {
        throw new ConflictException('Email address taken');
      }

      const existingUsername = await this.prisma.users.findUnique({
        where: { username: dto.username },
      });
      if (existingUsername) {
        throw new ConflictException('Username taken');
      }

      const hashedPassword = await argon.hash(dto.password);
      return this.prisma.users.create({
        data: {
          ...dto,
          password: hashedPassword,
        },
      });
    } catch (error) {
      console.error('error:', error);
      throw new InternalServerErrorException(
        'cant register due to internal error',
      );
    }
  }
}
