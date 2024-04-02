import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthDto } from './dto/auth.dto';
import { AuthGuard, RefreshGuard } from 'src/config/guard/auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //NOTE - login
  @Post()
  async login(@Body() authDto: AuthDto): Promise<object> {
    return await this.authService.login(authDto);
  }

  //NOTE - refresh
  @UseGuards(RefreshGuard)
  @ApiBearerAuth()
  @Post('refresh')
  async refreshToken(@Req() req: Request): Promise<object> {
    return await this.authService.refreshToken(req);
  }

  //NOTE - get profile
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get('profile')
  async getProfile(@Req() req: Request) {
    return await this.authService.getProfile(req);
  }
}
