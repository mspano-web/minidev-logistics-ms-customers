import { RsGenericHeaderDto } from './rs-generic-header.dto';

/* ----------------------------------- */

export class RsRegisterUserDataDto {
  id: number;
}

/* ----------------------------------- */

export class RsRegisterUserDto {
  rsGenericHeaderDto: RsGenericHeaderDto;
  rsRegisterUserDataDto?: RsRegisterUserDataDto;
}

/* ----------------------------------- */
