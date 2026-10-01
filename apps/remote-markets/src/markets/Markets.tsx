import { useEffect, useState } from 'react';
import * as React from 'react';
import * as sharedState from '@mbg/shared-state';
import { toggleMarket, usePreferredMarkets } from '@mbg/shared-state';
import type { MarketDto } from '@mbg/contracts';

//todo DELETE DEBUG
// @ts-expect-error debug-only
window.__marketsReact = React;
// @ts-expect-error debug-only
window.__marketsStore = sharedState;
//todo DELETE DEBUG

const API_URL = 'http://localhost:8081';

export default function Markets() {
  const [markets, setMarkets] = useState<MarketDto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);


  const preferred = usePreferredMarkets();

  useEffect(() => {
    let cancelled = false;

    fetch(`${API_URL}/markets`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<MarketDto[]>;
      })
      .then((data) => {
        if (!cancelled) setMarkets(data);
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
  }, []);

  if (loading) return <p style={styles.muted}>Cargando mercados…</p>;
  if (error) return <p style={styles.error}>No se pudo cargar mercados: {error}</p>;

  return (
    <section style={styles.card}>
      <h2 style={styles.title}>Mercados internacionales</h2>
      <p style={styles.hint}>
        Tildá los mercados que te interesan. El remote de noticias se actualiza solo.
      </p>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th} />
            <th style={styles.th}>Mercado</th>
            <th style={styles.th}>País</th>
            <th style={styles.th}>Moneda</th>
          </tr>
        </thead>
        <tbody>
          {markets.map((m) => (
            <tr key={m.marketId}>
              <td style={styles.td}>
                <input
                  type="checkbox"
                  checked={preferred.includes(m.marketId)}
                  onChange={() => toggleMarket(m.marketId)}
                  aria-label={`Seguir ${m.name}`}
                />
              </td>
              <td style={styles.td}>
                <strong>{m.marketId}</strong> · {m.name}
              </td>
              <td style={styles.td}>{m.country}</td>
              <td style={styles.td}>
                {m.currency.symbol} {m.currency.code}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={styles.selection}>
        Seleccionados: <strong>{preferred.join(', ') || '(ninguno)'}</strong>
      </p>
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
    margin: '0 0 4px', 
    fontSize: 16 
  },
  hint: { 
    margin: '0 0 12px', 
    fontSize: 12, 
    color: '#6b7680' 
  },
  table: { 
    width: '100%', 
    borderCollapse: 'collapse', 
    fontSize: 14 
  },
  th: {
    textAlign: 'left',
    padding: '6px 8px',
    borderBottom: '2px solid #e5e9ee',
    color: '#5a6672',
    fontWeight: 600,
  },
  td: { padding: '6px 8px', borderBottom: '1px solid #eef1f4' },
  selection: { 
    marginTop: 12, 
    marginBottom: 0, 
    fontSize: 12, 
    color: '#3c4a57' 
  },
  muted: { color: '#6b7680' },
  error: { color: '#b4232a' },
};
