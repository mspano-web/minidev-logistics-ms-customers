import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';

import { firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import { BusinessUser } from './business-entities/business.user.entity';

import {
  RqGetZoneDto,
  RsCreateCustomerDto,
  RsGetCustomerDto,
  RsGetCustomesByZoneDto,
} from './dto';
import { User } from './entities';
import { UserByZone } from './entities/userbyZone.query';
import { IRqRsFactory, RQ_RS_FACTORY_SERVICE } from './interfaces';

/* ------------------------------------------------------ */

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @Inject(RQ_RS_FACTORY_SERVICE)
    private readonly rqRsFactoryService: IRqRsFactory,

    @Inject('AUTH_TRANSPORT') private security_user: ClientProxy,

    @Inject('RABBIT_SERVICE_ZONES') private service_zone: ClientProxy,
  ) {}

  /* ---------------------- */

  async findOne(id: number): Promise<RsGetCustomerDto> {
    let rsGetCustomerDto: RsGetCustomerDto = null;

    try {
      const userDB = await this.userRepository
        .createQueryBuilder()
        .select([
          'id',
          'name',
          'address',
          'ST_Y(location) as latitude',
          'ST_X(location) as longitude',
          'zone_id',
          'role_id',
        ])
        .where('id =  :paramId', { paramId: id })
        .getRawOne();
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        if (userDB === null || userDB === undefined) {
        rsGetCustomerDto = this.rqRsFactoryService.UserEntitytoDTOResponse(
          HttpStatus.NOT_FOUND,
          'Invalid user',
          null,
        );
      } else {
        rsGetCustomerDto = this.rqRsFactoryService.UserEntitytoDTOResponse(
          HttpStatus.OK,
          '',
          userDB,
        );
      }
    } catch (e) {
      rsGetCustomerDto = this.rqRsFactoryService.UserEntitytoDTOResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Failed to get user',
        null,
      );
    }
    console.log('[ms-customer-get][service] - findOne(', rsGetCustomerDto, ')');
    return rsGetCustomerDto;
  }

  /* ---------------------- */

  async create(businessUser: BusinessUser): Promise<RsCreateCustomerDto> {
    let rsCreateCustomerDto: RsCreateCustomerDto = null;

    try {
      const rqGetZone: RqGetZoneDto =
        this.rqRsFactoryService.createRqGetZoneDto(businessUser.zone_id);
      const zoneResponse = await firstValueFrom(
        this.service_zone.send({ cmd: 'ms-get-zone-by-id' }, rqGetZone),
      );
      if (
        zoneResponse !== null &&
        zoneResponse.rsGenericHeaderDto.statusCode === HttpStatus.OK
      ) {
        const customerDB = await this.userRepository
          .createQueryBuilder()
          .insert()
          .into(User)
          .values([
            {
              address: businessUser.address,
              role_id: businessUser.role_id,
              zone_id: businessUser.zone_id,
              name: businessUser.name,
              // Must be: POINT(longitude,latitude)
              location: () =>
                `ST_GeomFromText('POINT(${businessUser.longitude} ${businessUser.latitude} )')`,
            },
          ])
          .execute();
        if (customerDB !== null) {
          const rqRegisterUserDto =
            this.rqRsFactoryService.createRegisterUserDto(
              businessUser.role_id,
              customerDB.raw.insertId,
              businessUser.username,
              businessUser.password,
            );
          const res_security = await firstValueFrom(
            this.security_user.send('ms-security-register', rqRegisterUserDto),
          );
          if (
            !res_security ||
            res_security.rsGenericHeaderDto.statusCode !== HttpStatus.CREATED
          ) {
            rsCreateCustomerDto =
              this.rqRsFactoryService.UserEntitytoDTOResponse(
                HttpStatus.FAILED_DEPENDENCY,
                'Failed to create security user',
                null,
              );
          }
        } else {
          rsCreateCustomerDto = this.rqRsFactoryService.UserEntitytoDTOResponse(
            HttpStatus.CREATED,
            'Failed to create user',
            null,
          );
        }
      } else {
        // Zone
        rsCreateCustomerDto = this.rqRsFactoryService.UserEntitytoDTOResponse(
          HttpStatus.FAILED_DEPENDENCY,
          'Failed to create user - invalid zone',
          null,
        );
      }
    } catch (e) {
      rsCreateCustomerDto = this.rqRsFactoryService.UserEntitytoDTOResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Failed to create user',
        null,
      );
    }

    console.log(
      '[ms-customer-create][service] - create(',
      rsCreateCustomerDto,
      ')',
    );
    return rsCreateCustomerDto;
  }

  /* ---------------------- */

  async findByZone(zone_id: number): Promise<RsGetCustomesByZoneDto> {
    const rsGetCustomesByZoneDto =
      this.rqRsFactoryService.createRsGetUsersByZone(HttpStatus.OK, '', []);

    try {
      const usersDB: UserByZone[] = await this.userRepository
        .createQueryBuilder()
        .select([
          'id',
          'name',
          'address',
          'ST_Y(location) as latitude',
          'ST_X(location) as longitude',
          'zone_id',
          'role_id',
        ])
        .where('zone_id =  :paramId', { paramId: zone_id })
        .getRawMany();
      if (usersDB) {
        usersDB.forEach((elem) => {
          const rsCustomer = this.rqRsFactoryService.createRsCustomer(elem);
          rsGetCustomesByZoneDto.customers.push(rsCustomer);
        });
      } else {
        rsGetCustomesByZoneDto.rsGenericHeaderDto.statusCode =
          HttpStatus.NOT_FOUND;
        rsGetCustomesByZoneDto.rsGenericHeaderDto.message =
          'Users by zone. Not Found.';
        rsGetCustomesByZoneDto.customers = null;
      }
    } catch (error) {
      rsGetCustomesByZoneDto.rsGenericHeaderDto.statusCode =
        HttpStatus.INTERNAL_SERVER_ERROR;
      rsGetCustomesByZoneDto.rsGenericHeaderDto.message =
        'Failed to find users by zone';
      rsGetCustomesByZoneDto.customers = null;
    }
    console.log(
      '[ms-customers-by-zone-get][service] (',
      rsGetCustomesByZoneDto,
      ')',
    );

    return rsGetCustomesByZoneDto;
  }
}

/* ------------------------------------------------------ */
