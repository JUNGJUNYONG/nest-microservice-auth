import { Controller } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('login')
  public async login(@Payload() data) {
    return this.authService.login(data);
  }
}
