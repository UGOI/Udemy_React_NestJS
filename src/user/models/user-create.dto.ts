import { IsNotEmpty, IsString } from "class-validator";

export class UserCreateDto {

    @IsString()
    @IsNotEmpty()
    first_name: string;

    @IsString()
    @IsNotEmpty()
    last_name: string;

    @IsString()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    role_id: number;
}