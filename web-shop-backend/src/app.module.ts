import { PrismaModule } from './../prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,],
  controllers: [AppController],
  providers: [
    ],
})
export class AppModule { }
