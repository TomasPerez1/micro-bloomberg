import { Module } from '@nestjs/common';
import { MarketsController } from './markets.controller.js';
import { MarketsRepository } from './markets.repository.js';
import { MarketsService } from './markets.service.js';


@Module({
  controllers: [MarketsController],
  providers: [MarketsService, MarketsRepository],
})
export class MarketsModule {}
