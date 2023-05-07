import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants';

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [], // No need to import ConfigModule again, since it's global
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                const jwtConfig = jwtConstants(configService);
                return {
                secret: jwtConfig.secret,
                signOptions: { expiresIn: '1d' },
                };
            },
            }),
    ],
    exports: [JwtModule],
})
export class CommonModule {}
