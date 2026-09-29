import { Inject, Injectable } from '@nestjs/common';
import { Pool, type PoolClient } from 'pg';
import { DATABASE_POOL } from '../database/database.module.js';

export interface NewsRow {
  id: string;
  title: string;
  body: string;
  source: string;
  published_at: Date | null;
  market_ids: string[];
}

export interface CreateNewsData {
  title: string;
  body: string;
  source: string;
  marketIds: string[];
  publish: boolean;
}

@Injectable()
export class NewsRepository {
  constructor(@Inject(DATABASE_POOL) private readonly pool: Pool) {}

  async findPublished(marketIds: string[] | null, limit = 50): Promise<NewsRow[]> {
    const { rows } = await this.pool.query<NewsRow>(
      `SELECT n.id,
              n.title,
              n.body,
              n.source,
              n.published_at,
              COALESCE(
                ARRAY_AGG(nm.market_id ORDER BY nm.market_id)
                  FILTER (WHERE nm.market_id IS NOT NULL),
                '{}'
              ) AS market_ids
          FROM news n
          LEFT JOIN news_market nm ON nm.news_id = n.id
            WHERE n.status = 'published'
              AND ($1::text[] IS NULL OR EXISTS (
                    SELECT 1
                      FROM news_market f
                    WHERE f.news_id = n.id
                      AND f.market_id = ANY($1::text[])
                  ))
          GROUP BY n.id
          ORDER BY n.published_at DESC
          LIMIT $2`,
      [marketIds, limit],
    );
    return rows;
  }

  async findById(id: string): Promise<NewsRow | null> {
    const { rows } = await this.pool.query<NewsRow>(
      `SELECT n.id,
              n.title,
              n.body,
              n.source,
              n.published_at,
              COALESCE(
                ARRAY_AGG(nm.market_id ORDER BY nm.market_id)
                  FILTER (WHERE nm.market_id IS NOT NULL),
                '{}'
              ) AS market_ids
          FROM news n
          LEFT JOIN news_market nm ON nm.news_id = n.id
        WHERE n.id = $1
        GROUP BY n.id`,
      [id],
    );
    return rows[0] ?? null;
  }

  async create(data: CreateNewsData): Promise<NewsRow> {
    const client: PoolClient = await this.pool.connect();
    try {
      await client.query('BEGIN');

      const { rows } = await client.query<{ id: string }>(
        `INSERT INTO news (title, body, source, status, published_at)
              VALUES ($1, $2, $3, $4, $5)
            RETURNING id`,
        [
          data.title,
          data.body,
          data.source,
          data.publish ? 'published' : 'draft',
          data.publish ? new Date() : null,
        ],
      );
      const id = rows[0]!.id;

      if (data.marketIds.length > 0) {
        await client.query(
          `INSERT INTO news_market (news_id, market_id)
            SELECT $1, UNNEST($2::text[])`,
          [id, data.marketIds],
        );
      }


      await client.query('COMMIT');

      const created = await this.findById(id);
      return created!;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}
