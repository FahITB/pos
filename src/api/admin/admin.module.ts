import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { FireBaseService } from 'src/config/fire-base/fire-base.service';
import { ConfigModule } from '@nestjs/config';
import { LanguageService } from 'src/config/lang/language.service';
import { LanguageModule } from 'src/config/lang/language.module';

@Module({
  imports: [ConfigModule.forRoot(), LanguageModule],
  controllers: [AdminController],
  providers: [AdminService, FireBaseService, LanguageService],
})
export class AdminModule {}
