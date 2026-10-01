
export interface CurrencyDto {
  code: string;
  name: string;
  symbol: string;
}

export interface MarketDto {
  marketId: string;
  name: string;
  country: string;
  currency: CurrencyDto;
}

export interface MarketActivityDto {
  marketId: string;
  days: { day: string; newsCount: number }[];
  total: number;
}

export interface NewsDto {
  id: string;
  title: string;
  body: string;
  source: string;
  publishedAt: string | null;
  marketIds: string[];
}

export interface EventEnvelope<TType extends string, TPayload> {
  id: string;
  type: TType;
  version: 1;
  occurredAt: string;
  payload: TPayload;
}

export interface NewsPublishedPayload {
  newsId: string;
  marketIds: string[];
  publishedAt: string;
}

export interface NewsDeletedPayload {
  newsId: string;
  marketIds: string[];
  deletedAt: string;
}

export type NewsPublishedEvent = EventEnvelope<'news.published', NewsPublishedPayload>;

export type NewsDeletedEvent = EventEnvelope<'news.deleted', NewsDeletedPayload>;

export type NewsEvent = NewsPublishedEvent | NewsDeletedEvent;
