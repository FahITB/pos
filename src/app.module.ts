import { Module } from '@nestjs/common';
import { FireBaseModule } from './config/fire-base/fire-base.module';
import { AdminModule } from './api/admin/admin.module';
import { AuthModule } from './api/auth/auth.module';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import * as path from 'path';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, './i18n'),
        watch: true,
        includeSubfolders: true,
      },
      resolvers: [
        {
          use: QueryResolver,
          options: ['lang'],
        },
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang']),
      ],
    }),
    FireBaseModule,
    AdminModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
