import { BusinessUser } from 'src/business-entities/business.user.entity';
import {
  RqCreateCustomerDto,
  RqGetZoneDto,
  RqRegisterUserDto,
  RsGetCustomerDto,
  RsGetCustomesByZoneDto,
} from 'src/dto';
import { RsCustomer } from 'src/dto/rs-get-customers-by-zone.dto';
import { User } from 'src/entities';
import { UserByZone } from 'src/entities/userbyZone.query';

//   interface and provide that token when injecting to an interface type.
export const RQ_RS_FACTORY_SERVICE = 'RQ_RS_FACTORY_SERVICE';

/* ----------------------------------- */

export interface IRqRsFactory {
  UserEntitytoDTOResponse(
    statusCode: number,
    message: string,
    user: User,
  ): RsGetCustomerDto;

  /* ------------- */

  DTORequesttoBusinessUserEntity(
    rqCreateCustomerDto: RqCreateCustomerDto,
  ): BusinessUser;

  /* ------------- */

  createRqGetZoneDto(zone_id: number): RqGetZoneDto;

  /* ------------- */

  createRegisterUserDto(
    role_id: number,
    user_id: number,
    username: string,
    password: string,
  ): RqRegisterUserDto;

  /* ------------- */

  createRsGetUsersByZone(
    statusCode: number,
    message: string,
    users: RsCustomer[],
  ): RsGetCustomesByZoneDto;

  /* ------------- */

  createRsCustomer(user: UserByZone): RsCustomer;
}

/* ----------------------------------- */
