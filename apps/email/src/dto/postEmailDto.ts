import { IsEmail, IsNumber, IsString, } from "class-validator";

export class PostEmailDto {
    @IsString()
    @IsEmail()
    email: string;

    password: string;

    @IsString()
    host: string

    @IsNumber()
    port: number
}