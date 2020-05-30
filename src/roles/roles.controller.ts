import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  UseFilters,
} from '@nestjs/common';
import { Response } from 'express';

import { OperationsGuard } from '../common/guards/operation.guard';
import { RoleExceptionFilter } from '../common/filters/role-exceptions.filter';
import { Operations } from 'src/common/decorators/operations.decorator';
import { RolesService } from './roles.service';

@UseGuards(OperationsGuard)
@Controller('/api/roles')
@UseFilters(RoleExceptionFilter)
export class RolesController {
  constructor(private rolesService: RolesService) {}
  @Get('/')
  @Operations('GET_ALL_ROLES')
  getAll(@Res() res: Response) {
    this.rolesService
      .findAllRoles()
      .then((data) => {
        const allRoles = data.map((d) => d.RoleName);
        const returnData = allRoles.reduce(
          (ac, a) => ({ ...ac, [a]: false }),
          {}
        );
        // console.log(obj);
        res.json({ roles: returnData });
      })
      .catch((error) => res.json({ roles: null, message: error }));
  }
}
