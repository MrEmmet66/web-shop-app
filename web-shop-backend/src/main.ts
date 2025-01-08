import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: false});

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
