import { AuthDtoLogin,AuthDtoRegister} from "./dto/auth.dto";
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto:AuthDtoRegister) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: AuthDtoLogin) {
    return this.authService.login(dto);
  }
}
