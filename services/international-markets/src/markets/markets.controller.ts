import { Controller, Get, Headers, Param } from '@nestjs/common';
import {
  MarketsService,
  type MarketActivityDto,
  type MarketDto,
} from './markets.service.js';

@Controller('markets')
export class MarketsController {
  constructor(private readonly markets: MarketsService) {}

  @Get()
  listMarkets(): Promise<MarketDto[]> {
    return this.markets.listMarkets();
  }

  @Get('preferred')
  listPreferred(
    @Headers('x-user-id') userId = 'pelucheado',
  ): Promise<MarketDto[]> {
    return this.markets.listPreferred(userId);
  }

  @Get(':marketId/activity')
  getActivity(
    @Param('marketId') marketId: string,
  ): Promise<MarketActivityDto> {
    return this.markets.getActivity(marketId);
  }
}
