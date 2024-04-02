import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
// import { LanguageService } from '..//config/lang/language.service';

// NOTE - AuthGuard is used to protect routes
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    // private langService: LanguageService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException({
        message: 'Unauthorized',
        error: 'Unauthorized',
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      request['user'] = payload;
    } catch (error) {
      throw new UnauthorizedException({
        message: 'Unauthorized',
        error: 'Unauthorized',
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

// NOTE - RefreshGuard is used to protect routes
@Injectable()
export class RefreshGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    // private langService: LanguageService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = await context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException({
        message: 'Unauthorized',
        error: 'Unauthorized',
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      });

      request['user'] = payload;
    } catch (error) {
      throw new UnauthorizedException({
        message: 'Unauthorized',
        error: 'Unauthorized',
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
