import { Injectable } from "@nestjs/common";
import { Exclude, Expose } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

/* ----------------------------------- */

@Injectable()
@Exclude()
export class RqGetCustomerDto {
    @Expose()
    @IsNotEmpty()
    @IsNumber()
    id: number;
}

/* ----------------------------------- */
