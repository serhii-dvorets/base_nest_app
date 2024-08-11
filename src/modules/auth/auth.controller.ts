import { Controller, Post, Body, Session, Get, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { LogInDto } from './dto/log-in.dto';
import { Public } from 'src/common/decorators/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signin')
  create(
    @Session() session: Record<string, any>,
    @Body() signInData: SignInDto,
  ) {
    return this.authService.signIn(session, signInData);
  }

  @Public()
  @Post('login')
  login(@Session() session: Record<string, any>, @Body() logInData: LogInDto) {
    return this.authService.login(session, logInData);
  }

  @Get('logout')
  logout(@Session() session: Record<string, any>) {
    return this.authService.logout(session);
  }

  @Public()
  @Get('confirm-email/:actionId')
  confirmEmail(@Param('actionId') actionId: string) {
    return this.authService.confirmEmail(actionId);
  }
}
