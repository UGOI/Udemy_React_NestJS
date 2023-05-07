import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Response, Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signIn(username, pass) {
    const user = await this.usersService.findOne({ email: username });
    if (!user) {
        throw new NotFoundException('User not found');
    }
    const passwordMatch = await bcrypt.compare(pass, user.password);
    if (!passwordMatch) {
        throw new BadRequestException('Invalid credentials');
    }
    const payload = { username: user.email, sub: user.id };

    return {
        access_token: await this.jwtService.signAsync(payload),
    };
}


async userId(request: Request): Promise<number> {
  const cookie = request.cookies['jwt'];
  const data = await this.jwtService.verifyAsync(cookie);
  console.log('JWT data:', data);

  return data['sub'];
}

}



