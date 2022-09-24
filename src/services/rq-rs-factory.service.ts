import { Injectable } from '@nestjs/common';
import { BusinessUser } from 'src/business-entities/business.user.entity';
import {
  RqCreateCustomerDto,
  RqGetZoneDto,
  RqRegisterUserDto,
  RsGetCustomerDto,
  RsGetCustomesByZoneDto,
} from 'src/dto';
import { RsCustomer } from 'src/dto/rs-get-customers-by-zone.dto';
import { UserByZone } from 'src/entities/userbyZone.query';
import { IRqRsFactory } from 'src/interfaces';

/* ------------------------------------------------------- */

@Injectable()
export class RqRsFactoryService implements IRqRsFactory {
  DTORequesttoBusinessUserEntity(
    rqCreateCustomerDto: RqCreateCustomerDto,
  ): BusinessUser {
    const us = new BusinessUser();
    us.address = rqCreateCustomerDto.address;
    us.latitude = rqCreateCustomerDto.location.latitude;
    us.longitude = rqCreateCustomerDto.location.longitud;
    us.role_id = rqCreateCustomerDto.role_id;
    us.zone_id = rqCreateCustomerDto.zone_id;
    us.name = rqCreateCustomerDto.name;
    us.username = rqCreateCustomerDto.username;
    us.password = rqCreateCustomerDto.password;
    return us;
  }

  /* ------------------- */

  UserEntitytoDTOResponse(
    statusCode: number,
    message: string,
    user: BusinessUser,
  ): RsGetCustomerDto {
    return new RsGetCustomerDto(
      { statusCode, message }, // header
      user // Check if user information is available
        ? {
            // add data
            id: user.id,
            name: user.name,
            address: user.address,
            location: {
              latitude: user.latitude,
              longitud: user.longitude
            },
            zone_id: user.zone_id,
            role_id: user.role_id,
          }
        : null, // without data
    );
  }

  /* ------------------- */

  createRqGetZoneDto(zone_id: number): RqGetZoneDto {
    return new RqGetZoneDto(zone_id);
  }

  /* ------------------- */

  createRegisterUserDto(
    role_id: number,
    user_id: number,
    username: string,
    password: string,
  ): RqRegisterUserDto {
    return new RqRegisterUserDto(role_id, user_id, username, password);
  }

  createRsGetUsersByZone(
    statusCode: number,
    message: string,
    users: RsCustomer[],
  ): RsGetCustomesByZoneDto {
    return new RsGetCustomesByZoneDto(
      { statusCode, message }, // header
      users,
    );
  }

  /* ------------- */

  createRsCustomer(user: UserByZone): RsCustomer {
    return new RsCustomer(
      user.id,
      user.name,
      user.address,
      {
        latitude: user.latitude,
        longitud: user.longitude,
      },
      user.zone_id,
      user.role_id,
    );
  }
}

/* ------------------------------------------------------- */
