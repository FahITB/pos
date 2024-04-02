import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { FireBaseService } from 'src/config/fire-base/fire-base.service';
import { LanguageService } from 'src/config/lang/language.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly firebaseService: FireBaseService,
    private readonly langService: LanguageService,
  ) {}

  //NOTE - login
  async login(authDto: AuthDto): Promise<object> {
    const findAdmin = await this.validateLogin(authDto);

    const payload = {
      username: findAdmin.data().username,
      role: findAdmin.data().role,
      id: findAdmin.id,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      refreshToken: await this.jwtService.signAsync(payload, {
        expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      }),
    };
  }

  async refreshToken(req: any): Promise<object> {
    const fireStore = this.firebaseService
      .getFireStoreInstance()
      .collection('admins');

    const findAdmin = await fireStore.doc(req.user.id).get();

    if (!findAdmin.exists) {
      throw new BadRequestException(this.langService.USER_NOT_FOUND());
    }

    const payload = {
      username: req.user.username,
      id: req.user.id,
      role: req.user.role,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      refreshToken: await this.jwtService.signAsync(payload, {
        expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      }),
    };
  }

  //NOTE - get profile
  async getProfile(req: any) {
    const fireStore = this.firebaseService
      .getFireStoreInstance()
      .collection('admins');

    const findAdmin = await fireStore.doc(req.user.id).get();

    if (!findAdmin.exists) {
      throw new BadRequestException(this.langService.USER_NOT_FOUND());
    }

    return { ...findAdmin.data(), password: undefined };
  }

  //NOTE - validate login
  async validateLogin(authDto: AuthDto) {
    if (!authDto.username) {
      throw new BadRequestException(this.langService.USERNAME_IS_REQUIRED());
    }

    if (!authDto.password) {
      throw new BadRequestException(this.langService.PASSWORD_IS_REQUIRED());
    }

    const fireStore = this.firebaseService
      .getFireStoreInstance()
      .collection('admins');

    const findAdmin = await fireStore
      .where('username', '==', authDto.username)
      .get();

    if (findAdmin.empty) {
      throw new BadRequestException(this.langService.USER_NOT_FOUND());
    }

    const comparePassword = await bcrypt.compare(
      authDto.password,
      findAdmin.docs[0].data().password,
    );

    if (!comparePassword) {
      throw new BadRequestException(this.langService.PASSWORD_INCORRECT());
    }

    return findAdmin.docs[0];
  }
}
