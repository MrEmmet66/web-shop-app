import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: false});

  app.setGlobalPrefix('api/v1')

  app.enableCors({
    origin: process.env.CLIENT_URL,
    credentials: true
  })

  app.use(cookieParser())

  const path = join(__dirname, '../../', 'uploads');
  console.log(path);
  

  app.useStaticAssets(join(__dirname, '../../', 'uploads'), {
    prefix: '/api/v1/uploads/',
  });
  
  const config = new DocumentBuilder()
  .setTitle('Web Shop API')
  .setDescription('API for a web shop')
  .setVersion('1.0')
  .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory, {
    url: '/api',
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
