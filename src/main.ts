import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";
import {corsConfig} from "./common/security/cors.config";
import {CookieUtil} from "./common/utils/cookie.util";
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
  .setTitle('The Gym\'s API ')
  .setDescription('The Gym 어플리케이션에서 이용하는 API 목록 입니다.')
  .setVersion('1.0.0')
  .addServer('http://localhost:3001/', 'Local environment')
  .addServer('https://dgym.shop/', 'Production')
  .build(); 

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);

  app.enableCors(corsConfig);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  CookieUtil.useCookieParser(app);
  await app.listen(process.env.PORT ?? 3001);
}

bootstrap().catch((error) => {
  console.error('Application failed to start:', error);
  process.exit(1);
});
