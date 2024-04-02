import { NestFactory } from '@nestjs/core';
import { setupSwagger } from './config/swagger/swagger.config';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // NOTE - This is for CORS (Cross-Origin Resource Sharing)
  app.enableCors();

  // NOTE - This is for security
  app.use(helmet());

  // NOTE - This is for global prefix
  app.setGlobalPrefix('api');

  // NOTE - This is for swagger documentation
  if (process.env.NODE_ENV === 'development') {
    setupSwagger(app);
  }

  // NOTE - This is for the port and host
  await app.listen(process.env.PORT, '0.0.0.0', async () => {
    console.log(`🚀 Application is running on: ${await app.getUrl()}/api`);
  });
}
bootstrap();
