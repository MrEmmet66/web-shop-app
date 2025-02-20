/*
https://docs.nestjs.com/modules
*/

import { Global, Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Global()
@Module({
    imports: [],
    controllers: [],
    providers: [PrismaService],
    exports: [PrismaService],
})
export class PrismaModule { }
