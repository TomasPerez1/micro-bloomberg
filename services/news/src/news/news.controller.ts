import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import {
  NewsService,
  type CreateNewsInput,
  type NewsDto,
} from './news.service.js';

@Controller('news')
export class NewsController {
  constructor(private readonly news: NewsService) {}

  @Get()
  listNews(@Query('markets') markets?: string): Promise<NewsDto[]> {
    const marketIds = parseMarkets(markets);
    return this.news.listPublished(marketIds);
  }

  @Post()
  create(@Body() body: CreateNewsInput): Promise<NewsDto> {
    return this.news.create(body);
  }
}

function parseMarkets(raw?: string): string[] | null {
  if (!raw) return null;
  const ids = raw
    .split(',')
    .map((m) => m.trim().toUpperCase())
    .filter((m) => m.length > 0);
  return ids.length > 0 ? ids : null;
}
