import { IsString, IsNotEmpty, IsEmail, ValidateIf } from "class-validator";


export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @ValidateIf(e => e.username != "", { message:'String cannot be empty for User' })
    readonly username: string;
  
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;
  
    @IsString()
    @IsNotEmpty()
    readonly password: string;
}
