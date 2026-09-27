-- Seed mínimo para que funcione

INSERT INTO currencies (code, name, symbol) VALUES
  ('USD', 'US Dollar',         '$'),
  ('ARS', 'Peso Argentino',    '$'),
  ('BRL', 'Real Brasileño',    'R$'),
  ('EUR', 'Euro',              '€'),
  ('JPY', 'Yen Japonés',       '¥');

INSERT INTO international_markets (market_id, name, country, currency_code) VALUES
  ('US', 'NYSE / Nasdaq',   'Estados Unidos', 'USD'),
  ('AR', 'BYMA',            'Argentina',      'ARS'),
  ('BR', 'B3 / Bovespa',    'Brasil',         'BRL'),
  ('EU', 'Euronext',        'Unión Europea',  'EUR'),
  ('JP', 'Tokyo Stock Exchange', 'Japón',     'JPY');

-- Usuarios de prueba, no hay tabla users ni FK.

INSERT INTO preferred_markets (user_id, market_id) VALUES
  ('pelucheado',  'AR'),
  ('pelucheado',  'BR'),
  ('zaracatunga', 'US'),
  ('zaracatunga', 'JP');
