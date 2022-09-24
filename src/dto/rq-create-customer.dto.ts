import { IsNotEmpty, IsNumber, IsObject, IsString } from 'class-validator';

/* ----------------------------------- */

export class PointDto {
  @IsNumber()
  latitude: number;
  @IsNumber()
  longitud: number;
}

/* ----------------------------------- */

export class RqCreateCustomerDto {
  @IsString()
  name: string;
  @IsString()
  address: string;
  @IsNotEmpty()
  @IsObject()
  location: PointDto;
  @IsNumber()
  zone_id: number;
  @IsNumber()
  role_id: number;
  @IsString()
  username: string;
  @IsString()
  password: string;
}

/* ----------------------------------- */
