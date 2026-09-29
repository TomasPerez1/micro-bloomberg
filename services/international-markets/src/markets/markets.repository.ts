import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { DATABASE_POOL } from '../database/database.module.js';

export interface MarketRow {
  market_id: string;
  name: string;
  country: string;
  currency_code: string;
  currency_name: string;
  currency_symbol: string;
}

export interface ActivityRow {
  day: string;
  news_count: number;
}


@Injectable()
export class MarketsRepository {
  constructor(@Inject(DATABASE_POOL) private readonly pool: Pool) {}

  async findAll(): Promise<MarketRow[]> {
    const { rows } = await this.pool.query<MarketRow>(
      `SELECT m.market_id,
              m.name,
              m.country,
              m.currency_code,
              c.name   AS currency_name,
              c.symbol AS currency_symbol
          FROM international_markets m
          JOIN currencies c ON c.code = m.currency_code
        ORDER BY m.market_id
      `,
    );
    return rows;
  }

  async findById(marketId: string): Promise<MarketRow | null> {
    const { rows } = await this.pool.query<MarketRow>(
      `SELECT m.market_id,
              m.name,
              m.country,
              m.currency_code,
              c.name   AS currency_name,
              c.symbol AS currency_symbol
          FROM international_markets m
          JOIN currencies c ON c.code = m.currency_code
        WHERE m.market_id = $1`,
      [marketId],
    );
    return rows[0] ?? null;
  }

  async findActivity(marketId: string, days = 30): Promise<ActivityRow[]> {
    const { rows } = await this.pool.query<ActivityRow>(
      `SELECT day, news_count
          FROM market_news_activity
        WHERE market_id = $1
        ORDER BY day DESC
        LIMIT $2`,
      [marketId, days],
    );
    return rows;
  }

  async findPreferredByUser(userId: string): Promise<MarketRow[]> {
    const { rows } = await this.pool.query<MarketRow>(
      `SELECT m.market_id,
              m.name,
              m.country,
              m.currency_code,
              c.name   AS currency_name,
              c.symbol AS currency_symbol
          FROM preferred_markets p
          JOIN international_markets m ON m.market_id = p.market_id
          JOIN currencies c            ON c.code      = m.currency_code
        WHERE p.user_id = $1
        ORDER BY m.market_id`,
      [userId],
    );
    return rows;
  }
}
