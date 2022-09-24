import { Controller, Inject } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { AppService } from './app.service';
import { BusinessUser } from './business-entities/business.user.entity';
import {
  RqCreateCustomerDto,
  RqGetCustomerDto,
  RqGetCustomersByZoneDto,
} from './dto';
import { IRqRsFactory, RQ_RS_FACTORY_SERVICE } from './interfaces';

/* ------------------------------------------------ */

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,

    @Inject(RQ_RS_FACTORY_SERVICE)
    private readonly rqRsFactoryService: IRqRsFactory,
  ) {}

  /* ------------- */

  @MessagePattern('ms-customer-get')
  async getUser(rqGetCustomerDto: RqGetCustomerDto) {
    const { id } = rqGetCustomerDto;
    return await this.appService.findOne(id);
  }

  /* ------------- */

  @MessagePattern('ms-customer-create')
  async create(rqCreateCustomerDto: RqCreateCustomerDto) {
    const userBusinessData: BusinessUser =
      this.rqRsFactoryService.DTORequesttoBusinessUserEntity(
        rqCreateCustomerDto,
      );
    return await this.appService.create(userBusinessData);
  }

  /* ------------- */

  @MessagePattern('ms-customers-by-zone-get')
  async getUsersByZone(rqGetCustomersByZoneDto: RqGetCustomersByZoneDto) {
    const { zone_id } = rqGetCustomersByZoneDto;
    return await this.appService.findByZone(zone_id);
  }
}

/* ------------------------------------------------ */
