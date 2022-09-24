import { RsGenericHeaderDto } from './rs-generic-header.dto';

/* ----------------------------------- */

export class RsGetZoneDataDto {
  description: string;
}

/* ----------------------------------- */

export class RsGetZoneDto {
  rsGenericHeaderDto: RsGenericHeaderDto;
  rsGetZoneDataDto?: RsGetZoneDataDto;
}

/* ----------------------------------- */
