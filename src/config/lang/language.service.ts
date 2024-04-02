import { Injectable } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class LanguageService {
  constructor(private readonly i18n: I18nService) {}

  USERNAME_IS_REQUIRED(): string {
    return this.i18n.t('validation.USERNAME_IS_REQUIRED', {
      lang: I18nContext.current().lang,
    });
  }

  PASSWORD_IS_REQUIRED(): string {
    return this.i18n.t('validation.PASSWORD_IS_REQUIRED', {
      lang: I18nContext.current().lang,
    });
  }

  USERNAME_ALREADY_EXISTS(): string {
    return this.i18n.t('exception.USERNAME_ALREADY_EXISTS', {
      lang: I18nContext.current().lang,
    });
  }

  USER_NOT_FOUND(): string {
    return this.i18n.t('exception.USER_NOT_FOUND', {
      lang: I18nContext.current().lang,
    });
  }

  UPLOAD_IMAGE_FAILED(): string {
    return this.i18n.t('exception.UPLOAD_IMAGE_FAILED', {
      lang: I18nContext.current().lang,
    });
  }

  PASSWORD_INCORRECT(): string {
    return this.i18n.t('exception.PASSWORD_INCORRECT', {
      lang: I18nContext.current().lang,
    });
  }
}
