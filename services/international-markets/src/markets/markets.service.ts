import { Injectable, NotFoundException } from '@nestjs/common';
import { MarketsRepository } from './markets.repository.js';

export interface MarketDto {
  marketId: string;
  name: string;
  country: string;
  currency: { code: string; name: string; symbol: string };
}

export interface MarketActivityDto {
  marketId: string;
  days: { day: string; newsCount: number }[];
  total: number;
}

@Injectable()
export class MarketsService {
  constructor(private readonly repo: MarketsRepository) {}

  async listMarkets(): Promise<MarketDto[]> {
    const rows = await this.repo.findAll();
    return rows.map(toMarketDto);
  }

  async listPreferred(userId: string): Promise<MarketDto[]> {
    const rows = await this.repo.findPreferredByUser(userId);
    return rows.map(toMarketDto);
  }

  async getActivity(marketId: string): Promise<MarketActivityDto> {
    const market = await this.repo.findById(marketId);
    if (!market) {
      throw new NotFoundException(`Mercado ${marketId} no existe`);
    }

    const rows = await this.repo.findActivity(marketId);
    return {
      marketId,
      days: rows.map((r) => ({ day: r.day, newsCount: Number(r.news_count) })),
      total: rows.reduce((acc, r) => acc + Number(r.news_count), 0),
    };
  }
}

function toMarketDto(row: {
  market_id: string;
  name: string;
  country: string;
  currency_code: string;
  currency_name: string;
  currency_symbol: string;
}): MarketDto {
  return {
    marketId: row.market_id,
    name: row.name,
    country: row.country,
    currency: {
      code: row.currency_code.trim(),
      name: row.currency_name,
      symbol: row.currency_symbol,
    },
  };
}
