import { Module } from '@nestjs/common';
import { VerticalsController } from './verticals.controller';
import { RolesController } from './roles.controller';
import { UsersController } from './users.controller';
import { GlobalReviewsController } from './reviews.controller';
import { TemplatesCatalogController } from './templates.controller';
import { BillingController } from './billing.controller';

@Module({
  controllers: [
    VerticalsController,
    RolesController,
    UsersController,
    GlobalReviewsController,
    TemplatesCatalogController,
    BillingController,
  ],
})
export class HqModule {}
