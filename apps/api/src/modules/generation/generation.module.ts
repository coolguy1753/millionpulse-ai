import { Module } from '@nestjs/common';
import { GenerationService } from './generation.service';
import { IngestService } from './ingest.service';
import { GenerationController, ShareController } from './generation.controller';

@Module({
  controllers: [GenerationController, ShareController],
  providers: [GenerationService, IngestService],
})
export class GenerationModule {}
