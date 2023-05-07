import { BadRequestException, Body, ClassSerializerInterceptor, Controller, Delete, Get, HttpException, Param, Post, Put, Query, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './models/register.dto'
import { LoginDto } from './models/login.dto';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';


@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class AuthController {

    constructor(
        private readonly usersService: UsersService,
        private authService: AuthService,
        private jwtService: JwtService,
        ) {}

    @Post('register')
    async register(@Body() body: RegisterDto) {
        if (body.password !== body.password_confirmation) {
            throw new HttpException('Passwords do not match', 400);
        }
        if (await this.usersService.findOne({ email: body.email })) {
          throw new HttpException('User already exists', 400);
        }
        const salt = await bcrypt.genSalt(10);
        body.password = await bcrypt.hash(body.password, salt);
        return this.usersService.create({
          first_name: body.first_name,
          last_name: body.last_name,
          email: body.email,
          password: body.password,
          role: {id: 1}
        });
    }
    

    @Post('login')
    async login(
        @Body() body: LoginDto,
        @Res({ passthrough: true }) response: Response
        ) {
        const jwt = await this.authService.signIn(body.email, body.password);
        response.cookie('jwt', jwt.access_token, { httpOnly: true });
        return 'Login successful';
    }

    @UseGuards(AuthGuard)
    @Get('user')
    async user(@Req() request: Request) {
        const id = await this.authService.userId(request);

        return this.usersService.findOne({id});
    }
    
    @UseGuards(AuthGuard)
    @Post('logout')
    async logout(@Res({ passthrough: true }) response: Response) {
      response.clearCookie('jwt');
      return 'Logout successful';
    }
    
}
