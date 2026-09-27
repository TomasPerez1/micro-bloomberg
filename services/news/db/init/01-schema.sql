-- Servicio news 

CREATE TABLE news (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT        NOT NULL,
  body         TEXT        NOT NULL,
  source       TEXT        NOT NULL,
  status       TEXT        NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'deleted')),
  published_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);


CREATE INDEX idx_news_status_published_at ON news (status, published_at DESC);


CREATE TABLE news_market (
  news_id   UUID NOT NULL REFERENCES news (id) ON DELETE CASCADE,
  market_id TEXT NOT NULL,
  PRIMARY KEY (news_id, market_id)
);

CREATE INDEX idx_news_market_market_id ON news_market (market_id);
