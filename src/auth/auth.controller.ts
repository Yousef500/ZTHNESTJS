import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dtos/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() body: AuthCredentialsDto) {
    return this.authService.signUp(body);
  }

  @Post('/signin')
  signIn(@Body() body: AuthCredentialsDto) {
    return this.authService.signIn(body);
  }
}
