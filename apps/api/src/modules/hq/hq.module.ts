import { Module } from '@nestjs/common';
import { VerticalsController } from './verticals.controller';
import { RolesController } from './roles.controller';
import { UsersController } from './users.controller';

@Module({ controllers: [VerticalsController, RolesController, UsersController] })
export class HqModule {}
