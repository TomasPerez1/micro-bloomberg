-- Seed mínimo para tener algo que renderizar en el remote de news.
-- Zona delegable (etapa-0.md): datos seed / mocks de market data.

INSERT INTO news (id, title, body, source, status, published_at) VALUES
  ('11111111-1111-1111-1111-111111111111',
   'Peso argentino cierra estable frente al dólar',
   'El tipo de cambio mayorista cerró la jornada sin variaciones significativas.',
   'Reuters', 'published', now() - interval '2 hours'),
  ('22222222-2222-2222-2222-222222222222',
   'Bovespa sube 1,8% impulsado por commodities',
   'El índice brasileño cerró en alza tras la suba del hierro y la soja.',
   'Bloomberg', 'published', now() - interval '5 hours'),
  ('33333333-3333-3333-3333-333333333333',
   'La Fed mantiene la tasa de referencia',
   'El comité decidió no modificar la tasa en su reunión de septiembre.',
   'AP', 'published', now() - interval '1 day'),
  ('44444444-4444-4444-4444-444444444444',
   'Borrador sin publicar',
   'Esta noticia está en draft: no debe aparecer en GET /news.',
   'Interno', 'draft', NULL);

INSERT INTO news_market (news_id, market_id) VALUES
  ('11111111-1111-1111-1111-111111111111', 'AR'),
  ('22222222-2222-2222-2222-222222222222', 'BR'),
  ('33333333-3333-3333-3333-333333333333', 'US'),
  ('33333333-3333-3333-3333-333333333333', 'AR'),  -- una noticia puede tocar varios mercados
  ('44444444-4444-4444-4444-444444444444', 'AR');
