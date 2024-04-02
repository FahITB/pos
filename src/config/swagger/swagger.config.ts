import { INestApplication } from '@nestjs/common';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerCustomOptions,
} from '@nestjs/swagger';

/**
 * Swagger
 *
 * @param {INestApplication} app
 */
export function setupSwagger(app: INestApplication): void {
  const options = new DocumentBuilder()
    .setTitle('SOKXAY API Docs')
    .setDescription('### SOKXAY API for user and admin management')
    .addBearerAuth({
      description: 'Default JWT Authorization',
      type: 'http',
      in: 'headers',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    })
    .addGlobalParameters({
      name: 'Accept-Language',
      in: 'header',
      required: true,
      example: 'en',
      description: 'The preferred language of the client: en, lo',
    })
    .setVersion('v1.2.0-dev')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  const customSiteTitle: SwaggerCustomOptions = {
    customSiteTitle: 'SOKXAY API Docs',
    customCss:
      '.swagger-ui .topbar { display: none } .swagger-ui background-color: #f8f8f8;',
    swaggerOptions: {
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true,
    },
  };
  SwaggerModule.setup('api', app, document, customSiteTitle);
}
