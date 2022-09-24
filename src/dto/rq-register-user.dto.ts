import { Exclude, Expose } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, Length } from "class-validator";

/* ----------------------------------- */

// @Exclude() at the top of the Dto, we're telling class-transformer to exclude 
//    any field that doesn't have the @Expose() decorator in the DTO file when
//    we'll be instantiating a Dto from any other object.
@Exclude()
export class RqRegisterUserDto {
    @Expose()
    @IsNotEmpty()
    @IsNumber()
    role_id: number;
    @Expose()
    @IsNotEmpty()
    @IsNumber()
    user_id: number;
    @Expose()
    @IsNotEmpty()
    @IsString()
    username: string;
    @Expose()
    @IsNotEmpty()
    @IsString()
    @Length(6, 20)
    password: string;

    constructor(role_id: number, user_id: number, username: string, password: string)  {
        this.role_id = role_id;
        this.user_id = user_id;
        this.username =  username;
        this.password = password;
    }
}

/* ----------------------------------- */
