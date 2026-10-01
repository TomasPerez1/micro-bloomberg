import { useEffect, useState } from 'react';
import type { NewsDto } from '@mbg/contracts';

const API_URL = 'http://localhost:8082';

export type NewsItem = NewsDto;

export interface NewsProps {
  markets?: string[];
}

export default function News({ markets }: NewsProps) {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const query = markets?.length ? `?markets=${markets.join(',')}` : '';

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetch(`${API_URL}/news${query}`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<NewsItem[]>;
      })
      .then((data) => {
        if (!cancelled) setItems(data);
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [query]);

  if (loading) return <p style={styles.muted}>Cargando noticias…</p>;
  if (error) return <p style={styles.error}>No se pudo cargar noticias: {error}</p>;

  return (
    <section style={styles.card}>
      <h2 style={styles.title}>
        Noticias {markets?.length ? `· ${markets.join(', ')}` : ''}
      </h2>

      {items.length === 0 && <p style={styles.muted}>Sin noticias para este filtro.</p>}

      <ul style={styles.list}>
        {items.map((n) => (
          <li key={n.id} style={styles.item}>
            <div style={styles.itemTitle}>{n.title}</div>
            <div style={styles.meta}>
              {n.source}
              {n.publishedAt && ` · ${new Date(n.publishedAt).toLocaleString('es-AR')}`}
            </div>
            <div style={styles.tags}>
              {n.marketIds.map((m) => (
                <span key={m} style={styles.tag}>
                  {m}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    border: '1px solid #d8dde3',
    borderRadius: 8,
    padding: 16,
    background: '#fff',
  },
  title: { 
    margin: '0 0 12px', 
    fontSize: 16 
  },
  list: { 
    listStyle: 'none', 
    margin: 0, 
    padding: 0 
  },
  item: { 
    padding: '10px 0', 
    borderBottom: '1px solid #eef1f4' 
  },
  itemTitle: { 
    fontWeight: 600, 
    fontSize: 14 
  },
  meta: { 
    fontSize: 12, 
    color: '#6b7680', 
    marginTop: 2 
  },
  tags: { 
    marginTop: 6, 
    display: 'flex', 
    gap: 6, 
    flexWrap: 'wrap' 
  },
  tag: {
    fontSize: 11,
    background: '#eef2f6',
    borderRadius: 4,
    padding: '2px 6px',
    color: '#3c4a57',
  },
  muted: { color: '#6b7680' },
  error: { color: '#b4232a' },
};
