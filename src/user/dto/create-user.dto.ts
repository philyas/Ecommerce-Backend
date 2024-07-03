import { IsString, IsNotEmpty } from "class-validator";
import { IsNotEmptyString } from "../validation/non-empty-string.validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @IsNotEmptyString()
    readonly username: string;
  
    @IsString()
    @IsNotEmptyString()
    @IsNotEmpty()
    readonly email: string;
  
    @IsString()
    @IsNotEmptyString()
    @IsNotEmpty()
    readonly password: string;
}
