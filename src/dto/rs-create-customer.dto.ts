import { RsGenericHeaderDto } from "./rs-generic-header.dto";

/* ----------------------------------- */

export class RsCreateCustomerDataDto {
    id: number;
}

/* ----------------------------------- */

export class RsCreateCustomerDto {
    rsGenericHeaderDto: RsGenericHeaderDto;
    rsCreateCustomerDataDto?: RsCreateCustomerDataDto;

    constructor(
        rsGenericHeaderDto: RsGenericHeaderDto,
        rsCreateCustomerDataDto: RsCreateCustomerDataDto,
      ) {
        this.rsGenericHeaderDto = rsGenericHeaderDto;
        this.rsCreateCustomerDataDto = rsCreateCustomerDataDto;
      }
}

/* ----------------------------------- */

