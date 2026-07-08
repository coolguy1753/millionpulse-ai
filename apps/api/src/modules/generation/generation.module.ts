import { Module } from '@nestjs/common';
import { GenerationService } from './generation.service';
import { GenerationController, ShareController } from './generation.controller';

@Module({
  controllers: [GenerationController, ShareController],
  providers: [GenerationService],
})
export class GenerationModule {}
