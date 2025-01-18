import { Injectable } from '@nestjs/common';
import { Permission, Prisma, User } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private readonly prismaService: PrismaService) {}

    async getUserById(id: number): Promise<User | null> {
        return this.prismaService.user.findUnique({
            where: { id },
        });
    }

    async getUserByEmail(email: string): Promise<User | null> {        
        return this.prismaService.user.findUnique({
            where: { email },
        });
    }

    async createUser(data: Prisma.UserCreateInput): Promise<User> {
        return this.prismaService.user.create({
            data,
        });
    }

    async updateUser(id: number, data: Prisma.UserUpdateInput): Promise<User> {
        return this.prismaService.user.update({
            where: { id },
            data,
        });
    }

    async deleteUser(id: number): Promise<User> {
        return this.prismaService.user.delete({
            where: { id },
        });
    }

    async getUsers(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.UserWhereUniqueInput;
        where?: Prisma.UserWhereInput;
        orderBy?: Prisma.UserOrderByWithRelationInput;
    }): Promise<User[]> {
        const { skip, take, cursor, where, orderBy } = params;
        return this.prismaService.user.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
        });
    }

    async getUserRoles(userId: number): Promise<string[]> {
        const user = await this.prismaService.user.findUnique({
            where: { id: userId },
            include: { roles: { include: { role: true } } },
        });

        return user.roles.map((userRole) => userRole.role.name);
    }

    async getUserPermissions(userId: number): Promise<string[]> {
        const user = await this.prismaService.user.findUnique({
            where: { id: userId },
            include: { roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } } },
    })
        const permissions = user.roles.flatMap((userRole) => userRole.role.permissions)
            .map((rolePermission) => rolePermission.permission.name);

        return permissions;

    }

    
}
