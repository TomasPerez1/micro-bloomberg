import { BadRequestException, Injectable } from '@nestjs/common';
import { NewsRepository, type NewsRow } from './news.repository.js';

export interface NewsDto {
  id: string;
  title: string;
  body: string;
  source: string;
  publishedAt: string | null;
  marketIds: string[];
}

export interface CreateNewsInput {
  title?: unknown;
  body?: unknown;
  source?: unknown;
  marketIds?: unknown;
  publish?: unknown;
}

@Injectable()
export class NewsService {
  constructor(private readonly repo: NewsRepository) {}

  async listPublished(marketIds: string[] | null): Promise<NewsDto[]> {
    const rows = await this.repo.findPublished(marketIds);
    return rows.map(toNewsDto);
  }

  async create(input: CreateNewsInput): Promise<NewsDto> {
    const title = requireString(input.title, 'title');
    const body = requireString(input.body, 'body');
    const source = requireString(input.source, 'source');

    const marketIds = Array.isArray(input.marketIds)
      ? input.marketIds.filter((m): m is string => typeof m === 'string')
      : [];

    const row = await this.repo.create({
      title,
      body,
      source,
      marketIds,
      publish: input.publish !== false,
    });

    return toNewsDto(row);
  }
}

function toNewsDto(row: NewsRow): NewsDto {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    source: row.source,
    publishedAt: row.published_at ? row.published_at.toISOString() : null,
    marketIds: row.market_ids,
  };
}

function requireString(value: unknown, field: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new BadRequestException(`${field} es requerido`);
  }
  return value.trim();
}
