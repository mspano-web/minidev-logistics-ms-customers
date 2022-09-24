import { RsGenericHeaderDto } from './rs-generic-header.dto';

/* ----------------------------------- */

export class PointDto {
  latitude: number;
  longitud: number;
}

/* ----------------------------------- */

export class RsGetCustomerDataDto {
  id: number;
  name: string;
  address: string;
  location: PointDto;
  zone_id: number;
  role_id: number;
}

/* ----------------------------------- */

export class RsGetCustomerDto {
  rsGenericHeaderDto: RsGenericHeaderDto;
  rsGetCustomerDataDto?: RsGetCustomerDataDto;

  constructor(
    rsGenericHeaderDto: RsGenericHeaderDto,
    rsGetCustomerDataDto: RsGetCustomerDataDto,
  ) {
    this.rsGenericHeaderDto = rsGenericHeaderDto;
    this.rsGetCustomerDataDto = rsGetCustomerDataDto;
  }
}

/* ----------------------------------- */
