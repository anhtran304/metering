import { SetMetadata } from '@nestjs/common';

export const Operations = (...operations: string[]) =>
         SetMetadata('operations', operations);
