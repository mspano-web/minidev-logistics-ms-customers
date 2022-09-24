import { RsGenericHeaderDto } from './rs-generic-header.dto';

/* ----------------------------------- */

export class PointDto {
  latitude: number;
  longitud: number;
}

/* ----------------------------------- */

export class RsCustomer {
  id: number;
  name: string;
  address: string;
  location: PointDto;    
  zone_id: number;
  role_id: number;

  constructor(
    id: number,
    name: string,
    address: string,
    location: PointDto, 
    zone_id: number,
    role_id: number
  ) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.location = location;
    this.zone_id = zone_id;
    this.role_id = role_id
  }
}

/* ----------------------------------- */

export class RsGetCustomesByZoneDto {
  rsGenericHeaderDto: RsGenericHeaderDto;
  customers?: RsCustomer[];

  constructor(
    rsGenericHeaderDto: RsGenericHeaderDto,
    users: RsCustomer[],
  ) {
    this.rsGenericHeaderDto = rsGenericHeaderDto;
    this.customers = users;
  }

}

/* ----------------------------------- */

