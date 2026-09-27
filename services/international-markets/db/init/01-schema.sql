-- Servicio international-markets

CREATE TABLE currencies (
  code   CHAR(3) PRIMARY KEY, -- ISO 4217
  name   TEXT    NOT NULL,
  symbol TEXT    NOT NULL
);

CREATE TABLE international_markets (
  market_id     TEXT    PRIMARY KEY,
  name          TEXT    NOT NULL,
  country       TEXT    NOT NULL,
  currency_code CHAR(3) NOT NULL REFERENCES currencies (code)
);

-- Preferencias del usuario.
-- Este servicio es dueño de UNA parte del usuario, los mercados que sigue. No de su identidad.

CREATE TABLE preferred_markets (
  user_id   TEXT NOT NULL,
  market_id TEXT NOT NULL REFERENCES international_markets (market_id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, market_id)
);


-- No es fuente de verdad: es una proyección local de hechos del servicio news, escucha los eventos news.published / news.deleted.

CREATE TABLE market_news_activity (
  market_id  TEXT    NOT NULL REFERENCES international_markets (market_id) ON DELETE CASCADE,
  day        DATE    NOT NULL,
  news_count INTEGER NOT NULL DEFAULT 0 CHECK (news_count >= 0),
  PRIMARY KEY (market_id, day)
);

-- Ledger
-- Con SQSel mismo mensaje puede llegar dos veces. por esp la PRIMARY KEY 

CREATE TABLE processed_events (
  message_id   UUID        PRIMARY KEY,
  event_type   TEXT        NOT NULL,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);