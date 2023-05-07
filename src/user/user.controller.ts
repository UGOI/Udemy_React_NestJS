import { BadRequestException, Body, ClassSerializerInterceptor, Controller, Delete, Get, HttpException, Param, Post, Put, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './user.service';
import * as bcrypt from 'bcrypt';
import { UserCreateDto } from './models/user-create.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserUpdateDto } from './models/user-update.dto';
import { User } from './models/user.entity';
import { AuthService } from 'src/auth/auth.service';
import {Request} from 'express';
import { HasPermission } from 'src/permission/has-permission.decorator';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
    constructor(
        private readonly usersService: UsersService,
        private authService: AuthService,

        ) {}

    @Get()
    @HasPermission('users')
    async all(@Query('page') page: number = 1): Promise<any> {
        return await this.usersService.paginate(page);
    }

    @Post('create')
    async create(@Body() body: UserCreateDto): Promise<User> {
        if (await this.usersService.findOne({ email: body.email })) {
            throw new HttpException('User already exists', 400);
        }
        const password = await bcrypt.hash('123', 12);

        const {role_id, ...data} = body;

        return this.usersService.create({
            ...data,
            password,
            role: {id: role_id}
        });
    }

    @Get(':id')
    async get(@Param('id') id: string): Promise<any> {
        return await this.usersService.findOne({ id: parseInt(id) });
    }
    
    @Put('info')
    async updateInfo(
        @Req() request: Request,
        @Body() body: UserUpdateDto
    ) {
        const id = await this.authService.userId(request);

        await this.usersService.update(id, body);

        return this.usersService.findOne({id});
    }
    

    @Put('password')
    async updatePassword(
        @Req() request: Request,
        @Body('password') password: string,
        @Body('password_confirm') password_confirm: string,
    ) {
        if (password !== password_confirm) {
            throw new BadRequestException('Passwords do not match!');
        }

        const id = await this.authService.userId(request);

        const hashed = await bcrypt.hash(password, 12);

        await this.usersService.update(id, {
            password: hashed
        });

        return this.usersService.findOne({id});
    }


    @Put(':id')
    async update(@Param('id') id: string, @Body() body: UserUpdateDto): Promise<any> {
        const user = await this.usersService.findOne({ id: parseInt(id) });
        if (!user) {
            throw new HttpException('User not found', 404);
        }
        const {role_id, ...data} = body;
        return await this.usersService.update(parseInt(id), {
            ...data,
            role: {id: role_id}
        });
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<any> {
        return await this.usersService.remove(parseInt(id));
    }
}
