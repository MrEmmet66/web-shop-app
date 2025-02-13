import { CartController } from './cart/cart.controller';
import { CartService } from './cart/cart.service';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { CategoriesService } from './categories/categories.service';
import { CatergoriesController } from './categories/catergories.controller';
import { CategoriesModule } from './categories/categories.module';
import { ProductsController } from './products/products.controller';
import { ProductsService } from './products/products.service';
import { ProductsModule } from './products/products.module';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from './mail/mail.module';
import { PrismaModule } from './../prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';

@Module({
  imports: [
    PrismaModule,
    CartModule,
    OrdersModule,

    CategoriesModule,
    MulterModule.register({
      storage: diskStorage({
        destination: 'uploads',
        filename: (req, file, callback) => {
          const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
          callback(null, uniqueName);
        },
      })
    }),
    ProductsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MailModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [
    CartController,
    CatergoriesController,
    ProductsController],
  providers: [
    CartService,
    CategoriesService,
    ProductsService,
  ],
})
export class AppModule { }
